from pathlib import Path
import json
import re


log = Path("/tmp/professional-surface.log").read_text()
start = log.find('{\n  "protocol_version"')
if start < 0:
    raise SystemExit("Could not find surface JSON in measurement log")
metrics = json.loads(log[start:])

init_chars = metrics["initialize_instructions_chars"]
tool_count = metrics["tool_count"]
tools_list = metrics["tools_list_response_chars"]
tools_array = metrics["tools_array_chars"]
input_schema = metrics["input_schema_chars"]
description = metrics["description_chars"]
payload = metrics["per_tool_payload_chars"]

formatted = f'''initialize instructions:       {init_chars:,} characters
tool count:                     {tool_count}
tools/list response:            {tools_list:,} characters
tools array:                    {tools_array:,} characters
input schemas:                  {input_schema:,} characters
descriptions:                   {description:,} characters
per-tool payload:               p50 {payload["p50"]:,} / p90 {payload["p90"]:,} / p95 {payload["p95"]:,} / max {payload["max"]:,}'''

# Active continuation placeholder.
next_path = Path("docs/knowledge/next-action.md")
next_text = next_path.read_text()
marker = "__SURFACE_METRICS_PENDING__"
if marker not in next_text:
    raise SystemExit("next-action surface placeholder missing")
next_path.write_text(next_text.replace(marker, formatted, 1))

# Validation report current surface block.
validation_path = Path("docs/foundation/validation-report.md")
validation = validation_path.read_text()
validation_pattern = re.compile(
    r'(## Fresh GitHub-Only Serialized Surface Proof\n\nCurrent verification pins Bun \*\*1\.3\.14\*\* and measures the isolated `initialize → tools/list` surface through the real stateless HTTP owner\.\n\n```text\n)(.*?)(\n```)',
    re.S,
)
validation, count = validation_pattern.subn(r'\1' + formatted + r'\3', validation, count=1)
if count != 1:
    raise SystemExit("validation surface block not found")
validation_path.write_text(validation)

# Implementation map current measurement.
implementation_path = Path("docs/knowledge/implementation-map.md")
implementation = implementation_path.read_text()
implementation_pattern = re.compile(
    r'(Fresh GitHub/CI serialized measurement:\n\n```text\n)(.*?)(\n```)',
    re.S,
)
implementation, count = implementation_pattern.subn(r'\1' + formatted + r'\3', implementation, count=1)
if count != 1:
    raise SystemExit("implementation-map surface block not found")
implementation_path.write_text(implementation)

# Root README compact metrics.
readme_path = Path("README.md")
readme = readme_path.read_text()
readme_pattern = re.compile(
    r'(Current fresh GitHub/CI serialized surface:\n\n```text\n)(.*?)(\n```)',
    re.S,
)
readme_metrics = f'''{tool_count} tools
{tools_list:,} tools/list response characters
{input_schema:,} input-schema characters
{description:,} description characters
initialize instructions: {init_chars:,} characters'''
readme, count = readme_pattern.subn(r'\1' + readme_metrics + r'\3', readme, count=1)
if count != 1:
    raise SystemExit("README surface block not found")
readme_path.write_text(readme)
