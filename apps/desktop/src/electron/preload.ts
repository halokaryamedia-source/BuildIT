import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("builditDesktop", {
  openBlockbench: () => ipcRenderer.invoke("runtime:open-blockbench"),
  startOllama: () => ipcRenderer.invoke("runtime:start-ollama"),
  checkRuntime: () => ipcRenderer.invoke("runtime:check")
});
