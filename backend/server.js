const express = require("express");
const { exec } = require("child_process");
const cors = require("cors");
const db = require('./database'); // Import SQLite database
const fs = require("fs");
const { parse } = require("json2csv");

const app = express();
const PORT = 3001;

app.use(cors()); // Allow frontend to access backend

// Function to execute PowerShell scripts and return the output
// const runPowerShell = (scriptPath, res) => {
// exec(
//    `powershell -ExecutionPolicy Bypass -File ${scriptPath}`,
//    (error, stdout, stderr) => {
//      if (error) {
//        console.error(`Error: ${stderr}`);
//        res.status(500).json({ error: stderr });
//        return;
//      }
//      res.json({ value: stdout.trim() });
//    }
//  );
//};

// Function to fetch and insert system metrics every 10 seconds
function logSystemMetrics() {
  console.log("Logging system metrics...");

  // Run PowerShell scripts to get system data
  exec("powershell.exe -ExecutionPolicy Bypass -File ./scripts/cpu_usage.ps1", (error, cpuOutput) => {
      exec("powershell.exe -ExecutionPolicy Bypass -File ./scripts/cpu_temp.ps1", (error, cpuTempOutput) => {
          exec("powershell.exe -ExecutionPolicy Bypass -File ./scripts/ram_usage.ps1", (error, ramOutput) => {
              exec("powershell.exe -ExecutionPolicy Bypass -File ./scripts/disk_usage.ps1", (error, diskOutput) => {
                  exec("powershell.exe -ExecutionPolicy Bypass -File ./scripts/gpu_usage.ps1", (error, gpuOutput) => {
                      exec("powershell.exe -ExecutionPolicy Bypass -File ./scripts/gpu_temp.ps1", (error, gpuTempOutput) => {
                          exec("powershell.exe -ExecutionPolicy Bypass -File ./scripts/vram_monitor.ps1", (error, vramOutput) => {
                              exec("powershell.exe -ExecutionPolicy Bypass -File ./scripts/latency_monitor.ps1", (error, latencyOutput) => {

                                  try {
                                      // ✅ Parse PowerShell output and extract only the required values
                                      const cpuData = JSON.parse(cpuOutput.replace(/'/g, '"'));
                                      const cpuTemp = parseFloat(cpuTempOutput.trim());
                                      const ramData = JSON.parse(ramOutput.replace(/'/g, '"'));
                                      const diskData = JSON.parse(diskOutput.replace(/'/g, '"'));
                                      const gpuData = JSON.parse(gpuOutput.replace(/'/g, '"'));
                                      const gpuTemp = parseFloat(gpuTempOutput.trim());
                                      const vramData = JSON.parse(vramOutput.replace(/'/g, '"'));
                                      const latencyData = JSON.parse(latencyOutput.replace(/'/g, '"'));

                                      // ✅ Insert only required values into SQLite
                                      db.run(`
                                          INSERT INTO performance_metrics 
                                          (cpu_usage, cpu_temp, ram_usage, disk_usage, gpu_usage, gpu_temp, vram_usage, network_latency)
                                          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                                          [
                                              parseFloat(cpuData.cpuUsage),
                                              cpuTemp,
                                              parseFloat(ramData.ramUsage),
                                              parseFloat(diskData.diskUsage),
                                              parseFloat(gpuData.gpuUsage),
                                              gpuTemp,
                                              parseFloat(vramData.vramUsage),
                                              parseFloat(latencyData.latency)
                                          ],
                                          (err) => {
                                              if (err) {
                                                  console.error("❌ Error inserting data:", err.message);
                                              } else {
                                                  console.log("✅ System metrics logged successfully.");
                                              }
                                          }
                                      );

                                  } catch (parseError) {
                                      console.error("⚠️ Parsing error:", parseError);
                                  }
                              });
                          });
                      });
                  });
              });
          });
      });
  });
}

// ✅ Run the function every 10 seconds
setInterval(logSystemMetrics, 10000);

// API route to fetch historical system performance data
// Last 1 Hour: http://localhost:3001/history/1hour
// Last 24 Hours: http://localhost:3001/history/24hours
// Last 7 Days: http://localhost:3001/history/7days
app.get("/history/:timeRange", (req, res) => {
  const { timeRange } = req.params;
  let timeCondition = "";

  if (timeRange === "1hour") {
      timeCondition = "timestamp >= datetime('now', '-1 hour')";
  } else if (timeRange === "12hours") {
      timeCondition = "timestamp >= datetime('now', '-12 hours')";
  } else if (timeRange === "24hours") {
      timeCondition = "timestamp >= datetime('now', '-24 hours')";
  } else {
      return res.status(400).json({ error: "Invalid time range selected" });
  }

  const query = `SELECT * FROM performance_metrics WHERE ${timeCondition} ORDER BY timestamp DESC`;

  db.all(query, [], (err, rows) => {
      if (err) {
          console.error("❌ Error fetching historical data:", err.message);
          return res.status(500).json({ error: "Failed to retrieve historical data" });
      }
      res.json(rows);
  });
});

// function to check the data in the database (for testing purposes)
// http://localhost:3001/check-data
app.get("/check-data", (req, res) => {
  const query = "SELECT * FROM performance_metrics ORDER BY timestamp DESC LIMIT 10";

  db.all(query, [], (err, rows) => {
      if (err) {
          console.error("Error fetching data:", err.message);
          return res.status(500).json({ error: "Failed to retrieve data" });
      }
      res.json(rows);
  });
});
 
// Export historical data for a specific metric in JSON or CSV format (e.g., cpu_usage, ram_usage)
// Add a header with metadata information (export date, system info) before the actual data
// Export historical data for a specific metric in JSON or CSV format with time filtering
app.get("/export/:metric/:format/:timeRange", async (req, res) => {
  const { metric, format, timeRange } = req.params;
  const validMetrics = ["cpu_usage", "cpu_temp", "ram_usage", "disk_usage", "gpu_usage", "gpu_temp", "vram_usage", "network_latency"];

  if (!validMetrics.includes(metric)) {
      return res.status(400).json({ error: "Invalid metric" });
  }

  let timeCondition = "";
  if (timeRange === "1hour") {
      timeCondition = "timestamp >= datetime('now', '-1 hour')";
  } else if (timeRange === "12hours") {
      timeCondition = "timestamp >= datetime('now', '-12 hours')";
  } else if (timeRange === "24hours") {
      timeCondition = "timestamp >= datetime('now', '-24 hours')";
  } else {
      return res.status(400).json({ error: "Invalid time range selected" });
  }

  const query = `SELECT timestamp, ${metric} FROM performance_metrics WHERE ${timeCondition} ORDER BY timestamp ASC`;

  db.all(query, [], async (err, rows) => {
      if (err) {
          console.error("❌ Error exporting data:", err.message);
          return res.status(500).json({ error: "Failed to retrieve export data" });
      }

      try {
          // 🔹 Fetch system info using PowerShell
          const systemInfo = await getSystemInfo();

          // 🔹 Prepare metadata header
          const metadata = [
              "Game Performance Monitoring Dashboard - Historical Data Export",
              `Exported On: ${new Date().toLocaleString()}`,
              `System Info: ${systemInfo}`,
              `Time Range: ${timeRange}`, // Include time range in metadata
              "", // Empty line before actual data
          ].join("\n");

          if (format === "json") {
              res.setHeader("Content-Type", "application/json");
              res.setHeader("Content-Disposition", `attachment; filename=${metric}_${timeRange}.json`);
              res.json(rows);
          } else if (format === "csv") {
              const csvData = parse(rows.reverse()); // Reverse order so latest logs appear first
              const finalCsv = `${metadata}\n${csvData}`;

              res.setHeader("Content-Type", "text/csv");
              res.setHeader("Content-Disposition", `attachment; filename=${metric}_${timeRange}.csv`);
              res.send(finalCsv);
          } else {
              res.status(400).json({ error: "Invalid format. Use json or csv" });
          }
      } catch (error) {
          res.status(500).json({ error: "Error generating CSV" });
      }
  });
});

// Function to get system info using PowerShell (Windows Only)
// This function fetches the computer name, OS name, Windows version, CPU name, GPU name, and total RAM
// Returns a formatted string with the system information in the download file header
const getSystemInfo = () => {
  return new Promise((resolve, reject) => {
      exec(`powershell -Command "Get-ComputerInfo | Select-Object CsName, OsName, WindowsVersion, CsTotalPhysicalMemory | ConvertTo-Json"`,
          (error, stdout, stderr) => {
              if (error || stderr) {
                  console.error("❌ Error fetching system info:", error || stderr);
                  resolve("Unknown System Information");
                  return;
              }

              try {
                  const systemData = JSON.parse(stdout);

                  // Get GPU Information and Remove Integrated GPUs
                  exec(`powershell -Command "Get-CimInstance Win32_VideoController | Select-Object -ExpandProperty Name | ConvertTo-Json"`, 
                      (gpuError, gpuStdout, gpuStderr) => {
                          let gpuName = "Unknown GPU";
                          if (!gpuError && !gpuStderr && gpuStdout.trim()) {
                              let gpus = JSON.parse(gpuStdout);

                              // If multiple GPUs exist, remove Intel ones and keep only dedicated GPU
                              if (Array.isArray(gpus)) {
                                  gpus = gpus.filter(gpu => !gpu.includes("Intel"));
                                  gpuName = gpus.length > 0 ? gpus[0] : "Unknown GPU";
                              } else {
                                  // If only one GPU exists, assign it directly
                                  gpuName = gpus.includes("Intel") ? "Unknown GPU" : gpus;
                              }
                          }

                          // Get CPU Name Separately
                          exec(`powershell -Command "Get-CimInstance Win32_Processor | Select-Object -ExpandProperty Name | ConvertTo-Json"`, 
                              (cpuError, cpuStdout, cpuStderr) => {
                                  let cpuName = "Unknown CPU";
                                  if (!cpuError && !cpuStderr && cpuStdout.trim()) {
                                      cpuName = JSON.parse(cpuStdout);
                                  }

                                  // Final system info
                                  const formattedInfo = `Computer: ${systemData.CsName}, OS: ${systemData.OsName}, Windows Version: ${systemData.WindowsVersion}, CPU: ${cpuName}, GPU: ${gpuName}, Total RAM: ${(systemData.CsTotalPhysicalMemory / (1024 * 1024 * 1024)).toFixed(2)} GB`;
                                  resolve(formattedInfo);
                              });
                      });
              } catch (parseError) {
                  console.error("⚠️ Parsing error:", parseError);
                  resolve("Unknown System Information");
              }
          }
      );
  });
};


// API Endpoint for System Information (Using PowerShell) - Windows Only
// This endpoint executes a PowerShell script to fetch the cpu usage, name, cores, and speed
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

// RAM Usage Endpoint (Using PowerShell) - Windows Only
// This endpoint executes a PowerShell script to fetch the RAM usage, total RAM, and available RAM
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

// Disk Usage Endpoint (Using PowerShell) - Windows Only
// This endpoint executes a PowerShell script to fetch the Disk usage, total disk space, and used disk space
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
// This endpoint executes a PowerShell script to fetch the GPU usage, clock speed, and power consumption
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

// Network Latency Endpoint (Using PowerShell) - Windows Only
// This endpoint executes a PowerShell script to fetch the network latency and packet loss
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
// This endpoint executes a PowerShell script to fetch the VRAM usage, total VRAM, and VRAM usage percentage
app.get("/vram", (req, res) => {
  exec("powershell -ExecutionPolicy Bypass -File ./scripts/vram_monitor.ps1", (error, stdout, stderr) => {
      if (error) {
          console.error("❌ Error fetching VRAM data:", stderr);
          return res.status(500).json({ error: "Failed to retrieve VRAM usage" });
      }

      // Log the raw PowerShell output before parsing
      // console.log("🖥️ Raw VRAM Output:", stdout.trim());

      try {
          // Convert PowerShell output to JSON format
          const vramData = JSON.parse(stdout.replace(/'/g, '"'));

          // Log parsed VRAM data to check values
          // console.log("📊 Parsed VRAM Data:", vramData);

          // Send the parsed VRAM data to the client
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
