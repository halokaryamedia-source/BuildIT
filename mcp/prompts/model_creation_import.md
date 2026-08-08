# Explicit geometry import fallback only

Use `from_geo_json` only when the caller already has authoritative `.geo.json` content or explicitly requests an import workflow.

Do not generate `.geo.json` first as the normal way to create a Bedrock model. Import is a transport path, not visual modelling judgement. After import, return to the normal project inspection, visual review, targeted correction, texture/animation-if-required, and final proof workflow.