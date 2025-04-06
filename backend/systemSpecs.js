const express = require("express");
const { exec } = require("child_process");
const path = require("path");
const router = express.Router();

// Helper to run PowerShell scripts
function runScript(scriptPath) {
  return new Promise((resolve, reject) => {
    exec(`powershell -ExecutionPolicy Bypass -File "${scriptPath}"`, (error, stdout, stderr) => {
      if (error) return reject(stderr);
      resolve(stdout.trim());
    });
  });
}

// GET /api/system-specs
router.get("/", async (req, res) => {
  try {
    const basePath = path.join(__dirname, "scripts"); // ✅ Points to backend/scripts/

    const cpu = await runScript(`${basePath}/cpu_usage.ps1`);
    const ram = await runScript(`${basePath}/ram_usage.ps1`);
    const gpu = await runScript(`${basePath}/gpu_usage.ps1`);
    const disk = await runScript(`${basePath}/disk_usage.ps1`);

    res.json({ cpu, ram, gpu, disk });
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({ error: "Failed to read system specs" });
  }
});

module.exports = router;
