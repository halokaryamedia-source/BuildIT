// blockbench-types 5.1.0 omits a few desktop-runtime APIs that BlockIT uses.
// Keep these type-only augmentations aligned with native Blockbench behavior
// instead of adding runtime fallbacks or compiler suppressions.
interface _Animation {
  getShortName(): string;
}

interface BlockbenchNativeModulePermissionOptions {
  message?: string;
  detail?: string;
  optional?: boolean;
}

declare function requireNativeModule(
  moduleName: "net",
  options?: BlockbenchNativeModulePermissionOptions
): typeof import("node:net") | undefined;
