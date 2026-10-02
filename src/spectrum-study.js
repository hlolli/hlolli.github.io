// Illustrative harmonic spectra, not an audio input or a live measurement.
// Each trace shows an earlier moment, forming a short spectral history.
const study = document.querySelector(".spectrum-study");

if (study) {
  const art = study.querySelector(".spectrum-study__art");
  const still = study.querySelector(".spectrum-study__still");
  const canvas = study.querySelector(".spectrum-study__motion");
  const context = still.getContext("2d");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const darkMode = matchMedia("(prefers-color-scheme: dark)");
  const rows = 24;
  const segments = 256;
  let gl;
  let program;
  let buffer;
  let timeLocation;
  let colorLocation;
  let frame = 0;
  let visible = false;
  let lastTime = 0;
  let elapsed = 0;
  let pageActive = true;
  let color = [0, 0, 0];
  let width = 0;
  let height = 0;

  function spectrum(frequency, time) {
    let amplitude = 0;
    const fundamental = 0.092 + Math.sin(time * 0.35) * 0.002;
    for (let harmonic = 1; harmonic <= 9; harmonic++) {
      const center = fundamental * harmonic;
      const bandwidth = 0.008 + harmonic * 0.0015;
      const distance = (frequency - center) / bandwidth;
      const strength = Math.exp(-0.22 * (harmonic - 1))
        * (0.65 + 0.35 * Math.sin(time * 0.85 - harmonic * 0.7));
      amplitude += Math.exp(-distance * distance) * strength;
    }
    return amplitude;
  }

  function drawStill() {
    if (!context) return;
    context.clearRect(0, 0, still.width, still.height);
    context.strokeStyle = `rgb(${color.map((value) => value * 255).join(",")})`;
    context.lineWidth = Math.min(devicePixelRatio || 1, 1.5);
    for (let row = 0; row < rows; row++) {
      const layer = row / (rows - 1);
      context.globalAlpha = 0.7 - layer * 0.48;
      context.beginPath();
      for (let point = 0; point <= segments; point++) {
        const frequency = point / segments;
        const amplitude = spectrum(frequency, -layer * 3.1);
        const px = frequency * 1.72 - 0.95 + layer * 0.18;
        const py = -0.72 + layer * 0.8 + amplitude * 0.95 * (1 - layer * 0.35);
        const cx = (px + 1) * still.width / 2;
        const cy = (1 - py) * still.height / 2;
        if (point === 0) context.moveTo(cx, cy);
        else context.lineTo(cx, cy);
      }
      context.stroke();
    }
  }

  function compile(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      throw new Error("Spectrum shader could not compile");
    }
    return shader;
  }

  function initialize() {
    if (program || reducedMotion.matches) return;
    try {
      gl ??= canvas.getContext("webgl", {
        alpha: true,
        antialias: true,
        depth: false,
        powerPreference: "low-power",
      });
      if (!gl || gl.isContextLost()) return;
      const vertex = compile(gl.VERTEX_SHADER, `
        attribute vec2 position;
        uniform float time;
        varying float opacity;
        float spectrum(float frequency, float moment) {
          float amplitude = 0.0;
          float fundamental = 0.092 + sin(moment * 0.35) * 0.002;
          for (int harmonic = 1; harmonic <= 9; harmonic++) {
            float n = float(harmonic);
            float center = fundamental * n;
            float bandwidth = 0.008 + n * 0.0015;
            float distance = (frequency - center) / bandwidth;
            float strength = exp(-0.22 * (n - 1.0))
              * (0.65 + 0.35 * sin(moment * 0.85 - n * 0.7));
            amplitude += exp(-distance * distance) * strength;
          }
          return amplitude;
        }
        void main() {
          float frequency = (position.x + 1.0) * 0.5;
          float layer = position.y;
          float amplitude = spectrum(frequency, time - layer * 3.1);
          gl_Position = vec4(
            frequency * 1.72 - 0.95 + layer * 0.18,
            -0.72 + layer * 0.8 + amplitude * 0.95 * (1.0 - layer * 0.35), 0.0, 1.0);
          opacity = (0.7 - layer * 0.48)
            * smoothstep(0.0, 0.035, frequency)
            * (1.0 - smoothstep(0.9, 1.0, frequency));
        }
      `);
      const fragment = compile(gl.FRAGMENT_SHADER, `
        precision mediump float;
        uniform vec3 color;
        varying float opacity;
        void main() {
          gl_FragColor = vec4(color * opacity, opacity);
        }
      `);
      const candidate = gl.createProgram();
      gl.attachShader(candidate, vertex);
      gl.attachShader(candidate, fragment);
      gl.linkProgram(candidate);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
      if (!gl.getProgramParameter(candidate, gl.LINK_STATUS)) {
        gl.deleteProgram(candidate);
        throw new Error("Spectrum shader could not link");
      }
      program = candidate;
      const vertices = new Float32Array(rows * segments * 4);
      let offset = 0;
      for (let row = 0; row < rows; row++) {
        for (let point = 0; point < segments; point++) {
          vertices[offset++] = (point / segments) * 2 - 1;
          vertices[offset++] = row / (rows - 1);
          vertices[offset++] = ((point + 1) / segments) * 2 - 1;
          vertices[offset++] = row / (rows - 1);
        }
      }
      buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
      gl.useProgram(program);
      const position = gl.getAttribLocation(program, "position");
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
      timeLocation = gl.getUniformLocation(program, "time");
      colorLocation = gl.getUniformLocation(program, "color");
      gl.clearColor(0, 0, 0, 0);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    } catch {
      if (buffer) gl.deleteBuffer(buffer);
      if (program) gl.deleteProgram(program);
      buffer = undefined;
      program = undefined;
      // The still canvas remains visible when WebGL is unavailable.
    }
  }

  function draw() {
    if (!program || gl.isContextLost()) return;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(timeLocation, elapsed);
    gl.uniform3fv(colorLocation, color);
    gl.drawArrays(gl.LINES, 0, rows * segments * 2);
  }

  function animate(now) {
    // Cap drawing at 30 fps and discard elapsed time while offscreen.
    if (!lastTime || now - lastTime >= 1000 / 30) {
      elapsed += lastTime ? Math.min((now - lastTime) / 1000, 0.1) : 0;
      lastTime = now;
      draw();
    }
    frame = requestAnimationFrame(animate);
  }

  function updatePlayback() {
    cancelAnimationFrame(frame);
    frame = 0;
    lastTime = 0;
    if (visible && pageActive && !document.hidden) initialize();
    const moving = Boolean(program) && !gl.isContextLost() && !reducedMotion.matches;
    canvas.hidden = !moving;
    still.hidden = moving;
    if (moving) {
      draw();
      if (visible && pageActive && !document.hidden) {
        frame = requestAnimationFrame(animate);
      }
    }
  }

  function resize() {
    const ratio = Math.min(devicePixelRatio || 1, 1.5);
    const nextWidth = Math.max(1, Math.round(art.clientWidth * ratio));
    const nextHeight = Math.max(1, Math.round(art.clientHeight * ratio));
    if (width === nextWidth && height === nextHeight) return;
    width = nextWidth;
    height = nextHeight;
    for (const target of [still, canvas]) {
      target.width = width;
      target.height = height;
    }
    drawStill();
    draw();
  }

  function updateColor() {
    const accent = getComputedStyle(study).getPropertyValue("--color-accent").trim();
    color = [1, 3, 5].map((start) => parseInt(accent.slice(start, start + 2), 16) / 255);
    drawStill();
    draw();
  }

  canvas.addEventListener("webglcontextlost", (event) => {
    event.preventDefault();
    cancelAnimationFrame(frame);
    program = undefined;
    buffer = undefined;
    canvas.hidden = true;
    still.hidden = false;
  });
  canvas.addEventListener("webglcontextrestored", updatePlayback);
  reducedMotion.addEventListener("change", updatePlayback);
  darkMode.addEventListener("change", updateColor);
  document.addEventListener("visibilitychange", updatePlayback);
  window.addEventListener("pagehide", () => {
    pageActive = false;
    updatePlayback();
  });
  window.addEventListener("pageshow", () => {
    pageActive = true;
    updatePlayback();
  });
  new ResizeObserver(resize).observe(art);
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    updatePlayback();
  }).observe(study);
  updateColor();
  resize();
  updatePlayback();
}
