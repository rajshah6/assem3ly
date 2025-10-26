# assembl3D 🛠️

**🚀 Copilot for Assembly**

## 🎯 What It Does

1. Search for any furniture (e.g., "Billy Bookcase")
2. Scrape IKEA manuals using Bright Data
3. Process PDFs with Google Gemini AI
4. Display interactive 3D assembly instructions

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- [Bright Data API key](https://brightdata.com)
- [Google Gemini API key](https://ai.google.dev)

### Backend Setup
```bash
cd backend
cp .env.example .env
# Edit .env and add your API keys
npm install
npm run dev
```

Backend will run on: **http://localhost:3001**

### Frontend Setup
```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Frontend will run on: **http://localhost:3000**

## 📁 Project Structure

```
assem3ly/
├── backend/
│   ├── src/
│   │   ├── api/              # API routes and endpoints
│   │   ├── gemini/           # AI processing with Google Gemini
│   │   │   ├── pdf-parser.ts      # PDF to image conversion
│   │   │   ├── processor.ts       # Main processing logic
│   │   │   ├── prompt-builder.ts  # AI prompt generation
│   │   │   ├── scene-generator.ts # 3D scene data generation
│   │   │   └── types.ts           # TypeScript definitions
│   │   ├── parser_docs/      # Documentation for PDF processing
│   │   ├── public/           # Static assets and sample PDFs
│   │   └── index.ts          # Express server entry point
│   ├── brightdata/           # Web scraping utilities
│   │   ├── scraper.ts              # Main scraping logic
│   │   ├── scrape-top-products.ts  # Product data scraping
│   │   ├── generate-top-50.ts      # Top products generator
│   │   ├── download-product-images.ts
│   │   ├── update-frontend-data.ts
│   │   └── types.ts
│   ├── data/                 # Cached data and downloaded assets
│   │   ├── images/           # Product images
│   │   └── top-50-products.json
│   ├── models/               # 3D model files (.glb)
│   ├── output/               # Processed assembly steps
│   └── package.json
├── frontend/
│   ├── app/
│   │   ├── assembly/         # Assembly instruction pages
│   │   ├── assembly-preview/ # Preview functionality
│   │   ├── preview/          # Additional preview pages
│   │   ├── api/              # API routes
│   │   └── page.tsx          # Landing page
│   ├── components/
│   │   ├── assembly/         # Assembly-related components
│   │   │   ├── AssemblyPageClient.tsx
│   │   │   ├── PartsList.tsx
│   │   │   ├── StepList.tsx
│   │   │   ├── StepNavigation.tsx
│   │   │   └── ToolsList.tsx
│   │   ├── landing/          # Landing page components
│   │   ├── library/          # Product library components
│   │   ├── navigation/       # Navigation and tabs
│   │   ├── search/           # Search functionality
│   │   │   ├── ProductCard.tsx
│   │   │   ├── search-section.tsx
│   │   │   ├── SearchProgress.tsx
│   │   │   └── SearchResults.tsx
│   │   ├── viewer/           # 3D viewer components
│   │   └── ui/               # Reusable UI components (shadcn/ui)
│   ├── lib/
│   │   ├── api-client.ts     # Backend API client
│   │   ├── top-50-data.ts    # Product data utilities
│   │   └── utils.ts          # Helper functions
│   ├── public/
│   │   └── products/         # Product images
│   └── package.json
├── IMAGE_DOWNLOAD_GUIDE.md
├── QUICK_START.md
├── TOP_50_FEATURE_SUMMARY.md
├── USAGE_GUIDE.md
└── README.md
```

## ✨ Key Features

- **AI-Powered PDF Processing**: Automatically extracts assembly instructions from PDF manuals using Google Gemini
- **Web Scraping**: Scrapes IKEA and other furniture retailers for product manuals using Bright Data
- **3D Visualization**: Interactive 3D viewer for assembly steps using Three.js
- **Product Library**: Browse top 50 furniture products with cached data
- **Step-by-Step Instructions**: Clear, organized assembly instructions with parts lists and tools
- **Modern UI**: Built with Next.js 15, React, and Tailwind CSS

## 🛠️ Tech Stack

- **Backend**: Node.js, Express, TypeScript
- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **AI**: Google Gemini API
- **Scraping**: Bright Data (SERP API, Web Unlocker, Web Scraper)
- **3D**: Three.js

## 📦 Key Dependencies

### Backend
- `express` - Web server
- `cors` - CORS handling
- `dotenv` - Environment variables
- `@google/generative-ai` - Google Gemini AI API
- `axios` - HTTP client for web scraping
- `pdf-lib` - PDF manipulation and processing

### Frontend
- `next` - React framework (v15)
- `react` - UI library
- `tailwindcss` - Utility-first CSS framework
- `three` - 3D graphics library
- `@react-three/fiber` - React renderer for Three.js
- `@react-three/drei` - Useful helpers for react-three-fiber
- `shadcn/ui` - Reusable component library

## 🔑 Environment Variables

### Backend (.env)
```bash
GEMINI_API_KEY=your_gemini_api_key_here
BRIGHT_DATA_API_KEY=your_bright_data_key_here
PORT=3001
```

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
```

See `.env.example` files in both `backend/` and `frontend/` directories for complete configuration options.

## 📚 Documentation

- **[QUICK_START.md](./QUICK_START.md)** - Get up and running quickly
- **[USAGE_GUIDE.md](./USAGE_GUIDE.md)** - Detailed usage instructions
- **[TOP_50_FEATURE_SUMMARY.md](./TOP_50_FEATURE_SUMMARY.md)** - Product library feature overview
- **[IMAGE_DOWNLOAD_GUIDE.md](./IMAGE_DOWNLOAD_GUIDE.md)** - Guide for downloading product images
- **[backend/SETUP.md](./backend/SETUP.md)** - Backend setup instructions
- **[backend/GEOMETRY-GUIDE.md](./backend/GEOMETRY-GUIDE.md)** - 3D geometry processing guide
- **[backend/src/parser_docs/](./backend/src/parser_docs/)** - PDF processing documentation

## 🚀 How It Works

1. **Search**: User searches for a furniture product (e.g., "IKEA Billy Bookcase")
2. **Scrape**: Bright Data scrapes product pages and downloads assembly PDF manuals
3. **Process**: Google Gemini AI analyzes the PDF and extracts:
   - Assembly steps with descriptions
   - Required parts and quantities
   - Necessary tools
   - 3D positioning data
4. **Visualize**: Frontend displays interactive 3D assembly instructions with step-by-step guidance

## 🤝 Contributing

This project was built during Cal Hacks 12.0. Feel free to fork and extend it!

## 📄 License

MIT License - feel free to use this project for your own purposes.

---

**Built with ❤️ at Cal Hacks 12.0** 🏆
