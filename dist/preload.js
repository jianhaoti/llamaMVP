"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld("electron", {
    invoke: (channel, data) => electron_1.ipcRenderer.invoke(channel, data),
});
