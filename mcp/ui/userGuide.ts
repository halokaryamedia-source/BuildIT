export const BLOCKIT_USER_GUIDE_TEMPLATES = {
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
