# Geometric Primitives Guide for React Three Fiber

## 🎨 Overview

The JSON now contains **geometric primitive descriptions** instead of GLB file references. Each part has a `geometry` object that describes how to create it using React Three Fiber's built-in geometries.

## 📦 Geometry Types

### 1. **Box** (Rectangular)

Used for: Panels, boards, shelves, brackets, blocks, tabletops

```json
{
  "geometry": {
    "type": "box",
    "args": [0.5, 0.02, 0.3] // [width, height, depth]
  }
}
```

**React Three Fiber:**

```tsx
<mesh position={[x, y, z]} rotation={[rx, ry, rz]}>
  <boxGeometry args={[0.5, 0.02, 0.3]} />
  <meshStandardMaterial color="#D2B48C" />
</mesh>
```

### 2. **Cylinder** (Round)

Used for: Screws, bolts, dowels, pins, legs

```json
{
  "geometry": {
    "type": "cylinder",
    "args": [0.004, 0.004, 0.04, 16] // [radiusTop, radiusBottom, height, segments]
  }
}
```

**React Three Fiber:**

```tsx
<mesh position={[x, y, z]} rotation={[rx, ry, rz]}>
  <cylinderGeometry args={[0.004, 0.004, 0.04, 16]} />
  <meshStandardMaterial color="#777777" />
</mesh>
```

### 3. **Torus** (Ring/Washer)

Used for: Washers, rings, O-rings

```json
{
  "geometry": {
    "type": "torus",
    "args": [0.01, 0.002, 16, 32] // [radius, tube, radialSegments, tubularSegments]
  }
}
```

**React Three Fiber:**

```tsx
<mesh position={[x, y, z]} rotation={[rx, ry, rz]}>
  <torusGeometry args={[0.01, 0.002, 16, 32]} />
  <meshStandardMaterial color="#AAAAAA" />
</mesh>
```

### 4. **Sphere** (Round ball)

Used for: Knobs, balls, spherical parts

```json
{
  "geometry": {
    "type": "sphere",
    "args": [0.015, 32, 32] // [radius, widthSegments, heightSegments]
  }
}
```

**React Three Fiber:**

```tsx
<mesh position={[x, y, z]} rotation={[rx, ry, rz]}>
  <sphereGeometry args={[0.015, 32, 32]} />
  <meshStandardMaterial color="#C0C0C0" />
</mesh>
```

### 5. **Cone** (Tapered)

Used for: Conical parts, feet

```json
{
  "geometry": {
    "type": "cone",
    "args": [0.02, 0.05, 16] // [radius, height, segments]
  }
}
```

**React Three Fiber:**

```tsx
<mesh position={[x, y, z]} rotation={[rx, ry, rz]}>
  <coneGeometry args={[0.02, 0.05, 16]} />
  <meshStandardMaterial color="#444444" />
</mesh>
```

## 🔧 Complete React Three Fiber Component

```tsx
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import assemblyStep from "./backend/output/step-1.json";

function AssemblyPart({ part }) {
  const { geometry, position, rotation, color } = part;

  // Map geometry type to React Three Fiber component
  const renderGeometry = () => {
    switch (geometry.type) {
      case "box":
        return <boxGeometry args={geometry.args} />;
      case "cylinder":
        return <cylinderGeometry args={geometry.args} />;
      case "torus":
        return <torusGeometry args={geometry.args} />;
      case "sphere":
        return <sphereGeometry args={geometry.args} />;
      case "cone":
        return <coneGeometry args={geometry.args} />;
      default:
        return <boxGeometry args={[0.05, 0.05, 0.05]} />;
    }
  };

  return (
    <mesh
      position={[position.x, position.y, position.z]}
      rotation={[rotation.x, rotation.y, rotation.z]}
    >
      {renderGeometry()}
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

function AssemblyViewer() {
  return (
    <Canvas camera={{ position: [0.3, 0.2, 0.4] }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[1, 2, 3]} intensity={0.8} />

      {assemblyStep.parts.map((part) => (
        <AssemblyPart key={part.id} part={part} />
      ))}

      <OrbitControls />
    </Canvas>
  );
}

export default AssemblyViewer;
```

