# 2.5D Dollhouse Depth-Parallax Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a scroll-driven depth-parallax (2.5D) effect to the dollhouse images — a WebGL shader shifts pixels by their estimated depth so near surfaces drift differently from the background as you scroll, giving the flat PNG an illusion of volume.

**Architecture:** A Python script (Depth Anything V2 via HuggingFace Transformers) generates a grayscale depth map for each dollhouse PNG offline. A raw-WebGL renderer loads the color + depth textures and runs a fragment shader that offsets UVs by `(depth − 0.5) × intensity × progress`. A `DepthParallax` React client component wraps the renderer, accepts either a parent-controlled `renderRef` (home section) or creates its own ScrollTrigger (detail pages), and degrades to `<Image>` if WebGL is unavailable or `prefers-reduced-motion` is set.

**Tech Stack:** Python 3 + `transformers` + PyTorch CPU (one-time offline); raw WebGL (no three.js, bundle stays lean); GSAP ScrollTrigger (already in project); Next.js dynamic import for code-splitting.

---

## File Map

**Create:**
- `tools/depth/generate_depth.py` — offline depth-map generator
- `tools/depth/requirements.txt` — Python deps
- `tools/depth/render-depth.ps1` — PowerShell wrapper that processes all 5 dollhouse PNGs
- `lib/webgl/depthParallax.ts` — WebGL renderer (shaders, texture loading, render + destroy)
- `components/common/DepthParallax.tsx` — React client wrapper (scroll wiring, fallbacks)

**Modify:**
- `types/index.ts` — add `depthSrc?` to `DollhouseRevealSectionConfig`, `floorPlanDepthMap?` to `UnitType`
- `package.json` — add `render:depth` script
- `components/home/sections/DollhouseRevealSection.tsx` — use `DepthParallax` when `config.depthSrc` is set; add `onUpdate` to existing GSAP timeline to drive progress
- `components/sections/detail/FloorPlan.tsx` — add `'use client'`, `useRef`, use `DepthParallax` when `unitType.floorPlanDepthMap` is set
- `config/client.config.ts` — add `depthSrc` + `floorPlanDepthMap` paths after depth maps are generated (Task 7)

---

### Task 1: Python depth-map tooling

**Files:**
- Create: `tools/depth/requirements.txt`
- Create: `tools/depth/generate_depth.py`
- Create: `tools/depth/render-depth.ps1`
- Modify: `package.json` (scripts section)

No automated tests for this task. Verification is manual: run the script, inspect the output image in an image viewer.

- [ ] **Step 1: Create `tools/depth/requirements.txt`**

```
transformers>=4.40.0
torch>=2.0.0
Pillow>=10.0.0
numpy>=1.24.0
```

- [ ] **Step 2: Create `tools/depth/generate_depth.py`**

```python
#!/usr/bin/env python3
"""
Generates grayscale depth maps for dollhouse PNG images using Depth Anything V2.
Usage: python generate_depth.py <image1.png> [image2.png ...]
Output: <image>-depth.png saved next to each source file.

First run downloads the model (~200 MB) to ~/.cache/huggingface/
"""
import sys
from pathlib import Path
import numpy as np
from PIL import Image


def load_pipeline():
    from transformers import pipeline
    return pipeline(
        "depth-estimation",
        model="depth-anything/Depth-Anything-V2-Small-hf",
        device="cpu",
    )


def generate_depth_map(pipe, src_path: Path) -> Path:
    img = Image.open(src_path).convert("RGB")
    result = pipe(img)
    depth_img = result["depth"]  # PIL Image
    arr = np.array(depth_img, dtype=np.float32)
    # Normalize to 0-255 (white = near, black = far)
    if arr.max() > arr.min():
        arr = (arr - arr.min()) / (arr.max() - arr.min()) * 255.0
    depth_gray = Image.fromarray(arr.astype(np.uint8)).convert("L")
    out_path = src_path.parent / (src_path.stem + "-depth.png")
    depth_gray.save(out_path)
    return out_path


def main():
    if len(sys.argv) < 2:
        print("Usage: python generate_depth.py <image.png> [image.png ...]")
        sys.exit(1)

    print("Loading Depth Anything V2 model (downloads ~200 MB on first run)...")
    pipe = load_pipeline()
    print("Model loaded.")

    for arg in sys.argv[1:]:
        src = Path(arg).resolve()
        if not src.exists():
            print(f"  SKIP (not found): {src}")
            continue
        print(f"  Processing {src.name} ...")
        out = generate_depth_map(pipe, src)
        print(f"  -> Saved {out.name}")

    print("Done.")


if __name__ == "__main__":
    main()
```

