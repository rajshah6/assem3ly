# IKEA PDF Assembly Manual Processor

This system processes IKEA assembly manual PDFs and converts them into structured JSON data that can be used to generate interactive 3D assembly guides.

## 🎯 What It Does

1. **Extracts PDF Pages** - Converts each page of the manual to high-quality images
2. **AI Analysis** - Uses Google Gemini Vision API to analyze each assembly step
3. **Generates 3D Data** - Creates structured JSON with parts, positions, actions, camera, and lighting
4. **Output Format** - Produces JSON matching the `example_data.json` schema

## 📦 Installation

```bash
cd backend
npm install
```

**Required packages** (already in package.json):

- `@google/generative-ai` - Gemini AI SDK
- `pdf-lib` - PDF manipulation
- `pdfjs-dist` - PDF rendering
- `canvas` - Image processing
- `sharp` - Image optimization

## 🔑 Setup API Key

1. Get your Gemini API key from https://ai.google.dev/
2. Create `backend/.env`:

```bash
PORT=3001
GEMINI_API_KEY=your_api_key_here
GEMINI_MODEL=gemini-1.5-flash
GEMINI_DELAY_MS=500
```

## 🚀 Usage

### Method 1: Test Script (Recommended)

Process the included IKEA PDF directly:

```bash
cd backend
npm run test:pdf
```

This will:

- Process `backend/src/public/tommaryd-underframe-anthracite__AA-2169157-3-100.pdf`
- Extract all assembly steps
- Save results to `backend/output/processed-steps.json`
- Save individual steps as `backend/output/step-1.json`, `step-2.json`, etc.

### Method 2: API Endpoint

Start the backend server:

```bash
cd backend
npm run dev
```

**Process entire PDF:**

```bash
POST http://localhost:3001/api/process-pdf

{
  "pdfPath": "/path/to/your/manual.pdf",
  "metadata": {
    "productName": "BILLY Bookcase",
    "category": "Furniture",
    "productDimensions": {
      "width": 0.80,
      "height": 2.02,
      "depth": 0.28
    }
  }
}
```

**Process single page (for testing):**

```bash
POST http://localhost:3001/api/process-pdf/page

{
  "pdfPath": "/path/to/your/manual.pdf",
  "pageNumber": 3,
  "metadata": { ... }
}
```

### Method 3: Programmatic Usage

```typescript
import { processPDF } from "./src/gemini/processor";

const result = await processPDF("./path/to/manual.pdf", {
  productName: "MALM Dresser",
  productDimensions: { width: 0.8, height: 1.0, depth: 0.48 },
});

console.log(`Extracted ${result.steps.length} steps`);
result.steps.forEach((step) => {
  console.log(`Step ${step.stepId}: ${step.title}`);
});
```

## 📊 Output Format

Each step follows this structure (matching `example_data.json`):

```json
{
  "stepId": 1,
  "title": "Attach L-bracket with screw and washer",
  "description": "Insert the screw and washer through the L-bracket...",
  "parts": [
    {
      "id": "bracket_l_01",
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
    }
  ],
  "assemblySequence": [
    {
      "action": "move",
      "targetId": "washer_01",
      "from": { "x": 0.1, "y": 0.1, "z": 0 },
      "to": { "x": 0.03, "y": 0.02, "z": 0 },
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
}
```

## 🏗️ System Architecture

```
PDF File
  ↓
pdf-parser.ts (Extract pages as images)
  ↓
processor.ts (Send to Gemini API)
  ↓
Gemini Vision API (Analyze each step)
  ↓
prompt-builder.ts (Generate context-aware prompts)
  ↓
scene-generator.ts (Convert analysis → 3D JSON)
  ↓
Output: AssemblyStep[]
```

## 📁 File Structure

```
backend/src/gemini/
├── types.ts              # TypeScript interfaces
├── pdf-parser.ts         # PDF → Image conversion
├── prompt-builder.ts     # Gemini prompt generation
├── scene-generator.ts    # 3D scene JSON generation
└── processor.ts          # Main orchestrator

backend/src/api/
└── pdf-processor.route.ts # API endpoints

backend/src/
└── test-processor.ts     # Test script
```

## 🎨 Part Type Mapping

The system recognizes common IKEA parts and assigns appropriate models:

| Part Type    | 3D Model                 | Color     |
| ------------ | ------------------------ | --------- |
| `screw`      | `/models/screw.glb`      | `#777777` |
| `washer`     | `/models/washer.glb`     | `#AAAAAA` |
| `bracket_l`  | `/models/bracket_L.glb`  | `#C0C0C0` |
| `dowel_wood` | `/models/dowel_wood.glb` | `#D2B48C` |
| `cam_lock`   | `/models/cam_lock.glb`   | `#C0C0C0` |
| `panel`      | `/models/panel.glb`      | `#D2B48C` |

## 🔧 Configuration

Environment variables in `.env`:

```bash
# Gemini API
GEMINI_API_KEY=your_key
GEMINI_MODEL=gemini-1.5-flash  # or gemini-1.5-pro
GEMINI_DELAY_MS=500            # Delay between API calls

# Server
PORT=3001
```

## 🐛 Debugging

The processor includes extensive logging:

```
📄 Loading PDF: /path/to/manual.pdf
📊 Total pages: 12
🖼️  Extracting page 1/12...
✅ Page 1 extracted - 245123 bytes - Hash: a3f2d8e1
📤 Sending to Gemini... (prompt length: 850 chars)
📥 Received response (432 chars)
✅ Parsed step 1: Attach legs to tabletop
```

Each page gets a unique hash to ensure no duplicates are processed.

## ⚡ Performance

- **Processing time**: ~5-10 seconds per page
- **Rate limits**: 60 requests/minute (Gemini free tier)
- **Automatic rate limiting**: 500ms delay between requests
- **Retry logic**: Automatic retry on rate limit errors

## 🚨 Common Issues

### "GEMINI_API_KEY not set"

Create `backend/.env` with your API key

### "PDF not found"

Use absolute paths or paths relative to `backend/` directory

### "Rate limit exceeded"

The system handles this automatically. Increase `GEMINI_DELAY_MS` if needed.

### PDF rendering errors

Ensure `canvas` is properly installed. On macOS:

```bash
brew install pkg-config cairo pango libpng jpeg giflib librsvg
npm install canvas
```

## 🎯 Next Steps

After processing a PDF, the JSON output can be used by:

1. **Person 4 (3D Rendering)** - Load into Three.js viewer
2. **Person 2 (Frontend)** - Display in assembly UI
3. **Database** - Store for future retrieval

## 📝 Example Output

See `backend/output/processed-steps.json` after running `npm run test:pdf`
