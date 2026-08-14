// blockbench-types 5.1.0 omits AnimationItem.getShortName(), while current
// native Blockbench defines it on AnimationItem. Keep this type-only augmentation
// aligned with the native runtime instead of adding a runtime fallback.
interface _Animation {
  getShortName(): string;
}