- [ ] **Step 3: Create `tools/depth/render-depth.ps1`**

```powershell
<#
.SYNOPSIS
  Generate grayscale depth maps for all Five Star dollhouse images.
  Prerequisites: pip install -r tools/depth/requirements.txt
.EXAMPLE
  npm run render:depth
#>

$ErrorActionPreference = "Stop"
$scriptDir  = $PSScriptRoot
$repoRoot   = (Get-Item $scriptDir).Parent.Parent.FullName

$dollhouses = @(
  "$repoRoot\public\clients\five-star\unit-types\2br-43-dollhouse.png",
  "$repoRoot\public\clients\five-star\unit-types\2br-44-dollhouse.png",
  "$repoRoot\public\clients\five-star\unit-types\2br-51-dollhouse.png",
  "$repoRoot\public\clients\five-star\unit-types\2br-56-dollhouse.png",
  "$repoRoot\public\clients\five-star\unit-types\3br-63-dollhouse.png"
)

$existing = $dollhouses | Where-Object { Test-Path $_ }
if ($existing.Count -eq 0) {
    Write-Error "No dollhouse PNGs found under public/clients/five-star/unit-types/."
    exit 1
}

$pyScript = Join-Path $scriptDir "generate_depth.py"
python $pyScript @existing
```

- [ ] **Step 4: Add `render:depth` to `package.json` scripts**

Open `package.json`. The current scripts section is:
```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "test": "jest",
  "test:watch": "jest --watch"
},
```

Add one line:
```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "test": "jest",
  "test:watch": "jest --watch",
  "render:depth": "powershell -ExecutionPolicy Bypass -File tools/depth/render-depth.ps1"
},
```

- [ ] **Step 5: Install Python deps and smoke-test on one image**

```powershell
pip install -r tools/depth/requirements.txt
python tools/depth/generate_depth.py "public/clients/five-star/unit-types/2br-44-dollhouse.png"
```

Expected output:
```
Loading Depth Anything V2 model (downloads ~200 MB on first run)...
Model loaded.
  Processing 2br-44-dollhouse.png ...
  -> Saved 2br-44-dollhouse-depth.png
Done.
```

Open `public/clients/five-star/unit-types/2br-44-dollhouse-depth.png` in an image viewer. It should be a grayscale image where bright areas are nearer surfaces (walls, furniture fronts) and dark areas are farther back (rear walls, floor).

- [ ] **Step 6: Commit**

```bash
git add tools/depth/ package.json
git commit -m "feat: offline depth-map tooling — Depth Anything V2 via transformers"
```

---

### Task 2: Type extensions

**Files:**
- Modify: `types/index.ts` at lines 39–43 and 129–142

- [ ] **Step 1: Add `depthSrc?` to `DollhouseRevealSectionConfig`**

In `types/index.ts`, find and replace:

```typescript
export interface DollhouseRevealSectionConfig {
  kind: 'dollhouseReveal'
  enabled: boolean
  imageSrc: string
}
```

Replace with:

```typescript
export interface DollhouseRevealSectionConfig {
  kind: 'dollhouseReveal'
  enabled: boolean
  imageSrc: string
  depthSrc?: string
}
```

- [ ] **Step 2: Add `floorPlanDepthMap?` to `UnitType`**

In `types/index.ts`, find and replace:

```typescript
export interface UnitType {
  id: string
  name: string
  rooms: number
  sizeRange: [number, number]
  priceFrom: number
  floorPlanImage: string
  gallery: string[]
  features: string[]
  blurb: string
  tour?: string
  dollhouseImage?: string
  tourFrames?: string[]
}
```

Replace with:

