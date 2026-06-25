export interface DepthParallaxRenderer {
  render(progress: number): void
  /** Re-reads canvas CSS dimensions, updates the WebGL viewport, and redraws. */
  resize(): void
  destroy(): void
}

const VERTEX_SRC = `
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`

// Fragment shader: offsets UVs by depth × intensity × progress.
// depth=1 (white, near) shifts most; depth=0 (black, far) shifts opposite.
// clamp prevents edge bleed.
const FRAGMENT_SRC = `
precision mediump float;
uniform sampler2D u_color;
uniform sampler2D u_depth;
uniform float u_progress;
uniform float u_intensity;
varying vec2 v_uv;
void main() {
  float d = texture2D(u_depth, v_uv).r;
  float shift = (d - 0.5) * u_intensity * u_progress;
  vec2 uv = clamp(v_uv + vec2(shift, shift * 0.35), 0.0, 1.0);
  gl_FragColor = texture2D(u_color, uv);
}
`

function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  src: string,
): WebGLShader {
  const shader = gl.createShader(type)
  if (!shader) throw new Error('gl.createShader returned null')
  gl.shaderSource(shader, src)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader) ?? 'unknown'
    gl.deleteShader(shader)
    throw new Error(`Shader compile error: ${log}`)
  }
  return shader
}

function loadTexture(
  gl: WebGLRenderingContext,
  src: string,
): Promise<WebGLTexture> {
  return new Promise((resolve, reject) => {
    const tex = gl.createTexture()
    if (!tex) { reject(new Error('gl.createTexture returned null')); return }
    const img = new window.Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, tex)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
      resolve(tex)
    }
    img.onerror = () => reject(new Error(`Failed to load texture: ${src}`))
    img.src = src
  })
}

/**
 * Creates a WebGL depth-parallax renderer on the given canvas.
 * Returns null if WebGL is unavailable (caller should fall back to <Image>).
 *
 * @param canvas     Target canvas element (must have CSS dimensions set before calling)
 * @param colorSrc   URL to the color image (the dollhouse PNG)
 * @param depthSrc   URL to the grayscale depth map PNG
 * @param intensity  Max UV shift at progress=±1. Default 0.04.
 */
export async function createDepthParallaxRenderer(
  canvas: HTMLCanvasElement,
  colorSrc: string,
  depthSrc: string,
  intensity = 0.04,
): Promise<DepthParallaxRenderer | null> {
  const glOrNull = (
    canvas.getContext('webgl') ??
    (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null)
  )
  if (!glOrNull) return null
  const gl: WebGLRenderingContext = glOrNull

  // Match canvas buffer to CSS display size (capped at 2× DPR for mobile perf)
  const dpr = Math.min(window.devicePixelRatio ?? 1, 2)
  canvas.width = Math.round(canvas.offsetWidth * dpr)
  canvas.height = Math.round(canvas.offsetHeight * dpr)
  gl.viewport(0, 0, canvas.width, canvas.height)

  const vs = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SRC)
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SRC)
  const program = gl.createProgram()
  if (!program) {
    gl.deleteShader(vs)
    gl.deleteShader(fs)
    return null
  }
  gl.attachShader(program, vs)
  gl.attachShader(program, fs)
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program) ?? 'unknown'
    gl.deleteProgram(program)
    throw new Error(`Program link error: ${log}`)
  }

  // Full-screen quad covering clip space (rendered as TRIANGLE_STRIP)
  const quadBuf = gl.createBuffer()
  if (!quadBuf) {
    gl.deleteShader(vs)
    gl.deleteShader(fs)
    gl.deleteProgram(program)
    return null
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf)
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
    gl.STATIC_DRAW,
  )

  const [colorTex, depthTex] = await Promise.all([
    loadTexture(gl, colorSrc),
    loadTexture(gl, depthSrc),
  ])

  gl.useProgram(program)

  const posLoc = gl.getAttribLocation(program, 'a_position')
  gl.enableVertexAttribArray(posLoc)
  gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf)
  gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)

  const uColorLoc = gl.getUniformLocation(program, 'u_color')
  const uDepthLoc = gl.getUniformLocation(program, 'u_depth')
  const uProgressLoc = gl.getUniformLocation(program, 'u_progress')
  const uIntensityLoc = gl.getUniformLocation(program, 'u_intensity')

  gl.uniform1i(uColorLoc, 0)
  gl.uniform1i(uDepthLoc, 1)
  gl.uniform1f(uIntensityLoc, intensity)

  function render(progress: number): void {
    gl.uniform1f(uProgressLoc, progress)
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, colorTex)
    gl.activeTexture(gl.TEXTURE1)
    gl.bindTexture(gl.TEXTURE_2D, depthTex)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  }

  function resize(): void {
    const dpr2 = Math.min(window.devicePixelRatio ?? 1, 2)
    canvas.width = Math.round(canvas.offsetWidth * dpr2)
    canvas.height = Math.round(canvas.offsetHeight * dpr2)
    gl.viewport(0, 0, canvas.width, canvas.height)
  }

  function destroy(): void {
    gl.deleteTexture(colorTex)
    gl.deleteTexture(depthTex)
    gl.deleteBuffer(quadBuf)
    gl.deleteShader(vs)
    gl.deleteShader(fs)
    gl.deleteProgram(program)
  }

  // Re-read canvas dimensions just before the initial draw — the first browser
  // paint may have occurred by now (textures loaded async), so offsetWidth/Height
  // are now reliable.
  resize()
  render(0) // initial draw at rest position
  return { render, resize, destroy }
}
