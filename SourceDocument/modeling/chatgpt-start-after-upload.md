# Start After Upload

Use this as the first message after uploading the ZIP to ChatGPT.

```text
Read SYSTEM_READ_FIRST.md first.
Then read 00_START_HERE_UPLOAD_THIS_TO_CHATGPT.md.
Then read chatgpt-context-retention-protocol.md from supporting_docs if available.
Then read chatgpt-image-output-rules.md from supporting_docs if available.
Then read chatgpt-kangaroo-layout-style-guide.md from supporting_docs if available.
Then read minecraft-scale-reference.md from supporting_docs if available.
Then read blockbench-scale-rules.md from supporting_docs if available.
Then read all remaining supporting_docs and reference_templates.
If blockbench_samples is included, read its README and `sample_selection_manifest.json`, then use the .bbmodel files only as structure and quality calibration.

Do not generate reference images yet.
Do not choose an asset yourself.
Do not copy sample asset designs, names, textures, animations, or distinctive silhouettes.
Ask me only the required setup questions in the exact answer format below.
After reading all documents, keep the Working-Memory Card from chatgpt-context-retention-protocol.md active so you do not lose context.

After I answer, check whether anything is missing.
If something is missing, ask only the missing follow-up questions.
When the required answers are clear, choose the closest Blockbench sample calibration first: 1 primary sample, up to 2 secondary samples, or no sample if none fits.
When all required answers are clear, create the reference generation plan, matching `.notes.md` interpretation files for every reference image, reference_manifest.json, Geometry Blueprint table, and Codex-ready modelling request.
After all planned sheets and notes are complete, compile everything into `CODEX_REFERENCE_HANDOFF.md` so Codex has one clean handoff document.
Do not generate all reference images at once. Each planned filename must be a separate image or separate prompt. Do not merge multiple planned files into one collage, contact sheet, grid, poster, or combined canvas. Generate one file at a time only after the user asks for that file. If image generation is blocked, provide the prompt text for that file instead of retrying the same blocked request.
```

Expected ChatGPT reply:

```text
I have read the uploaded workflow. I will not generate references yet.
Tell me what you want to make. Short answers are fine.

1. What do you want to make?
   Example: "a magic backpack", "a small robot pet", "a boss dragon statue"

2. Is it animated later, or just a static display entity?
   Answer: Animated later / Static display entity / Not sure

3. What should it do in-game?
   Example: decoration, weapon display, pet, vehicle, storage prop, enemy, furniture-like entity

4. How big should it feel?
   Example: item-sized, 1 block tall, player-sized, bigger than a player, tiny pet

5. What style or theme should it have?
   Example: cute, scary, medieval, futuristic, jungle, Japanese, magical

6. Which 3-5 parts are most important visually?
   Example: head, tail, wings, backpack straps, glowing crystal

7. Should it be animation-ready later?
   Answer: No / Yes, and the moving parts are...

8. Do you want me to generate references from scratch, or will you upload references?
   Answer: Generate from scratch / I will upload references

9. Any must-have details?
   Example: must have horns, must hold a lantern, must have red armor

10. Anything to avoid?
   Example: no tiny legs, no realistic gore, no overly complex shape

Optional:
- Atlas size: recommend for me / 64x64 / 128x128 / 256x256 / 512x512
- Pixel style: recommend for me / default Minecraft 16x style / cleaner 32x style
```

## Acceptance Criteria

- ChatGPT reads the uploaded files first.
- ChatGPT asks setup questions before generation.
- User can answer by filling one compact form.
- ChatGPT asks follow-up questions only for missing required fields.