```typescript
export interface UnitType {
  id: string
  name: string
  rooms: number
  sizeRange: [number, number]
  priceFrom: number
  floorPlanImage: string
  floorPlanDepthMap?: string
  gallery: string[]
  features: string[]
  blurb: string
  tour?: string
  dollhouseImage?: string
  tourFrames?: string[]
}
```

- [ ] **Step 3: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add types/index.ts
git commit -m "feat(types): add depthSrc to DollhouseRevealSectionConfig, floorPlanDepthMap to UnitType"
```

---

### Task 3: WebGL depth-parallax renderer

**Files:**
- Create: `lib/webgl/depthParallax.ts`

Pure TypeScript + WebGL — no React, no GSAP. Accepts a `<canvas>`, color URL, depth URL, and intensity. Returns `{ render(progress), destroy() }`.

No automated tests (WebGL requires a browser context; jest-environment-node has no DOM). Visual verification in Task 5.

- [ ] **Step 1: Create `lib/webgl/depthParallax.ts`**

```typescript
export interface DepthParallaxRenderer {
  render(progress: number): void
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
  const gl = (
    canvas.getContext('webgl') ??
    (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null)
  )
  if (!gl) return null

  // Match canvas buffer to CSS display size (capped at 2× DPR for mobile perf)
  const dpr = Math.min(window.devicePixelRatio ?? 1, 2)
  canvas.width = Math.round(canvas.offsetWidth * dpr)
  canvas.height = Math.round(canvas.offsetHeight * dpr)
  gl.viewport(0, 0, canvas.width, canvas.height)

  const vs = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SRC)
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SRC)
  const program = gl.createProgram()
  if (!program) return null
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
  if (!quadBuf) return null
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

  function destroy(): void {
    gl.deleteTexture(colorTex)
    gl.deleteTexture(depthTex)
    gl.deleteBuffer(quadBuf)
    gl.deleteShader(vs)
    gl.deleteShader(fs)
    gl.deleteProgram(program)
  }

  render(0) // initial draw at rest position
  return { render, destroy }
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors on `lib/webgl/depthParallax.ts`.

- [ ] **Step 3: Commit**

```bash
git add lib/webgl/depthParallax.ts
git commit -m "feat: raw WebGL depth-parallax renderer — vertex/fragment shaders, texture loading"
```

---

### Task 4: DepthParallax React component

**Files:**
- Create: `components/common/DepthParallax.tsx`

Client component. Initialises the WebGL renderer asynchronously on mount. If `renderRef` is provided, exposes `renderer.render` to the parent (used by DollhouseRevealSection). Otherwise creates its own ScrollTrigger on `scrollTriggerTarget` (used by FloorPlan). Falls back to `<Image>` if WebGL unavailable or `prefers-reduced-motion` is active.

- [ ] **Step 1: Create `components/common/DepthParallax.tsx`**

```tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import type { DepthParallaxRenderer } from '@/lib/webgl/depthParallax'

interface DepthParallaxProps {
  colorSrc: string
  depthSrc: string
  alt: string
  intensity?: number
  sizes?: string
  /**
   * When provided, the parent controls scroll progress.
   * The component sets renderRef.current = renderer.render after init.
   * Call renderRef.current(progress) from a GSAP onUpdate callback.
   * progress range: −1 (start) to +1 (end).
   */
  renderRef?: React.MutableRefObject<((progress: number) => void) | null>
  /**
   * When renderRef is not provided, the component creates its own ScrollTrigger
   * on this element. The element must be in the DOM when the component mounts.
   */
  scrollTriggerTarget?: React.RefObject<HTMLElement | null>
}

export function DepthParallax({
  colorSrc,
  depthSrc,
  alt,
  intensity = 0.04,
  sizes = '100vw',
  renderRef,
  scrollTriggerTarget,
}: DepthParallaxProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rendererRef = useRef<DepthParallaxRenderer | null>(null)
  const [webglFailed, setWebglFailed] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setWebglFailed(true)
      return
    }

    const canvas = canvasRef.current
    if (!canvas) return

    let cancelled = false
    let stInstance: { kill(): void } | null = null

    import('@/lib/webgl/depthParallax')
      .then(({ createDepthParallaxRenderer }) =>
        createDepthParallaxRenderer(canvas, colorSrc, depthSrc, intensity),
      )
      .then((renderer) => {
        if (cancelled) {
          renderer?.destroy()
          return
        }
        if (!renderer) {
          setWebglFailed(true)
          return
        }

        rendererRef.current = renderer

        if (renderRef) {
          // Parent (DollhouseRevealSection) drives progress via GSAP onUpdate
          renderRef.current = renderer.render
        } else if (scrollTriggerTarget?.current) {
          // Self-managed: create a ScrollTrigger for detail-page floor plans
          Promise.all([
            import('gsap').then((m) => m.default),
            import('gsap/ScrollTrigger').then((m) => m.default),
          ]).then(([gsap, ScrollTrigger]) => {
            if (cancelled) return
            gsap.registerPlugin(ScrollTrigger)
            stInstance = ScrollTrigger.create({
              trigger: scrollTriggerTarget.current,
              start: 'top 85%',
              end: 'bottom 15%',
              scrub: 1.4,
              onUpdate: (self) => renderer.render(self.progress * 2 - 1),
            })
          })
        }
      })
      .catch(() => {
        if (!cancelled) setWebglFailed(true)
      })

    return () => {
      cancelled = true
      stInstance?.kill()
      rendererRef.current?.destroy()
      rendererRef.current = null
      if (renderRef) renderRef.current = null
    }
  }, [colorSrc, depthSrc, intensity, renderRef, scrollTriggerTarget])

  if (webglFailed) {
    return (
      <Image
        src={colorSrc}
        alt={alt}
        fill
        className="object-cover"
        sizes={sizes}
      />
    )
  }

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          display: 'block',
        }}
      />
      {/* Accessible label for screen readers since the canvas is aria-hidden */}
      <span className="sr-only">{alt}</span>
    </>
  )
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/common/DepthParallax.tsx
git commit -m "feat: DepthParallax component — WebGL canvas with reduced-motion + no-WebGL fallbacks"
```

---

### Task 5: Wire DollhouseRevealSection (home page)

**Files:**
- Modify: `components/home/sections/DollhouseRevealSection.tsx` (full replacement)

Add `depthRenderRef`. Add `onUpdate` to the existing GSAP ScrollTrigger. Swap `<Image>` → `<DepthParallax>` when `config.depthSrc` is set. When `depthSrc` is absent the section works exactly as before.

- [ ] **Step 1: Replace `components/home/sections/DollhouseRevealSection.tsx` entirely**

```tsx
'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { DepthParallax } from '@/components/common/DepthParallax'
import type { DollhouseRevealSectionConfig } from '@/types'

gsap.registerPlugin(ScrollTrigger)

export function DollhouseRevealSection({ config }: { config: DollhouseRevealSectionConfig }) {
  const sectionRef = useRef<HTMLElement>(null)
  const imageWrapRef = useRef<HTMLDivElement>(null)
  const lightOverlayRef = useRef<HTMLDivElement>(null)
  // Set by DepthParallax once its WebGL renderer is ready; called on every scroll tick.
  const depthRenderRef = useRef<((progress: number) => void) | null>(null)

  useEffect(() => {
    const section = sectionRef.current
    const imageWrap = imageWrapRef.current
    const lightOverlay = lightOverlayRef.current
    if (!section || !imageWrap || !lightOverlay) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(imageWrap, { clipPath: 'inset(0%)' })
      gsap.set(lightOverlay, { opacity: 0 })
      return
    }

    gsap.set(imageWrap, { clipPath: 'inset(7%)' })
    gsap.set(lightOverlay, { opacity: 0 })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=140%',
        pin: true,
        scrub: 1.6,
        anticipatePin: 1,
        onUpdate: (self) => {
          // Map ScrollTrigger progress 0→1 to parallax range −1→+1
          depthRenderRef.current?.((self.progress - 0.5) * 2)
        },
      },
    })

    // Phase 1 (0→75%): inset shrinks — image bursts to full-bleed
    tl.to(imageWrap, { clipPath: 'inset(0%)', ease: 'power2.inOut', duration: 0.75 }, 0)

    // Phase 2 (60→100%): light wash fades in — colour-break to the light sections below
    tl.to(lightOverlay, { opacity: 0.18, ease: 'power1.inOut', duration: 0.4 }, 0.55)

    return () => {
      tl.scrollTrigger?.kill()
      tl.kill()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      aria-label="Five Star Residence интерьерийн нэвтэрч харах"
      className="relative w-full overflow-hidden"
      style={{ height: '100svh', backgroundColor: 'var(--bg-dark)' }}
    >
      {/* Image/canvas — clip-path shrinks from 7% inset to full-bleed on scroll */}
      <div ref={imageWrapRef} className="absolute inset-0">
        {config.depthSrc ? (
          <DepthParallax
            colorSrc={config.imageSrc}
            depthSrc={config.depthSrc}
            alt="Five Star Residence интерьер"
            intensity={0.05}
            renderRef={depthRenderRef}
          />
        ) : (
          <Image
            src={config.imageSrc}
            alt="Five Star Residence интерьер"
            fill
            className="object-cover"
            sizes="100vw"
          />
        )}
      </div>

      {/* Light overlay — fades in at end of scroll for colour-break transition */}
      <div
        ref={lightOverlayRef}
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundColor: 'var(--bg-light)' }}
      />
    </section>
  )
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Smoke-test in dev (without depth map yet)**

```bash
npm run dev
```

Open `http://localhost:3000`. Scroll to the DollhouseRevealSection. Since `config.depthSrc` is not yet set (that comes in Task 7), it should render the normal `<Image>` — confirming the fallback path is intact and the section still works.

