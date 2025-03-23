import { app, BrowserWindow, ipcMain } from "electron";
import axios from "axios";
import path from "path";

let mainWindow: BrowserWindow | null;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile("index.html");
});

// ✅ Fix `ask-llama` to Send Responses Correctly
ipcMain.handle("ask-llama", async (_event, prompt: string) => {
  try {
    console.log("🟢 Sending request to LLaMA:", prompt);
    const response = await axios.post("http://127.0.0.1:11434/api/generate", {
      model: "tinyllama",
      prompt: prompt,
      stream: false,
    });

    console.log("🟢 AI Response:", response.data.response);
    return response.data.response; // ✅ Send the full response to the frontend
  } catch (err: any) {
    console.error("❌ Error:", err.message);
    return `Error: ${err.message}`;
  }
});
