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

updateFPS();
