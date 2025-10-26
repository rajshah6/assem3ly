import { DataDrivenScene } from "@/components/viewer/DataDrivenScene";

// Example data from backend/example_data2.json - Step 2
const exampleData2 = {
  "stepId": 2,
  "title": "Attach Mounting Blocks",
  "description": "Attach the mounting blocks to the underside of the table top by inserting and rotating.",
  "parts": [
    {
      "id": "block_01",
      "name": "Mounting Block",
      "type": "block",
      "quantity": 4,
      "dimensions": {
        "width": 0.05,
        "depth": 0.03
      },
      "material": "plastic",
      "color": "#F0F0F0",
      "position": {
        "x": 0,
        "y": 0.02,
        "z": 0
      },
      "rotation": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "scale": {
        "x": 1,
        "y": 1,
        "z": 1
      },
      "model": "/models/generic_part.glb"
    }
  ],
  "assemblySequence": [
    {
      "action": "move" as const,
      "targetId": "block_01",
      "from": { "x": 0, "y": 0.15, "z": 0 },
      "to": { "x": 0, "y": 0.02, "z": 0 },
      "duration": 2.0
    },
    {
      "action": "rotate" as const,
      "targetId": "block_01",
      "axis": "y",
      "angle": 720,
      "duration": 2.5
    }
  ],
  "camera": {
    "position": {
      "x": 0.15,
      "y": 0.1,
      "z": 0.2
    },
    "lookAt": {
      "x": 0,
      "y": 0.02,
      "z": 0
    }
  },
  "lighting": {
    "ambient": {
      "intensity": 0.5
    },
    "directional": {
      "intensity": 0.8,
      "position": {
        "x": 1,
        "y": 2,
        "z": 3
      }
    }
  }
};

export default function Preview2Page() {
  return (
    <div className="w-full h-screen">
      <DataDrivenScene data={exampleData2} autoPlay={true} />
    </div>
  );
}

