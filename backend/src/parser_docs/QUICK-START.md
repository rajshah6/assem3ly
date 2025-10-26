# Quick Start: Process Your IKEA PDF

## ⚡ Fastest Way to Test

1. **Set up your API key:**

```bash
cd backend
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
```

2. **Run the test:**

```bash
npm run test:pdf
```

This processes the included IKEA manual and saves output to `backend/output/`

## 📝 Expected Output

```
🧪 Testing PDF Processor

✅ Found PDF: /path/to/tommaryd-underframe-anthracite__AA-2169157-3-100.pdf

📄 Loading PDF: ...
📊 Total pages: 12
🖼️  Extracting page 1/12...
✅ Page 1 extracted - 245123 bytes - Hash: a3f2d8e1
🔍 Processing page 1/12
📤 Sending to Gemini...
📥 Received response
✅ Parsed step 1: Attach bracket to base
...

============================================================
🎉 PROCESSING COMPLETE!
============================================================
Total Pages: 12
Steps Extracted: 8

Step 1: Attach bracket to base
  Description: Connect the L-bracket to the base panel using screws
  Parts: 3
  Actions: 2

💾 Saved results to: /path/to/backend/output/processed-steps.json
💾 Saved step 1 to: /path/to/backend/output/step-1.json
...
```

## 🔍 Check Your Results

```bash
# View all steps
cat backend/output/processed-steps.json

# View a specific step
cat backend/output/step-1.json
```

## 🎨 Use the JSON in Your App

```typescript
// In your frontend or 3D viewer
import step1 from "./backend/output/step-1.json";

// The JSON has everything you need:
console.log(step1.title); // "Attach bracket to base"
console.log(step1.parts); // Array of 3D parts with positions
console.log(step1.assemblySequence); // Animation steps
console.log(step1.camera); // Camera position for 3D view
```

## 🚀 Process Your Own PDF

```typescript
import { processPDF } from "./src/gemini/processor";

const result = await processPDF("./path/to/your-manual.pdf", {
  productName: "BILLY Bookcase",
  productDimensions: {
    width: 0.8,
    height: 2.02,
    depth: 0.28,
  },
});

console.log(result.steps); // Array of AssemblyStep objects
```

## 🌐 Use the API

Start the server:

```bash
npm run dev
```

Make a request:

```bash
curl -X POST http://localhost:3001/api/process-pdf \
  -H "Content-Type: application/json" \
  -d '{
    "pdfPath": "/absolute/path/to/manual.pdf",
    "metadata": {
      "productName": "MALM Dresser",
      "productDimensions": { "width": 0.8, "height": 1.0, "depth": 0.48 }
    }
  }'
```

## 🐛 Troubleshooting

### No API key error

```bash
# Make sure .env exists and has:
GEMINI_API_KEY=your_actual_key_here
```

### PDF not found

```bash
# Use absolute path or path relative to backend/ directory
ls backend/src/public/*.pdf  # Should show your PDF
```

### Canvas installation issues (macOS)

```bash
brew install pkg-config cairo pango libpng jpeg giflib librsvg
npm install canvas
```

## 📚 Full Documentation

See `README-PDF-PROCESSOR.md` for complete details.
