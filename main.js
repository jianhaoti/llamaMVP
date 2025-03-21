const { app, BrowserWindow, ipcMain } = require("electron");
const axios = require("axios");
const path = require("path");

let mainWindow;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"), // ✅ Add the Preload Script
      contextIsolation: true,
      nodeIntegration: false, // ❌ Keep this disabled for security
    },
  });

  mainWindow.loadFile("index.html");
});

// ✅ Fix `ask-llama` to Send Responses Correctly
ipcMain.handle("ask-llama", async (_, prompt) => {
  try {
    console.log("🟢 Sending request to LLaMA:", prompt);
    const response = await axios.post("http://127.0.0.1:11434/api/generate", {
      model: "tinyllama",
      prompt: prompt,
      stream: false,
    });

    console.log("🟢 AI Response:", response.data.response);
    return response.data.response; // ✅ Send the full response to the frontend
  } catch (err) {
    console.error("❌ Error:", err.message);
    return `Error: ${err.message}`;
  }
});