- [ ] **Step 4: Commit**

```bash
git add components/home/sections/DollhouseRevealSection.tsx
git commit -m "feat: wire DepthParallax into DollhouseRevealSection — activates when depthSrc is configured"
```

---

### Task 6: Wire FloorPlan detail page

**Files:**
- Modify: `components/sections/detail/FloorPlan.tsx` (full replacement)

Add `'use client'` (needed for `useRef`). Add `floorPanelRef` on the right panel. Swap `<Image>` → `<DepthParallax>` when `unitType.floorPlanDepthMap` is set. When the field is absent the component renders exactly as before.

- [ ] **Step 1: Replace `components/sections/detail/FloorPlan.tsx` entirely**

```tsx
'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { DepthParallax } from '@/components/common/DepthParallax'
import type { UnitType } from '@/types'

export function FloorPlan({ unitType }: { unitType: UnitType }) {
  const borderColor = 'rgba(0,0,0,0.07)'
  const floorPanelRef = useRef<HTMLDivElement>(null)

  return (
    <div
      className="flex flex-col md:flex-row"
      style={{ borderTop: `1px solid ${borderColor}`, borderBottom: `1px solid ${borderColor}` }}
    >
      {/* Left: numbered features */}
      <div
        className="flex flex-col justify-center"
        style={{
          flex: '0 0 44%',
          padding: 'clamp(2.5rem, 5vw, 4.5rem)',
          backgroundColor: '#FFFFFF',
        }}
      >
        <h2
          className="font-display font-light mb-8"
          style={{
            fontSize: 'clamp(1.6rem, 3vw, 2.25rem)',
            lineHeight: 1.1,
            color: 'var(--color-text)',
          }}
        >
          Онцлогууд
        </h2>
        <div style={{ borderTop: `1px solid ${borderColor}` }}>
          {unitType.features.map((feat, i) => (
            <div
              key={feat}
              className="flex items-baseline gap-4 py-3"
              style={{ borderBottom: `1px solid ${borderColor}` }}
            >
              <span
                className="font-utility text-[10px] shrink-0 tabular-nums"
                style={{ color: 'rgba(0,0,0,0.28)' }}
              >
                0{i + 1}
              </span>
              <span
                className="font-body text-sm"
                style={{ color: 'var(--color-text)', lineHeight: 1.5 }}
              >
                {feat}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Right: floor plan (or depth-parallax canvas) on gray panel */}
      <div
        ref={floorPanelRef}
        className="relative flex items-center justify-center"
        style={{
          flex: '0 0 56%',
          backgroundColor: '#F4F4F4',
          minHeight: 'clamp(280px, 40vw, 520px)',
          padding: 'clamp(2rem, 5vw, 4rem)',
        }}
      >
        <span
          className="font-utility text-[10px] tracking-[0.12em] uppercase absolute"
          style={{ top: '1.25rem', left: '1.5rem', color: 'rgba(0,0,0,0.32)' }}
        >
          Төлөвлөгөө
        </span>
        <div className="relative w-full" style={{ maxWidth: '480px', aspectRatio: '4/3' }}>
          {unitType.floorPlanDepthMap ? (
            <DepthParallax
              colorSrc={unitType.floorPlanImage}
              depthSrc={unitType.floorPlanDepthMap}
              alt={`${unitType.name} орон сууцны давхрын зураг`}
              intensity={0.025}
              scrollTriggerTarget={floorPanelRef}
              sizes="(max-width: 768px) 100vw, 56vw"
            />
          ) : (
            <Image
              src={unitType.floorPlanImage}
              alt={`${unitType.name} орон сууцны давхрын зураг`}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 56vw"
              loading="lazy"
            />
          )}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors. (The parent `app/residences/[typeId]/page.tsx` is a server component that renders FloorPlan — this is valid; Next.js App Router allows server components to import client components.)

- [ ] **Step 3: Smoke-test in dev (without depth map yet)**

```bash
npm run dev
```

Open `http://localhost:3000/residences/2br`. The FloorPlan section should render exactly as before (the `<Image>` fallback, since `floorPlanDepthMap` is not yet set).

