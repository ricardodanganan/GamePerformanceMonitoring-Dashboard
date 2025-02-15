const express = require("express");
const { exec } = require("child_process");
const cors = require("cors");

const app = express();
const PORT = 3001;

app.use(cors()); // Allow frontend to access backend

// Function to execute PowerShell scripts and return the output
const runPowerShell = (scriptPath, res) => {
  exec(
    `powershell -ExecutionPolicy Bypass -File ${scriptPath}`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${stderr}`);
        res.status(500).json({ error: stderr });
        return;
      }
      res.json({ value: stdout.trim() });
    }
  );
};

// CPU, RAM, Disk Usage Endpoints (Using PowerShell) - Windows Only
// These endpoints execute PowerShell scripts to fetch CPU, RAM, and Disk usage data
app.get("/cpu", (req, res) => {
  exec("powershell -ExecutionPolicy Bypass -File ./scripts/cpu_usage.ps1", (error, stdout, stderr) => {
    if (error) {
      console.error("❌ Error fetching CPU data:", stderr);
      return res.status(500).json({ error: "Failed to retrieve CPU data" });
    }

    try {
      const cpuData = JSON.parse(stdout.replace(/'/g, '"')); // Convert PowerShell JSON output
      res.json({
        cpuUsage: cpuData.cpuUsage,
        cpuName: cpuData.cpuName,
        cpuCores: cpuData.cpuCores,
        cpuSpeed: cpuData.cpuSpeed
      });
    } catch (parseError) {
      console.error("⚠️ Parsing error:", parseError);
      res.status(500).json({ error: "Failed to parse CPU data" });
    }
  });
});

app.get("/ram", (req, res) => {
  exec("powershell -ExecutionPolicy Bypass -File ./scripts/ram_usage.ps1", (error, stdout, stderr) => {
    if (error) {
      console.error("❌ Error fetching RAM data:", stderr);
      return res.status(500).json({ error: "Failed to retrieve RAM data" });
    }

    try {
      const ramData = JSON.parse(stdout.replace(/'/g, '"'));
      res.json({
        totalRAM: ramData.totalRAM,
        usedRAM: ramData.usedRAM,
        ramUsage: ramData.ramUsage
      });
    } catch (parseError) {
      console.error("⚠️ Parsing error:", parseError);
      res.status(500).json({ error: "Failed to parse RAM data" });
    }
  });
});

app.get("/disk", (req, res) => {
  exec("powershell -ExecutionPolicy Bypass -File ./scripts/disk_usage.ps1", (error, stdout, stderr) => {
    if (error) {
      console.error("❌ Error fetching Disk data:", stderr);
      return res.status(500).json({ error: "Failed to retrieve Disk data" });
    }

    try {
      const diskData = JSON.parse(stdout.replace(/'/g, '"'));
      res.json({
        totalDisk: diskData.totalDisk,
        usedDisk: diskData.usedDisk,
        diskUsage: diskData.diskUsage
      });
    } catch (parseError) {
      console.error("⚠️ Parsing error:", parseError);
      res.status(500).json({ error: "Failed to parse Disk data" });
    }
  });
});

// GPU Utilization Endpoint (Using nvidia-smi) - Windows Only
app.get("/gpu", (req, res) => {
  exec("powershell -ExecutionPolicy Bypass -File ./scripts/gpu_usage.ps1", (error, stdout, stderr) => {
    if (error) {
      console.error("❌ Error fetching GPU data:", stderr);
      return res.status(500).json({ error: "Failed to retrieve GPU data" });
    }

    try {
      const gpuData = JSON.parse(stdout.replace(/'/g, '"'));
      res.json({
        gpuName: gpuData.gpuName,
        gpuUsage: gpuData.gpuUsage,
        gpuClockSpeed: gpuData.gpuClockSpeed,
        gpuPower: gpuData.gpuPower
      });
    } catch (parseError) {
      console.error("⚠️ Parsing error:", parseError);
      res.status(500).json({ error: "Failed to parse GPU data" });
    }
  });
});

// GPU Temperature Endpoint (Using PowerShell) - Windows Only
// This endpoint executes a PowerShell script to fetch the GPU temperature
app.get("/gpu-temp", (req, res) => {
    exec("powershell ./scripts/gpu_temp.ps1", (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return res.status(500).send("Error retrieving GPU temperature");
        }
        if (stderr) {
            console.error(`Stderr: ${stderr}`);
            return res.status(500).send("Error retrieving GPU temperature");
        }
        res.json({ gpuTemp: stdout.trim() });
    });
});

// CPU Temperature Endpoint (Using PowerShell) - Windows Only
// This endpoint executes a PowerShell script to fetch the CPU temperature (simulated)
app.get("/cpu-temp", (req, res) => {
    exec("powershell.exe -File ./scripts/cpu_temp.ps1", (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return res.status(500).send("Error fetching simulated CPU temperature");
        }
        if (stderr) {
            console.error(`Stderr: ${stderr}`);
            return res.status(500).send("Error fetching simulated CPU temperature");
        }
        const cpuTemp = stdout.trim(); // Simulated temperature value
        res.json({ cpuTemp });
    });
});

// API Endpoint for Latency Monitoring
app.get("/ping-latency", async (req, res) => {
  const scriptPath = "./scripts/latency_monitor.ps1";

  exec(`powershell -ExecutionPolicy Bypass -File ${scriptPath}`, (error, stdout, stderr) => {
      if (error) {
          console.error(`❌ Error fetching Latency data:`, stderr);
          return res.status(500).json({ error: "Failed to retrieve latency data" });
      }

      try {
          const latencyData = JSON.parse(stdout.replace(/'/g, '"'));
          res.json({
              latency: latencyData.latency,
              packetLoss: latencyData.packetLoss,
              connectionType: latencyData.connectionType
          });
      } catch (parseError) {
          console.error("⚠️ Parsing error:", parseError);
          res.status(500).json({ error: "Failed to parse latency data" });
      }
  });
});

// VRAM Usage Endpoint (Using NVIDIA-SMI via PowerShell)
app.get("/vram", (req, res) => {
  exec("powershell -ExecutionPolicy Bypass -File ./scripts/vram_monitor.ps1", (error, stdout, stderr) => {
      if (error) {
          console.error("❌ Error fetching VRAM data:", stderr);
          return res.status(500).json({ error: "Failed to retrieve VRAM usage" });
      }

      // Log the raw PowerShell output before parsing
      console.log("🖥️ Raw VRAM Output:", stdout.trim());

      try {
          // Convert PowerShell output to JSON format
          const vramData = JSON.parse(stdout.replace(/'/g, '"'));

          // Log parsed VRAM data to check values
          console.log("📊 Parsed VRAM Data:", vramData);

          res.json({
              vramUsed: vramData.vramUsed,
              vramTotal: vramData.vramTotal,
              vramUsage: vramData.vramUsage
          });
      } catch (parseError) {
          console.error("⚠️ Parsing error:", parseError);
          res.status(500).json({ error: "Failed to parse VRAM data" });
      }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
