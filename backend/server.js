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
app.get("/cpu", (req, res) =>
  runPowerShell("../backend/scripts/cpu_usage.ps1", res)
);
app.get("/ram", (req, res) =>
  runPowerShell("../backend/scripts/ram_usage.ps1", res)
);
app.get("/disk", (req, res) =>
  runPowerShell("../backend/scripts/disk_usage.ps1", res)
);

// GPU Utilization Endpoint (Using nvidia-smi) - Windows Only
app.get("/gpu", (req, res) => {
  exec(
    "nvidia-smi --query-gpu=utilization.gpu --format=csv,noheader,nounits",
    (error, stdout, stderr) => {
      if (error) {
        console.error(`Error fetching GPU data: ${stderr}`);
        res.status(500).json({ error: "Failed to fetch GPU data" });
        return;
      }

      // GPU utilization data parsed
      const gpuUtil = stdout.trim(); // Direct GPU utilization percentage
      res.json({
        gpuUtil: `${gpuUtil}%`,
      });
    }
  );
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
app.get("/ping-latency", (req, res) => {
  const scriptPath = "./scripts/latency_monitor.ps1"; // Adjust path if needed

  exec(`powershell -ExecutionPolicy Bypass -File ${scriptPath}`, (error, stdout, stderr) => {
      if (error) {
          console.error(`Error: ${stderr}`);
          res.status(500).json({ error: "Failed to retrieve latency data" });
          return;
      }

      const latency = stdout.trim();
      if (latency === "PingFailed") {
          res.status(500).json({ error: "Ping failed" });
      } else {
          res.json({ latency: `${latency} ms` });
      }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
