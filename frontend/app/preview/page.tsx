import { DataDrivenScene } from "@/components/viewer/DataDrivenScene";

// Example data from backend/example_data.json
// Adjusted positions to align with L-bracket hole location
const exampleData = {
  "stepId": 1,
  "title": "Attach L-bracket with screw and washer",
  "description": "Insert the screw and washer through the L-bracket and tighten into the base panel.",
  "parts": [
    {
      "id": "bracket_L_01",
      "name": "L Bracket",
      "type": "metal_bracket",
      "quantity": 2,
      "dimensions": { "width": 0.12, "height": 0.05, "depth": 0.02 },
      "material": "metal",
      "color": "#C0C0C0",
      "position": { "x": 0, "y": 0, "z": 0 },
      "rotation": { "x": 0, "y": 0, "z": 0 },
      "scale": { "x": 1, "y": 1, "z": 1 },
      "model": "/models/bracket_L.glb"
    },
    {
      "id": "washer_01",
      "name": "Washer",
      "type": "metal_washer",
      "quantity": 2,
      "dimensions": { "radius": 0.01, "thickness": 0.002 },
      "material": "metal",
      "color": "#AAAAAA",
      "position": { "x": 0.01, "y": 0.07, "z": 0 },
      "rotation": { "x": 0, "y": 0, "z": 1.5708 },
      "scale": { "x": 1, "y": 1, "z": 1 },
      "model": "/models/washer.glb"
    },
    {
      "id": "screw_01",
      "name": "Screw",
      "type": "screw_flathead",
      "quantity": 1,
      "dimensions": { "length": 0.04, "radius": 0.004 },
      "material": "metal",
      "color": "#777777",
      "position": { "x": 0.01, "y": 0.07, "z": 0 },
      "rotation": { "x": 0, "y": 0, "z": 0 },
      "scale": { "x": 1, "y": 1, "z": 1 },
      "model": "/models/screw.glb"
    }
  ],
  "assemblySequence": [
    {
      "action": "move" as const,
      "targetId": "washer_01",
      "from": { "x": 0.1, "y": 0.07, "z": 0 },
      "to": { "x": 0.025, "y": 0.07, "z": 0 },
      "duration": 1.5
    },
    {
      "action": "move" as const,
      "targetId": "screw_01",
      "from": { "x": 0.15, "y": 0.07, "z": 0 },
      "to": { "x": 0.03, "y": 0.07, "z": 0 },
      "duration": 2.0
    },
    {
      "action": "rotate" as const,
      "targetId": "screw_01",
      "axis": "x",
      "angle": 1440,
      "duration": 2.0
    },
    {
      "action": "move" as const,
      "targetId": "screw_01",
      "from": { "x": 0.03, "y": 0.07, "z": 0 },
      "to": { "x": 0.01, "y": 0.07, "z": 0 },
      "duration": 2.0
    }
  ],
  "camera": {
    "position": { "x": 0.2, "y": 0.1, "z": 0.3 },
    "lookAt": { "x": 0, "y": 0, "z": 0 }
  },
  "lighting": {
    "ambient": { "intensity": 0.5 },
    "directional": { "intensity": 0.8, "position": { "x": 1, "y": 2, "z": 3 } }
  }
};

export default function PreviewPage() {
  return (
    <div className="w-full h-screen">
      <DataDrivenScene data={exampleData} autoPlay={true} />
    </div>
  );
}

