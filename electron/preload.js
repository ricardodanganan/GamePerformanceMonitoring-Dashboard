window.addEventListener("DOMContentLoaded", () => {
    const fpsElement = document.getElementById("fps-counter");
  
    let lastFrameTime = performance.now();
    let frameCount = 0;
  
    function updateFPS() {
      const now = performance.now();
      frameCount++;
      if (now - lastFrameTime >= 1000) {
        fpsElement.innerText = `FPS: ${frameCount}`;
        frameCount = 0;
        lastFrameTime = now;
      }
      requestAnimationFrame(updateFPS);
    }
  
    updateFPS();
  });
  