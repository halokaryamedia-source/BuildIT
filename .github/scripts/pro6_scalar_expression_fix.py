from pathlib import Path


def replace_once(path: str, old: str, new: str) -> None:
    p = Path(path)
    text = p.read_text()
    if old not in text:
        raise SystemExit(f"Expected text not found in {path}: {old[:160]!r}")
    p.write_text(text.replace(old, new, 1))


replace_once(
    "mcp/server/tools/animation.ts",
    '''        if (typeof values === "number") {
          keyframe.uniform = true;
          keyframe.set("x", values);
        } else {
          keyframe.uniform = false;
          keyframe.set("x", values[0]);
          keyframe.set("y", values[1]);
          keyframe.set("z", values[2]);
        }''',
    '''        if (typeof values === "number" || typeof values === "string") {
          keyframe.uniform = true;
          keyframe.set("x", values);
        } else {
          keyframe.uniform = false;
          keyframe.set("x", values[0]);
          keyframe.set("y", values[1]);
          keyframe.set("z", values[2]);
        }''',
)

# Strengthen the regression so schema acceptance cannot drift away from execution shape.
replace_once(
    "mcp/tests/animation-mutation-contract.test.ts",
    '''    expect(animationSource).toContain("values: number | string | Array<number | string> | undefined");
    expect(animationSource).not.toContain("MolangParser.parse(");''',
    '''    expect(animationSource).toContain("values: number | string | Array<number | string> | undefined");
    expect(animationSource).toContain('typeof values === "number" || typeof values === "string"');
    expect(animationSource).not.toContain("MolangParser.parse(");''',
)

# Record the execution distinction in the focused PRO-6 review.
p = Path("docs/knowledge/reviews/professional-animation-expression-keyframes-2026-08-13.md")
text = p.read_text()
needle = "String values are passed to native keyframe state unchanged. BlockIT does not parse or evaluate them. Whitespace-only strings are rejected.\n"
if needle not in text:
    raise SystemExit("PRO-6 review contract marker missing")
p.write_text(text.replace(
    needle,
    needle + "Scalar number/string values use the existing uniform-keyframe path; three-component arrays remain per-axis values.\n",
    1,
))