- [ ] **Step 4: Commit**

```bash
git add components/sections/detail/FloorPlan.tsx
git commit -m "feat: wire DepthParallax into FloorPlan — activates when floorPlanDepthMap is configured"
```

---

### Task 7: Generate depth maps + wire config

**Files:**
- Modify: `config/client.config.ts`

Run the tool to generate all 5 depth maps, then add `depthSrc` to the home section config and `floorPlanDepthMap` to the 2br and 3br unit types.

- [ ] **Step 1: Generate all 5 depth maps**

```powershell
npm run render:depth
```

Expected output (order may vary):
```
Loading Depth Anything V2 model...
Model loaded.
  Processing 2br-43-dollhouse.png ...
  -> Saved 2br-43-dollhouse-depth.png
  Processing 2br-44-dollhouse.png ...
  -> Saved 2br-44-dollhouse-depth.png
  Processing 2br-51-dollhouse.png ...
  -> Saved 2br-51-dollhouse-depth.png
  Processing 2br-56-dollhouse.png ...
  -> Saved 2br-56-dollhouse-depth.png
  Processing 3br-63-dollhouse.png ...
  -> Saved 3br-63-dollhouse-depth.png
Done.
```

Verify 5 new `*-depth.png` files exist in `public/clients/five-star/unit-types/`. Open one in an image viewer — it should be grayscale with bright areas at near surfaces.

- [ ] **Step 2: Add `depthSrc` to the `dollhouseReveal` section in `config/client.config.ts`**

Find:
```typescript
      {
        kind: 'dollhouseReveal',
        enabled: true,
        imageSrc: '/clients/five-star/unit-types/2br-44-dollhouse.png',
      },
```

Replace with:
```typescript
      {
        kind: 'dollhouseReveal',
        enabled: true,
        imageSrc: '/clients/five-star/unit-types/2br-44-dollhouse.png',
        depthSrc: '/clients/five-star/unit-types/2br-44-dollhouse-depth.png',
      },
```

- [ ] **Step 3: Add `floorPlanDepthMap` to the `2br` unit type in `config/client.config.ts`**

Find the `2br` entry in `unitTypes`. It starts with:
```typescript
    {
      id: '2br',
      name: '2 өрөө',
      rooms: 2,
      sizeRange: [44, 56],
      priceFrom: 260_000_000,
      floorPlanImage: '/clients/five-star/unit-types/2br-44-dollhouse.png',
      dollhouseImage: '/clients/five-star/unit-types/2br-44-dollhouse.png',
```

