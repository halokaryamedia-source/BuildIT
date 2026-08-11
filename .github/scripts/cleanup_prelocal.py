from pathlib import Path

# Align the modelling specialist with the now-compact standalone prompt.
modelling_path = Path('.agents/skills/blockbench-bedrock-modelling/SKILL.md')
modelling = modelling_path.read_text(encoding='utf-8')
old = 'Before a numeric local correction, use `inspect_element` once to obtain exact authored state, then declare the smallest **invariant**:'
new = 'Before a numeric local correction, reuse fresh exact authored state already returned for that target when sufficient; otherwise use `inspect_element` once. Then declare the smallest **invariant**:'
if modelling.count(old) != 1:
    raise SystemExit('modelling fresh-state anchor changed')
modelling_path.write_text(modelling.replace(old, new, 1), encoding='utf-8')

# Remove an unnecessary non-null assertion introduced by the size-range hardening.
element_path = Path('mcp/server/tools/element.ts')
element = element_path.read_text(encoding='utf-8')
old = '''}).superRefine((params, ctx) => {
  if (params.min_size === undefined || params.max_size === undefined) return;
  params.min_size.forEach((minimum, axis) => {
    if (minimum > params.max_size![axis]) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["max_size", axis],
        message: `max_size[${axis}] must be greater than or equal to min_size[${axis}].`,
      });
    }
  });
});'''
new = '''}).superRefine((params, ctx) => {
  const minSize = params.min_size;
  const maxSize = params.max_size;
  if (minSize === undefined || maxSize === undefined) return;

  minSize.forEach((minimum, axis) => {
    if (minimum > maxSize[axis]) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["max_size", axis],
        message: `max_size[${axis}] must be greater than or equal to min_size[${axis}].`,
      });
    }
  });
});'''
if element.count(old) != 1:
    raise SystemExit('element range-refine anchor changed')
element_path.write_text(element.replace(old, new, 1), encoding='utf-8')

# Historical snapshots stay available, but must not read as current state.
review_path = Path('docs/knowledge/reviews/codex-native-deferred-mcp-tool-loading-2026-08-11.md')
review = review_path.read_text(encoding='utf-8')
replacements = [
    (
        'Current actual stateless `tools/list` measurement after default-disabling generic per-face `apply_texture`:',
        'Historical post-`apply_texture` stateless `tools/list` snapshot:',
    ),
    (
        'Current callable measurement after both containments: **63 tools / 73,149 response characters / 48,614 input-schema characters / 12,020 description characters**.',
        'Historical snapshot after both containments: **63 tools / 73,149 response characters / 48,614 input-schema characters / 12,020 description characters**.',
    ),
    (
        'Current wire size is **73,174 response characters / 48,551 input-schema characters / 12,108 description characters**,',
        'That historical wire snapshot was **73,174 response characters / 48,551 input-schema characters / 12,108 description characters**,',
    ),
]
for old, new in replacements:
    if review.count(old) != 1:
        raise SystemExit(f'review measurement anchor changed: {old}')
    review = review.replace(old, new, 1)
review_path.write_text(review, encoding='utf-8')
