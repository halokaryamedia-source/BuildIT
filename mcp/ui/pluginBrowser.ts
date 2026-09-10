// Blockbench shows Settings and Features for every installed plugin, even
// when empty. Scope the presentation change to BlockIT's selected page only.
type PluginBrowser = {
  selected_plugin: { id: string; installed: boolean } | null;
  page_tab: string;
  $watch(getter: () => string, callback: () => void, options: { immediate: boolean }): () => void;
};

let cleanup: (() => void) | undefined;

export function pluginBrowserSetup(): void {
  pluginBrowserTeardown();
  const dialog = Plugins.dialog;
  if (!dialog) return;
  const originalOpen = dialog.onOpen;
  let stopWatching: (() => void) | undefined;
  const attach = () => {
    const browser = dialog.content_vue as unknown as PluginBrowser | null;
    if (!browser || stopWatching) return;
    stopWatching = browser.$watch(
      () => `${browser.selected_plugin?.id}:${browser.selected_plugin?.installed}:${browser.page_tab}`,
      () => {
        const selected = browser.selected_plugin?.id === "blockit_mcp" && browser.selected_plugin.installed;
        document.body.classList.toggle("blockit-plugin-page", Boolean(selected));
        if (selected && ["settings", "features"].includes(browser.page_tab)) {
          browser.page_tab = "about";
        }
      },
      { immediate: true }
    );
  };
  const onOpen = () => {
    originalOpen?.call(dialog);
    attach();
  };
  dialog.onOpen = onOpen;
  attach();
  cleanup = () => {
    stopWatching?.();
    if (dialog.onOpen === onOpen) dialog.onOpen = originalOpen;
    document.body.classList.remove("blockit-plugin-page");
  };
}

export function pluginBrowserTeardown(): void {
  cleanup?.();
  cleanup = undefined;
}
