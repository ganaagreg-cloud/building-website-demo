#!/usr/bin/env bash
# Optimize the raw showcase GLB into a web-ready asset.
# Run this whenever the source model is updated.
#
# Usage: bash scripts/optimize-showcase-model.sh
#
# Requires: @gltf-transform/cli (installed as devDep)
# Input:    raw-assets/modern-apartment-source.glb   (gitignored)
# Output:   public/models/showcase-apartment.glb

set -euo pipefail

INPUT="raw-assets/modern-apartment-source.glb"
OUTPUT="public/models/showcase-apartment.glb"
TMP=$(mktemp -d)

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  GLB Optimization Pipeline"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# ── Guard ────────────────────────────────────────────────────────
if [ ! -f "$INPUT" ]; then
  echo ""
  echo "❌  Source model not found at: $INPUT"
  echo ""
  echo "    Download 'Modern Apartment' from Sketchfab:"
  echo "    https://sketchfab.com/3d-models/modern-apartment-1fbb649cd6624f2bb7b7d6e30c6533a5"
  echo "    Save the GLB to: $INPUT"
  echo ""
  exit 1
fi

# ── Helpers ──────────────────────────────────────────────────────
filesize() {
  local f="$1"
  if command -v numfmt &>/dev/null; then
    stat -c%s "$f" 2>/dev/null | numfmt --to=iec || stat -f%z "$f" | numfmt --to=iec
  else
    # macOS fallback
    local b
    b=$(stat -f%z "$f" 2>/dev/null || stat -c%s "$f")
    echo "$(( b / 1048576 ))MB ($(( b / 1024 ))KB)"
  fi
}

GLTF="npx --yes gltf-transform"

echo ""
echo "📦  Source:  $INPUT  ($(filesize $INPUT))"
echo ""

# ── Step 1: Simplify geometry ────────────────────────────────────
# Source is ~3M triangles; target is under 300k (ratio 0.1 = keep 10%).
# --error 0.001 allows slightly more deviation for better compression.
# VISUALLY CHECK the result after this step before locking the ratio.
echo "🔧  [1/4] Simplifying geometry (ratio 0.10, error 0.001)..."
$GLTF simplify --ratio 0.10 --error 0.001 "$INPUT" "$TMP/simplified.glb"
echo "     After simplify:  $(filesize $TMP/simplified.glb)"
echo ""

# ── Step 2: Resize oversized textures ───────────────────────────
# Textures often dwarf geometry in final file size.
# Cap at 2048×2048; tweak down to 1024×1024 if still too large.
echo "🖼️   [2/4] Resizing textures (max 2048×2048)..."
$GLTF resize --width 2048 --height 2048 "$TMP/simplified.glb" "$TMP/resized.glb"
echo "     After resize:    $(filesize $TMP/resized.glb)"
echo ""

# ── Step 3: Test both compression methods ───────────────────────
echo "🗜️   [3/4] Testing compression (Draco vs meshopt)..."
$GLTF draco "$TMP/resized.glb"   "$TMP/draco.glb"   2>/dev/null
$GLTF meshopt "$TMP/resized.glb" "$TMP/meshopt.glb" 2>/dev/null

DRACO_B=$(stat -c%s "$TMP/draco.glb"   2>/dev/null || stat -f%z "$TMP/draco.glb")
MOPT_B=$(stat -c%s  "$TMP/meshopt.glb" 2>/dev/null || stat -f%z "$TMP/meshopt.glb")

echo "     Draco:   $(filesize $TMP/draco.glb)"
echo "     meshopt: $(filesize $TMP/meshopt.glb)"
echo ""

# ── Step 4: Pick winner, write output ───────────────────────────
echo "✅  [4/4] Writing output..."
mkdir -p "$(dirname "$OUTPUT")"

if [ "$DRACO_B" -le "$MOPT_B" ]; then
  cp "$TMP/draco.glb" "$OUTPUT"
  echo "     Using Draco (smaller by $(( (MOPT_B - DRACO_B) / 1024 ))KB)"
else
  cp "$TMP/meshopt.glb" "$OUTPUT"
  echo "     Using meshopt (smaller by $(( (DRACO_B - MOPT_B) / 1024 ))KB)"
fi

FINAL_B=$(stat -c%s "$OUTPUT" 2>/dev/null || stat -f%z "$OUTPUT")

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Done: $OUTPUT  ($(filesize $OUTPUT))"

if [ "$FINAL_B" -gt $((8 * 1048576)) ]; then
  echo ""
  echo "  ⚠️   Final file is over 8MB — flag this before proceeding."
  echo "       Consider: --ratio 0.05, or texture resize to 1024px:"
  echo "       gltf-transform resize --width 1024 --height 1024 ..."
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  Visual check → https://gltf-viewer.donmccurdy.com/"
echo "  Coordinates  → open in Three.js viewer + note room centers"
echo "  Next step    → fill in components/showcase-3d/showcase-rooms.config.ts"
echo ""

rm -rf "$TMP"
