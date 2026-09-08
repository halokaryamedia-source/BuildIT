export const BLOCKIT_USER_GUIDE_TEMPLATES = {
  reference_board: `Create a BlockIT reference board from the source image I attached.

Keep the subject recognizable and Minecraft / Blockbench-buildable.
Return one clean five-view board:
Upper: LEFT | FRONT | BACK
Lower: TOP | FRONT-LEFT 3/4

Use a neutral background, consistent subject scale, and generous spacing.
Do not add labels, borders, dimensions, UI, notes, or a cinematic scene.
Return one image only for my review.`,
  new_model: `Create a new BlockIT model from the reference image I attached.

Dimensions: ___ W × ___ H × ___ L Minecraft blocks
Geometry method: DIRECT / 3D_ASSISTED
Animation needed: YES / NO

Notes:
___`,
  continue_project: `Continue this BlockIT project from the last saved stage.`,
  improve_model: `Improve the model currently open in Blockbench.

Changes I want:
- ___

Use the attached reference image for visual matching if provided.`,
} as const;

export type BlockItGuideTemplateKey = keyof typeof BLOCKIT_USER_GUIDE_TEMPLATES;
