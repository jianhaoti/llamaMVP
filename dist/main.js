"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const axios_1 = __importDefault(require("axios"));
const path_1 = __importDefault(require("path"));
let mainWindow;
electron_1.app.whenReady().then(() => {
    mainWindow = new electron_1.BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path_1.default.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });
    mainWindow.loadFile("index.html");
});
// ✅ Fix `ask-llama` to Send Responses Correctly
electron_1.ipcMain.handle("ask-llama", async (_event, prompt) => {
    try {
        console.log("🟢 Sending request to LLaMA:", prompt);
        const response = await axios_1.default.post("http://127.0.0.1:11434/api/generate", {
            model: "tinyllama",
            prompt: prompt,
            stream: false,
        });
        console.log("🟢 AI Response:", response.data.response);
        return response.data.response; // ✅ Send the full response to the frontend
    }
    catch (err) {
        console.error("❌ Error:", err.message);
        return `Error: ${err.message}`;
    }
});
