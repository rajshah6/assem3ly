# How the PDF Processing System Works

## 🎯 Overview

This system takes an IKEA assembly manual PDF and converts it into structured 3D assembly data using AI vision. Here's exactly what happens when you process a PDF.

## 🔄 Step-by-Step Process

### Step 1: Load PDF

```
Input: tommaryd-underframe-anthracite.pdf
       ↓
pdf-parser.ts loads the PDF using pdf-lib
       ↓
Detects: 12 pages total
```

### Step 2: Extract Page Images

```
For each page (1 to 12):
  ├─ Render page at 2x scale (high quality)
  ├─ Convert to PNG image
  ├─ Optimize with sharp (compression)
  ├─ Generate unique MD5 hash
  └─ Result: Page object with image buffer

Output: Array of 12 unique page images
```

### Step 3: Build AI Prompt

```
For page 3:
  prompt-builder.ts generates:

  "You are analyzing an IKEA assembly manual for: TOMMARYD Underframe
   Product Dimensions: 1.30m × 0.70m × 0.70m
   Current Page: 3/12

   Extract assembly step and return JSON with:
   - stepNumber
   - title
   - description
   - partsUsed (name, type, quantity, dimensions, material)
   - tools
   - actions (what moves, rotates, attaches)

   Return ONLY valid JSON."
```

### Step 4: Send to Gemini AI

```
processor.ts sends:
  ├─ Prompt (text)
  ├─ Page image (base64 PNG)
  └─ Model: gemini-1.5-flash

Gemini AI analyzes the image and returns:

{
  "stepNumber": 3,
  "title": "Attach leg brackets to base",
  "description": "Connect L-brackets to the base panel using 4 screws",
  "partsUsed": [
    {
      "name": "L-Bracket",
      "type": "bracket_l",
      "quantity": 2,
      "estimatedDimensions": "0.12m x 0.05m",
      "material": "metal"
    },
    {
      "name": "Screw M6x20",
      "type": "screw_flathead",
      "quantity": 4,
      "estimatedDimensions": "0.02m",
      "material": "metal"
    }
  ],
  "tools": ["Phillips screwdriver"],
  "actions": [
    {
      "action": "move",
      "description": "Position bracket on base",
      "targetPart": "L-Bracket"
    },
    {
      "action": "rotate",
      "description": "Tighten screws",
      "targetPart": "Screw"
    }
  ]
}
```

### Step 5: Generate 3D Scene

```
scene-generator.ts processes AI response:

For each part in partsUsed:
  ├─ Parse dimensions → { width: 0.12, height: 0.05, depth: 0.02 }
  ├─ Assign color based on material → metal: "#C0C0C0"
  ├─ Map to 3D model → "/models/bracket_L.glb"
  ├─ Generate position → { x: 0, y: 0, z: 0 }
  ├─ Generate rotation → { x: 0, y: 0, z: 0 }
  └─ Generate scale → { x: 1, y: 1, z: 1 }

For each action:
  ├─ Map "move" → AssemblyAction with from/to positions
  ├─ Map "rotate" → AssemblyAction with axis/angle
  └─ Set duration → 2.0 seconds

Generate camera:
  ├─ Calculate center of all parts
  ├─ Position camera at optimal angle
  └─ Set lookAt to center

Generate lighting:
  ├─ Ambient light: 0.5 intensity
  └─ Directional light: 0.8 intensity from (1, 2, 3)
```

### Step 6: Build Complete Step Object

```
Final output for Step 3:

{
  "stepId": 3,
  "title": "Attach leg brackets to base",
  "description": "Connect L-brackets to the base panel using 4 screws",
  "parts": [
    {
      "id": "bracket_l_01",
      "name": "L-Bracket",
      "type": "bracket_l",
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
      "id": "screw_flathead_01",
      "name": "Screw M6x20",
      "type": "screw_flathead",
      "quantity": 4,
      "dimensions": { "length": 0.02, "radius": 0.004 },
      "material": "metal",
      "color": "#777777",
      "position": { "x": 0.03, "y": 0.02, "z": 0 },
      "rotation": { "x": 0, "y": 0, "z": 0 },
      "scale": { "x": 1, "y": 1, "z": 1 },
      "model": "/models/screw.glb"
    }
  ],
  "assemblySequence": [
    {
      "action": "move",
      "targetId": "bracket_l_01",
      "from": { "x": 0.1, "y": 0.1, "z": 0 },
      "to": { "x": 0, "y": 0, "z": 0 },
      "duration": 2.0
    },
    {
      "action": "rotate",
      "targetId": "screw_flathead_01",
      "axis": "y",
      "angle": 720,
      "duration": 2.5
    }
  ],
  "camera": {
    "position": { "x": 0.3, "y": 0.2, "z": 0.4 },
    "lookAt": { "x": 0, "y": 0, "z": 0 }
  },
  "lighting": {
    "ambient": { "intensity": 0.5 },
    "directional": {
      "intensity": 0.8,
      "position": { "x": 1, "y": 2, "z": 3 }
    }
  }
}
```

### Step 7: Repeat for All Pages

```
Pages 1-12 processed sequentially:
  Page 1 → Skip (parts list)
  Page 2 → Step 1: Unpack components
  Page 3 → Step 2: Attach leg brackets
  Page 4 → Step 3: Install crossbar
  ...
  Page 12 → Step 8: Final assembly

Rate limiting: 500ms delay between requests
Total time: ~60-120 seconds
```

