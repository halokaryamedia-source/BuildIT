import { wireAuthoringQualityIntelligence } from "../tools/quality-intelligence";
import { wireTextureQualityRuntime } from "../tools/texture-quality-runtime";
import { wireTextureAuthoringRuntime } from "../tools/texture-authoring-runtime";
import { wireTextureAlphaRuntime } from "../tools/texture-alpha-runtime";
import { wireAnimationNativeIntelligence } from "../tools/animation-native-intelligence";
import { wireAnimationControllerNativeIntelligence } from "../tools/animation-controller-native-intelligence";
import { wireAnimationRuntimeResourceIntelligence } from "../tools/animation-runtime-resource-intelligence";

let initialized = false;

/**
 * Wire generation-stable intelligence into existing canonical tool definitions.
 * This does not create a second catalog and is idempotent within one module load.
 */
export function initializeRuntimeCapabilityWiring(): void {
  if (initialized) return;
  initialized = true;

  wireAuthoringQualityIntelligence();
  wireTextureQualityRuntime();
  wireTextureAuthoringRuntime();
  wireTextureAlphaRuntime();
  wireAnimationNativeIntelligence();
  wireAnimationControllerNativeIntelligence();
  wireAnimationRuntimeResourceIntelligence();
}
