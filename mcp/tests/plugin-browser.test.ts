import { expect, test } from "bun:test";
import { pluginBrowserSetup, pluginBrowserTeardown } from "@/ui/pluginBrowser";

test("plugin tabs are scoped to BlockIT and native hooks are restored on teardown", () => {
  const oldPlugins = Object.getOwnPropertyDescriptor(globalThis, "Plugins");
  const oldDocument = Object.getOwnPropertyDescriptor(globalThis, "document");
  const classes = new Set<string>();
  let refresh = () => {};
  let stops = 0;
  let opens = 0;
  const browser = {
    selected_plugin: { id: "blockit_mcp", installed: true },
    page_tab: "features",
    $watch(_getter: () => string, callback: () => void, options: { immediate: boolean }) {
      refresh = callback;
      if (options.immediate) callback();
      return () => { stops++; };
    },
  };
  const originalOpen = () => { opens++; };
  const dialog = { onOpen: originalOpen, content_vue: null as typeof browser | null };
  Object.defineProperty(globalThis, "Plugins", { configurable: true, value: { dialog } });
  Object.defineProperty(globalThis, "document", { configurable: true, value: { body: { classList: {
    toggle(name: string, enabled: boolean) { if (enabled) classes.add(name); else classes.delete(name); },
    remove(name: string) { classes.delete(name); },
  } } } });
  try {
    pluginBrowserSetup();
    dialog.content_vue = browser;
    dialog.onOpen();
    expect(opens).toBe(1);
    expect(classes.has("blockit-plugin-page")).toBe(true);
    expect(browser.page_tab).toBe("about");
    browser.selected_plugin.id = "another_plugin";
    browser.page_tab = "settings";
    refresh();
    expect(classes.size).toBe(0);
    expect(browser.page_tab).toBe("settings");
    browser.selected_plugin.id = "blockit_mcp";
    refresh();
    expect(browser.page_tab).toBe("about");
    pluginBrowserTeardown();
    expect(stops).toBe(1);
    expect(classes.size).toBe(0);
    expect(dialog.onOpen).toBe(originalOpen);
  } finally {
    pluginBrowserTeardown();
    if (oldPlugins) Object.defineProperty(globalThis, "Plugins", oldPlugins);
    else Reflect.deleteProperty(globalThis, "Plugins");
    if (oldDocument) Object.defineProperty(globalThis, "document", oldDocument);
    else Reflect.deleteProperty(globalThis, "document");
  }
});
