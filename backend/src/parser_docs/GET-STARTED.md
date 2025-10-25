# 🚀 Get Started in 3 Minutes

## Step 1: Get Your Gemini API Key (1 minute)

1. Visit: **https://ai.google.dev/**
2. Click "Get API Key"
3. Create a new project or use existing
4. Copy your API key

**It's free!** 60 requests/minute is plenty for testing.

## Step 2: Configure (30 seconds)

```bash
cd backend

# Create .env file
echo "GEMINI_API_KEY=paste_your_key_here" > .env
echo "GEMINI_MODEL=gemini-1.5-flash" >> .env
echo "PORT=3001" >> .env
```

## Step 3: Run the Test (1 minute)

```bash
npm run test:pdf
```

**What happens:**

- Loads the IKEA PDF (`tommaryd-underframe-anthracite.pdf`)
- Extracts each page as an image
- Sends to Gemini AI for analysis
- Generates 3D JSON for each step
- Saves output to `backend/output/`

**Expected output:**

```
🧪 Testing PDF Processor

✅ Found PDF: /path/to/tommaryd-underframe-anthracite__AA-2169157-3-100.pdf

📄 Loading PDF...
📊 Total pages: 12
🖼️  Extracting page 1/12...
✅ Page 1 extracted - 245123 bytes - Hash: a3f2d8e1
🔍 Processing page 1/12
📤 Sending to Gemini...
📥 Received response
✅ Parsed step 1: Attach bracket to base

... (repeats for each page) ...

============================================================
🎉 PROCESSING COMPLETE!
============================================================
Total Pages: 12
Steps Extracted: 8

Step 1: Attach bracket to base
  Description: Connect the L-bracket to the base panel using screws
  Parts: 3
  Actions: 2

Step 2: Install crossbar
  Description: Attach the horizontal crossbar between legs
  Parts: 2
  Actions: 1

... (shows all steps) ...

💾 Saved results to: /path/to/backend/output/processed-steps.json
💾 Saved step 1 to: /path/to/backend/output/step-1.json
💾 Saved step 2 to: /path/to/backend/output/step-2.json
...

✅ Test completed successfully!
```

## Step 4: Check the Results (30 seconds)

```bash
# View all steps
cat backend/output/processed-steps.json

# View step 1 in detail
cat backend/output/step-1.json
```

**You'll see JSON like this:**

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
      "position": { "x": 0, "y": 0, "z": 0 },
      "rotation": { "x": 0, "y": 0, "z": 0 },
      "model": "/models/bracket_L.glb",
      "color": "#C0C0C0"
    }
  ],
  "assemblySequence": [ ... ],
  "camera": { ... },
  "lighting": { ... }
}
```

## 🎉 That's It!

You now have structured 3D data from the PDF!

## Next: Use It in Your App

### Option A: Use the JSON Files Directly

```typescript
// In your 3D viewer
import step1 from "./backend/output/step-1.json";

// Load into Three.js
step1.parts.forEach((part) => {
  loadModel(part.model, part.position, part.rotation, part.color);
});

// Set camera
camera.position.set(
  step1.camera.position.x,
  step1.camera.position.y,
  step1.camera.position.z
);
```

### Option B: Use the API

```bash
# Terminal 1: Start backend server
cd backend
npm run dev

# Terminal 2: Make a request
curl -X POST http://localhost:3001/api/process-pdf \
  -H "Content-Type: application/json" \
  -d '{"pdfPath": "/path/to/your-manual.pdf"}'
```

### Option C: Use Programmatically

```typescript
import { processPDF } from "./backend/src/gemini/processor";

const result = await processPDF("./manual.pdf", {
  productName: "BILLY Bookcase",
  productDimensions: { width: 0.8, height: 2.0, depth: 0.28 },
});

console.log(result.steps); // Array of AssemblyStep objects
```

## 📚 Documentation

- **QUICK-START.md** - This file (you are here!)
- **HOW-IT-WORKS.md** - Detailed explanation of the system
- **README-PDF-PROCESSOR.md** - Complete technical documentation
- **IMPLEMENTATION-SUMMARY.md** - What was built
- **example-usage.ts** - Code examples

## 🐛 Troubleshooting

### "GEMINI_API_KEY not set"

Make sure `.env` file exists in `backend/` directory with your API key

### "PDF not found"

Use absolute path: `/full/path/to/file.pdf`

### Canvas installation errors (macOS)

```bash
brew install pkg-config cairo pango libpng jpeg giflib librsvg
cd backend
npm install canvas
```

### "Rate limit exceeded"

Wait a minute and try again, or increase `GEMINI_DELAY_MS` in `.env`

## 🎯 What You Can Do Now

✅ Process any IKEA PDF into 3D data  
✅ Get structured JSON for each assembly step  
✅ Load parts into Three.js viewer  
✅ Display step-by-step instructions  
✅ Create interactive 3D assembly guides

---

**Ready? Run `npm run test:pdf` and watch the magic happen! 🚀**
