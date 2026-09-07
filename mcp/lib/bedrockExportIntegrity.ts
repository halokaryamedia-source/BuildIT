export type BedrockGeometryOverwriteAnalysis = {
  identifiers: string[];
  target_occurrences: number;
  has_unknown_identifier: boolean;
  safe_single_model_replace: boolean;
  requires_native_merge: boolean;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

export function bedrockGeometryIdentifiers(document: unknown): string[] {
  const root = asRecord(document);
  const geometries = root?.["minecraft:geometry"];
  if (!Array.isArray(geometries)) return [];

  const identifiers: string[] = [];
  for (const geometry of geometries) {
    const description = asRecord(asRecord(geometry)?.description);
    const identifier = description?.identifier;
    if (typeof identifier === "string" && identifier.length > 0) {
      identifiers.push(identifier);
    }
  }
  return identifiers;
}

export function bedrockAnimationIdentifiers(document: unknown): string[] {
  const root = asRecord(document);
  const animations = asRecord(root?.animations);
  return animations ? Object.keys(animations) : [];
}

export function analyzeBedrockGeometryOverwrite(
  document: unknown,
  expectedIdentifier: string
): BedrockGeometryOverwriteAnalysis {
  if (!expectedIdentifier.trim()) {
    throw new Error("Bedrock geometry overwrite analysis requires an expected identifier.");
  }

  const identifiers = bedrockGeometryIdentifiers(document);
  const targetOccurrences = identifiers.filter(
    (identifier) => identifier === expectedIdentifier
  ).length;
  const hasUnknownIdentifier = identifiers.some(
    (identifier) => identifier === "geometry.unknown" || identifier.endsWith(".unknown")
  );

  return {
    identifiers,
    target_occurrences: targetOccurrences,
    has_unknown_identifier: hasUnknownIdentifier,
    safe_single_model_replace:
      identifiers.length === 1 &&
      targetOccurrences === 1 &&
      !hasUnknownIdentifier,
    requires_native_merge: identifiers.length > 1,
  };
}

export function requireExpectedGeometryIdentifier(
  document: unknown,
  expectedIdentifier: string
): void {
  const analysis = analyzeBedrockGeometryOverwrite(document, expectedIdentifier);
  if (analysis.target_occurrences !== 1) {
    throw new Error(
      `Expected exactly one Bedrock geometry identifier "${expectedIdentifier}", found ${analysis.target_occurrences}. Available identifiers: ${analysis.identifiers.join(", ") || "none"}.`
    );
  }
  if (analysis.has_unknown_identifier) {
    throw new Error(
      "Bedrock geometry output still contains an unknown identifier; repair native project metadata before claiming finalization integrity."
    );
  }
}

export function missingRequestedDeliverables(
  requested: readonly string[],
  actual: readonly string[]
): string[] {
  const actualSet = new Set(actual);
  return [...new Set(requested)].filter((name) => !actualSet.has(name));
}
