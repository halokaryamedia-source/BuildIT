export {};

declare global {
  interface Window {
    builditDesktop?: {
      openBlockbench: () => Promise<unknown>;
      startOllama: () => Promise<unknown>;
      checkRuntime: () => Promise<unknown>;
    };
  }
}
