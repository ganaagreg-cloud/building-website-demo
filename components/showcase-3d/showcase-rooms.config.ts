// ─── Showcase room hotspot data ──────────────────────────────────────────────
//
// HOW TO FILL THESE IN:
// 1. Run `npm run optimize:showcase` after placing the source GLB.
// 2. Open public/models/showcase-apartment.glb in https://gltf-viewer.donmccurdy.com/
// 3. Orbit until you're looking at a room; note the rough world-space centre.
//    OR: open in a throwaway R3F page that logs e.point on canvas click.
// 4. For each room, set:
//    - hotspotPosition: the visual pin location (room centre, slightly above floor)
//    - cameraPosition:  where the camera should fly to for a good view of that room
//    - cameraTarget:    what the camera should look at after flying in
// 5. Test values by running dev server and clicking each hotspot.
//    Adjust until transitions feel natural (~1–1.5s, not too close, not too far).
//
// COORDINATE SPACE NOTE:
// The Sketchfab "Modern Apartment" GLB typically exports at real-world scale
// (1 unit ≈ 1 metre) with Y-up. If the model looks tiny/huge on first load,
// adjust ShowcaseScene's camera position or add a <primitive scale={[x,y,z]}>.
// ─────────────────────────────────────────────────────────────────────────────

export interface RoomHotspot {
  id: string
  label: string
  hotspotPosition: [number, number, number]
  cameraPosition: [number, number, number]
  cameraTarget: [number, number, number]
}

// These coordinates are placeholders. Fill in after inspecting the model.
// Leave the array empty ([]) to disable hotspots until coordinates are known —
// the viewer will still orbit and look good without them.
export const showcaseRooms: RoomHotspot[] = [
  // {
  //   id: 'living',
  //   label: 'Зочны өрөө',       // Living room
  //   hotspotPosition: [0, 1.2, 0],
  //   cameraPosition:  [3, 2.5, 4],
  //   cameraTarget:    [0, 1.0, 0],
  // },
  // {
  //   id: 'kitchen',
  //   label: 'Гал тогоо',         // Kitchen
  //   hotspotPosition: [-3, 1.2, 0],
  //   cameraPosition:  [-5, 2.5, 2],
  //   cameraTarget:    [-3, 1.0, 0],
  // },
  // {
  //   id: 'bedroom',
  //   label: 'Унтлагын өрөө',     // Bedroom
  //   hotspotPosition: [0, 1.2, -4],
  //   cameraPosition:  [2, 2.5, -6],
  //   cameraTarget:    [0, 1.0, -4],
  // },
  // {
  //   id: 'bathroom',
  //   label: 'Угаалгын өрөө',     // Bathroom
  //   hotspotPosition: [3, 1.2, -4],
  //   cameraPosition:  [5, 2.0, -4],
  //   cameraTarget:    [3, 1.0, -4],
  // },
  // {
  //   id: 'workspace',
  //   label: 'Ажлын өрөө',        // Work space
  //   hotspotPosition: [-3, 1.2, -4],
  //   cameraPosition:  [-5, 2.5, -4],
  //   cameraTarget:    [-3, 1.0, -4],
  // },
]
