export type TexturePixelMetrics = {
  width: number;
  displayHeight: number;
  uvWidth: number;
  uvHeight: number;
};

export function requireFiniteFaceUv(
  values: readonly number[],
  context: string
): [number, number, number, number] {
  if (values.length !== 4 || values.some((value) => !Number.isFinite(value))) {
    throw new Error(
      `${context} contains a non-finite authored face UV rectangle and cannot be mapped safely.`
    );
  }
  return [values[0], values[1], values[2], values[3]];
}

export function requirePositiveTextureMetric(
  value: number,
  context: string
): number {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(
      `${context} must be a finite positive texture dimension for UV-to-pixel mapping.`
    );
  }
  return value;
}

function roundNativePainterCoordinate(value: number): number {
  return Math.round(value * 100) / 100;
}

export function mapFaceUvToTexturePixels(
  values: readonly number[],
  metrics: TexturePixelMetrics,
  context: string
) {
  const uv = requireFiniteFaceUv(values, context);
  const width = requirePositiveTextureMetric(metrics.width, `${context} texture width`);
  const displayHeight = requirePositiveTextureMetric(
    metrics.displayHeight,
    `${context} texture display height`
  );
  const uvWidth = requirePositiveTextureMetric(metrics.uvWidth, `${context} UV width`);
  const uvHeight = requirePositiveTextureMetric(metrics.uvHeight, `${context} UV height`);

  const factorX = width / uvWidth;
  const factorY = displayHeight / uvHeight;
  const corners = [
    uv[0] * factorX,
    uv[1] * factorY,
    uv[2] * factorX,
    uv[3] * factorY,
  ] as [number, number, number, number];

  if (corners.some((value) => !Number.isFinite(value))) {
    throw new Error(
      `${context} produced a non-finite texture-space coordinate and cannot be mapped safely.`
    );
  }

  const left = Math.floor(
    roundNativePainterCoordinate(Math.min(corners[0], corners[2]))
  );
  const top = Math.floor(
    roundNativePainterCoordinate(Math.min(corners[1], corners[3]))
  );
  const right = Math.ceil(
    roundNativePainterCoordinate(Math.max(corners[0], corners[2]))
  );
  const bottom = Math.ceil(
    roundNativePainterCoordinate(Math.max(corners[1], corners[3]))
  );

  return {
    corners,
    rect: [left, top, right, bottom] as [number, number, number, number],
    size: [right - left, bottom - top] as [number, number],
    flip_u: corners[2] < corners[0],
    flip_v: corners[3] < corners[1],
  };
}
