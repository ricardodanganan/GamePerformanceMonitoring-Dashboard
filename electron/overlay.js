let lastFrameTime = performance.now();
let frameCount = 0;

function updateFPS() {
  const now = performance.now();
  frameCount++;
  if (now - lastFrameTime >= 1000) {
    document.getElementById("fps-counter").innerText = `FPS: ${frameCount}`;
    frameCount = 0;
    lastFrameTime = now;
  }
  requestAnimationFrame(updateFPS);
}

// ✅ Listen for system stats from Electron (sent by Dashboard.jsx)
window.electron.receive("update-overlay-stats", (data) => {
    document.getElementById("fps-counter").innerText = `FPS: ${data.fps}`;
    document.getElementById("cpu-usage").innerText = `CPU: ${data.cpuUsage}%`;
    document.getElementById("gpu-usage").innerText = `GPU: ${data.gpuUsage}%`;
    document.getElementById("cpu-temp").innerText = `CPU: ${data.cpuTemperature}°C`;
    document.getElementById("gpu-temp").innerText = `GPU: ${data.gpuTemperature}°C`;
});

updateFPS();