### Step 8: Save Output

```
Output files:
├─ processed-steps.json (all steps)
├─ step-1.json
├─ step-2.json
├─ step-3.json
└─ ...
```

## 🧠 How AI Understanding Works

### What Gemini "Sees"

When you send a page image, Gemini analyzes:

- **Arrows** → Indicates movement/direction
- **Circled numbers** → Step sequence
- **Parts diagrams** → Identifies screws, brackets, panels
- **Hand illustrations** → Tools required
- **Dotted lines** → Assembly connections
- **Measurement indicators** → Approximate sizes

### What Gemini Extracts

From visual analysis, it generates:

1. **Step number** - From numbered circles/labels
2. **Action description** - From arrows and part positions
3. **Parts list** - From identifying hardware in diagram
4. **Tool requirements** - From hand/tool illustrations
5. **Assembly sequence** - From arrow directions and order

### Example Analysis

```
Image shows:
  ├─ Circle with "3" → stepNumber: 3
  ├─ L-shaped metal pieces → "L-Bracket"
  ├─ Small cylinders with cross tops → "Phillips screw"
  ├─ Arrow pointing bracket to panel → "Attach bracket to base"
  ├─ Hand holding screwdriver → "Phillips screwdriver" required
  └─ Curved arrows on screws → "Rotate to tighten"
```

## 🎨 3D Scene Generation Logic

### Part Positioning

```
Default strategy: Grid layout
Part 1: (0, 0, 0)
Part 2: (0.15, 0, 0)
Part 3: (0.30, 0, 0)
...

Future enhancement: Parse actual positions from diagram
```

### Color Assignment

```
Material-based colors:
metal       → Silver #C0C0C0
steel       → Light gray #B8B8B8
wood        → Tan #D2B48C
plastic     → White #F0F0F0
screw       → Dark gray #777777 (special case)
```

### Model Mapping

```
Part type → GLB file:
screw          → /models/screw.glb
bracket_l      → /models/bracket_L.glb
dowel_wood     → /models/dowel_wood.glb
panel          → /models/panel.glb
cam_lock       → /models/cam_lock.glb
(generic)      → /models/generic_part.glb
```

### Camera Calculation

```
1. Calculate center of all parts:
   center.x = average of all part.position.x
   center.y = average of all part.position.y
   center.z = average of all part.position.z

2. Position camera at 45° angle:
   camera.x = center.x + 0.3
   camera.y = center.y + 0.2
   camera.z = center.z + 0.4

3. Point camera at center:
   camera.lookAt(center)
```

## ⚡ Performance & Optimization

### Rate Limiting

```
Gemini free tier: 60 requests/minute
Our delay: 500ms between requests
Max throughput: 2 pages/second
12-page PDF: ~6 seconds minimum (+ processing time)
```

### Caching (Future)

```
Store MD5 hash of each page image
Before processing:
  ├─ Calculate hash
  ├─ Check if already processed
  ├─ If cached → return cached result
  └─ If new → process with Gemini
```

### Error Handling

```
For each page:
  try {
    process page
  } catch (error) {
    if (rate limit) → wait 5s and retry
    if (parse error) → skip page and continue
    if (API error) → log and continue
  }

Result: System continues even if some pages fail
```

## 🔍 Debugging Features

### Logging

```
📄 Loading PDF: /path/to/file.pdf
📊 Total pages: 12
🖼️  Extracting page 3/12...
✅ Page 3 extracted - 245123 bytes - Hash: a3f2d8e1
🔍 Processing page 3/12
📤 Sending to Gemini... (prompt length: 850 chars)
📥 Received response (432 chars)
✅ Parsed step 3: Attach leg brackets to base
⏳ Waiting 500ms before next request...
```

### Image Hash

```
Each page gets MD5 hash of image buffer
Ensures uniqueness:
  Page 1 hash: a3f2d8e1...
  Page 2 hash: 7c5d9f2a...
  Page 3 hash: e4b1c8d7...

If hashes are same → ERROR (duplicate processing bug)
```

## 🎯 Key Design Decisions

### Why Gemini Vision?

- ✅ Can understand complex diagrams
- ✅ No manual part database needed
- ✅ Adapts to different IKEA manual styles
- ✅ Free tier with good limits

### Why JSON Output?

- ✅ Easy to parse
- ✅ Type-safe with TypeScript
- ✅ Ready for Three.js
- ✅ Human-readable for debugging

### Why Page-by-Page?

- ✅ Better prompt focus
- ✅ Easier error handling
- ✅ Progress tracking
- ✅ Parallel processing possible (future)

## 🚀 Future Enhancements

1. **Actual Position Parsing**

   - Use AI to extract real positions from diagrams
   - Calculate relative positions between parts

2. **Tool Recognition**

   - Identify tools from illustrations
   - Generate tool requirement list

3. **Animation Timing**

   - Optimize animation durations
   - Coordinate multi-part movements

4. **Part Database**

   - Build library of known IKEA parts
   - Faster processing with cached data

5. **Parallel Processing**
   - Process multiple pages simultaneously
   - Respect rate limits with queue

---

**This system transforms static PDFs into interactive 3D data, making IKEA assembly manuals accessible, searchable, and much easier to follow!**