## 🎯 Mapping Logic

The system automatically maps part types to geometries:

| Part Type                 | Geometry   | Args Pattern                      |
| ------------------------- | ---------- | --------------------------------- |
| `screw`, `bolt`           | `cylinder` | `[radius, radius, length, 16]`    |
| `washer`, `ring`          | `torus`    | `[radius, thickness, 16, 32]`     |
| `dowel`, `pin`            | `cylinder` | `[radius, radius, length, 16]`    |
| `bracket`                 | `box`      | `[width, height, depth]`          |
| `panel`, `board`, `shelf` | `box`      | `[width, thickness, depth]`       |
| `block`, `cube`           | `box`      | `[size, size, size]`              |
| `leg`                     | `cylinder` | `[radius, radius, height, 16]`    |
| `knob`, `ball`            | `sphere`   | `[radius, 32, 32]`                |
| `cam_lock`                | `cylinder` | `[radius, radius, thickness, 16]` |
| **default**               | `box`      | `[width, height, depth]`          |

## 📏 Dimensions

All dimensions are in **meters**:

- Screw: `0.004m radius × 0.04m length` (4mm × 40mm)
- Washer: `0.01m radius × 0.002m thickness` (10mm × 2mm)
- Bracket: `0.12m × 0.05m × 0.02m` (120mm × 50mm × 20mm)
- Panel: `0.5m × 0.02m × 0.3m` (500mm × 20mm × 300mm)

## 🎨 Materials & Colors

Parts automatically get appropriate colors:

- **Metal parts**: Silver `#C0C0C0`
- **Screws**: Dark gray `#777777`
- **Washers**: Light gray `#AAAAAA`
- **Wood parts**: Tan `#D2B48C`
- **Plastic parts**: White `#F0F0F0`

## 📊 Example JSON Structure

```json
{
  "stepId": 1,
  "title": "Attach screws to bracket",
  "parts": [
    {
      "id": "bracket_01",
      "name": "L Bracket",
      "type": "bracket",
      "quantity": 2,
      "dimensions": { "width": 0.12, "height": 0.05, "depth": 0.02 },
      "material": "metal",
      "color": "#C0C0C0",
      "position": { "x": 0, "y": 0, "z": 0 },
      "rotation": { "x": 0, "y": 0, "z": 0 },
      "scale": { "x": 1, "y": 1, "z": 1 },
      "geometry": {
        "type": "box",
        "args": [0.12, 0.05, 0.02]
      }
    },
    {
      "id": "screw_01",
      "name": "M6x40 Screw",
      "type": "screw",
      "quantity": 4,
      "dimensions": { "radius": 0.003, "length": 0.04 },
      "material": "metal",
      "color": "#777777",
      "position": { "x": 0.15, "y": 0, "z": 0 },
      "rotation": { "x": 0, "y": 0, "z": 0 },
      "scale": { "x": 1, "y": 1, "z": 1 },
      "geometry": {
        "type": "cylinder",
        "args": [0.003, 0.003, 0.04, 16]
      }
    }
  ]
}
```

## 🚀 Usage in Frontend

### 1. Import JSON

```tsx
import step1 from "./backend/output/step-1.json";
```

### 2. Render Parts

```tsx
{
  step1.parts.map((part) => <PartRenderer key={part.id} part={part} />);
}
```

### 3. Apply Animations

```tsx
// Use assemblySequence for animations
step1.assemblySequence.map((action) => {
  if (action.action === "move") {
    // Animate from action.from to action.to over action.duration
  }
  if (action.action === "rotate") {
    // Rotate around action.axis by action.angle
  }
});
```

## 🎬 Animation Example

```tsx
import { useSpring, animated } from "@react-spring/three";

function AnimatedPart({ part, action }) {
  const { position } = useSpring({
    from: { position: [action.from.x, action.from.y, action.from.z] },
    to: { position: [action.to.x, action.to.y, action.to.z] },
    config: { duration: action.duration * 1000 },
  });

  return (
    <animated.mesh position={position}>{/* geometry here */}</animated.mesh>
  );
}
```

---

**All parts are now described as geometric primitives - no external models needed!** 🎉
