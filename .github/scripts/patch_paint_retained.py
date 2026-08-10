from pathlib import Path
import re


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected one match, found {count}")
    return text.replace(old, new, 1)


path = Path("mcp/server/tools/paint.ts")
text = path.read_text()

# Runtime Painter methods exist in official Blockbench source but are omitted or
# readonly in the public declarations. Keep the cast localized to this owner.
text = replace_once(
    text,
    "\nexport function registerPaintTools() {",
    "\nconst runtimePainter = Painter as unknown as BlockbenchRuntimePainter;\n\nexport function registerPaintTools() {",
    "paint runtime adapter",
)

# Restore concrete Zod inference at each registration. ToolSpec is intentionally
# broad for docs, so spreading it alone erases execute() argument types.
schema_by_index = {
    0: "paintFillToolParameters",
    1: "drawShapeToolParameters",
    2: "gradientToolParameters",
    3: "colorPickerToolParameters",
    4: "copyBrushToolParameters",
    5: "eraserToolParameters",
    6: "paintSettingsParameters",
    7: "paintWithBrushParameters",
    8: "createBrushPresetParameters",
    9: "loadBrushPresetParameters",
    10: "textureSelectionParameters",
    11: "textureLayerManagementParameters",
}
for index, schema in schema_by_index.items():
    old = f"...paintToolDocs[{index}],\n      async execute"
    new = f"...paintToolDocs[{index}],\n      parameters: {schema},\n      async execute"
    if old not in text:
        raise SystemExit(f"paint schema {index}: registration pattern missing")
    text = text.replace(old, new, 1)

# ColorPanel runtime accepts the secondary/no_sync arguments; pass them explicitly
# to match current official declarations without changing color semantics.
text = text.replace("ColorPanel.set(color);", "ColorPanel.set(color, false, false);")
text = text.replace("ColorPanel.set(start_color);", "ColorPanel.set(start_color, false, false);")
text = text.replace("ColorPanel.set(end_color, true);", "ColorPanel.set(end_color, true, false);")
text = text.replace("ColorPanel.set(colorHex);", "ColorPanel.set(colorHex, false, false);")
text = text.replace("const color = ColorPanel.get();", "const color = ColorPanel.get(false);")

# Use the localized runtime adapter only for Painter APIs missing/inaccurate in
# public declarations. Existing correctly typed Painter helpers remain untouched.
for method in [
    "startPaintTool",
    "stopPaintTool",
    "useShapeTool",
    "useGradientTool",
    "colorPicker",
    "movePaintTool",
]:
    text = text.replace(f"Painter.{method}", f"runtimePainter.{method}")

text = text.replace("Painter.mirror_painting =", "runtimePainter.mirror_painting =")
text = text.replace("Painter.lock_alpha =", "runtimePainter.lock_alpha =")
text = text.replace("Painter.erase_mode =", "runtimePainter.erase_mode =")
text = text.replace("const options = Painter.mirror_painting_options;", "const options = runtimePainter.mirror_painting_options;")

# Pixel alpha is a canvas byte already. Avoid relying on the stale getPixelColor
# declaration, whose official type incorrectly returns void.
text = replace_once(
    text,
    '''          // Get pixel color with alpha
          const pixelColor = Painter.getPixelColor(texture.ctx, x, y);
          const opacity = Math.floor(pixelColor.getAlpha() * 255);''',
    '''          // Read the alpha byte directly from the active texture canvas.
          const pixel = texture.ctx.getImageData(Math.floor(x), Math.floor(y), 1, 1).data;
          const opacity = pixel[3];''',
    "paint color picker alpha",
)

text = text.replace(
    "const preset = StateMemory.brush_presets.find(\n          (p) => p.name === preset_name\n        );",
    "const preset = StateMemory.brush_presets.find(\n          (p: { name: string }) => p.name === preset_name\n        );",
)

# Replace outdated IntMatrix pseudo-fields with the official matrix API and honor
# create/add/subtract/intersect for rectangular and elliptical selections.
selection_start = text.index("        Undo.initEdit({\n          textures: [texture],\n          bitmap: true,\n        });\n\n        const selection = texture.selection;", text.index('paintToolDocs[10].name'))
selection_end_marker = '        return `Applied ${action} to texture "${texture.name}"`;'
selection_end = text.index(selection_end_marker, selection_start) + len(selection_end_marker)
selection_block = '''        const selection = texture.selection;

        const applyMask = (
          predicate: (x: number, y: number) => boolean
        ) => {
          const previousOverride = selection.override;
          selection.activate();
          selection.setOverride(null);
          const selectionArray = selection.array;
          if (!selectionArray) {
            throw new Error("Texture selection matrix is unavailable.");
          }

          if (previousOverride === true) selectionArray.fill(1);
          if (previousOverride === false) selectionArray.fill(0);

          selection.forEachPixel((x, y, value, index) => {
            const inside = predicate(x, y);
            switch (mode) {
              case "create":
                selectionArray[index] = inside ? 1 : 0;
                break;
              case "add":
                if (inside) selectionArray[index] = 1;
                break;
              case "subtract":
                if (inside) selectionArray[index] = 0;
                break;
              case "intersect":
                if (!inside) selectionArray[index] = 0;
                break;
            }
          });
        };

        Undo.initSelection({ texture_selection: true });
        try {
          switch (action) {
            case "select_rectangle": {
              if (!coordinates) {
                throw new Error("Coordinates required for rectangle selection.");
              }
              const minX = Math.floor(Math.min(coordinates.x1, coordinates.x2));
              const maxX = Math.ceil(Math.max(coordinates.x1, coordinates.x2));
              const minY = Math.floor(Math.min(coordinates.y1, coordinates.y2));
              const maxY = Math.ceil(Math.max(coordinates.y1, coordinates.y2));
              applyMask((x, y) => x >= minX && x < maxX && y >= minY && y < maxY);
              break;
            }

            case "select_ellipse": {
              if (!coordinates) {
                throw new Error("Coordinates required for ellipse selection.");
              }
              const centerX = (coordinates.x1 + coordinates.x2) / 2;
              const centerY = (coordinates.y1 + coordinates.y2) / 2;
              const radiusX = Math.abs(coordinates.x2 - coordinates.x1) / 2;
              const radiusY = Math.abs(coordinates.y2 - coordinates.y1) / 2;
              if (radiusX === 0 || radiusY === 0) {
                throw new Error("Ellipse selection requires non-zero width and height.");
              }
              applyMask((x, y) => {
                const dx = (x + 0.5 - centerX) / radiusX;
                const dy = (y + 0.5 - centerY) / radiusY;
                return dx * dx + dy * dy <= 1;
              });
              break;
            }

            case "select_all":
              selection.setOverride(true);
              break;

            case "clear_selection":
              selection.clear();
              break;

            default:
              throw new Error(`Unsupported texture selection action: ${action}`);
          }

          UVEditor.updateSelectionOutline();
          Undo.finishSelection("Texture selection");
        } catch (error) {
          Undo.cancelSelection(true);
          UVEditor.updateSelectionOutline();
          throw error;
        }

        return `Applied ${action} to texture "${texture.name}"`;'''
text = text[:selection_start] + selection_block + text[selection_end:]

# Layer action enum is finite, but independent if-branches do not prove exhaustive
# return to TypeScript. Make the impossible path an explicit failed call.
text = replace_once(
    text,
    '''          BARS.updateConditions();
          return result;
        }
      },''',
    '''          BARS.updateConditions();
          return result;
        }

        throw new Error(`Unsupported texture layer action: ${action}`);
      },''',
    "paint layer exhaustive return",
)

path.write_text(text)