Add one line after `floorPlanImage`:
```typescript
      floorPlanImage: '/clients/five-star/unit-types/2br-44-dollhouse.png',
      floorPlanDepthMap: '/clients/five-star/unit-types/2br-44-dollhouse-depth.png',
      dollhouseImage: '/clients/five-star/unit-types/2br-44-dollhouse.png',
```

- [ ] **Step 4: Add `floorPlanDepthMap` to the `3br` unit type in `config/client.config.ts`**

Find the `3br` entry. It starts with:
```typescript
    {
      id: '3br',
      name: '3 өрөө',
      rooms: 3,
      sizeRange: [63, 63],
      priceFrom: 380_000_000,
      floorPlanImage: '/clients/five-star/unit-types/3br-63-dollhouse.png',
      dollhouseImage: '/clients/five-star/unit-types/3br-63-dollhouse.png',
```

Add one line after `floorPlanImage`:
```typescript
      floorPlanImage: '/clients/five-star/unit-types/3br-63-dollhouse.png',
      floorPlanDepthMap: '/clients/five-star/unit-types/3br-63-dollhouse-depth.png',
      dollhouseImage: '/clients/five-star/unit-types/3br-63-dollhouse.png',
```

- [ ] **Step 5: Start dev server and verify the full effect**

```bash
npm run dev
```

**Home page — DollhouseRevealSection:**
1. Open `http://localhost:3000`
2. Scroll slowly through the full-screen pinned dollhouse section
3. The image should show depth-parallax: near surfaces (wall corners, furniture edges) shift slightly against the background as you scroll
4. The existing clip-path reveal animation and light-wash should still play correctly around the parallax

**Detail pages — FloorPlan:**
1. Open `http://localhost:3000/residences/2br`, scroll to the FloorPlan section
2. As the floor plan panel enters/exits the viewport, the dollhouse image should shift subtly — close edges move more than the back walls
3. Repeat for `http://localhost:3000/residences/3br`

**Reduced-motion check:**
1. In Chrome DevTools → Rendering → "Emulate CSS media feature: prefers-reduced-motion: reduce"
2. Reload. Both the home section and detail FloorPlan should render plain static images — no canvas, no parallax.

**Studio and 1BR (no depth map):**
1. Open `http://localhost:3000/residences/studio` and `http://localhost:3000/residences/1br`
2. FloorPlan should render normally with the `<Image>` fallback (no `floorPlanDepthMap` is set for these types)

- [ ] **Step 6: Commit everything**

```bash
git add public/clients/five-star/unit-types/*-depth.png config/client.config.ts
git commit -m "feat: generate Five Star depth maps + wire 2.5D parallax into home + residence detail pages"
```

---

## Self-Review

**Spec coverage:**
- ✅ Offline depth-map generation (Python / Depth Anything V2) — Task 1
- ✅ `depthSrc` config field — Task 2
- ✅ `floorPlanDepthMap` config field — Task 2
- ✅ Raw WebGL renderer (no three.js) — Task 3
- ✅ Fragment shader: `(depth − 0.5) × intensity × progress` offset — Task 3
- ✅ `DepthParallax` React component — Task 4
- ✅ `prefers-reduced-motion` fallback → static image — Task 4
- ✅ No-WebGL fallback → static image — Task 4
- ✅ Home section: parallax driven by existing GSAP pinned timeline `onUpdate` — Task 5
- ✅ Detail pages: self-managed ScrollTrigger — Task 6
- ✅ Mobile perf: canvas buffer capped at 2× DPR — Task 3
- ✅ Config-driven: no hardcoding, fallback-safe when fields absent — Tasks 2, 5, 6

**Placeholder scan:** None found.

**Type consistency:**
- `DepthParallaxRenderer` defined in Task 3 (`lib/webgl/depthParallax.ts`), imported by Task 4 ✅
- `renderRef: MutableRefObject<((p: number) => void) | null>` defined in Task 4, used in Task 5 ✅
- `scrollTriggerTarget: RefObject<HTMLElement | null>` defined in Task 4, used in Task 6 ✅
- `config.depthSrc` added to type in Task 2, read in Task 5, set in Task 7 ✅
- `unitType.floorPlanDepthMap` added to type in Task 2, read in Task 6, set in Task 7 ✅
