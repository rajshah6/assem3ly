# assembl3D

Transform IKEA assembly manuals into interactive 3D guides using AI and web scraping.

## What it does

Search for any IKEA product or paste a URL, and get an interactive 3D assembly guide. The app scrapes assembly manuals from IKEA, processes them with Google Gemini AI, and renders step-by-step instructions in 3D using React Three Fiber.

We've also pre-loaded the 50 most popular IKEA products for instant access.

## Features

- **Search or URL input** - Find products by name or paste any IKEA product URL
- **Pre-loaded library** - Browse 50 popular IKEA products with instant access
- **AI processing** - Gemini Vision automatically extracts assembly steps from PDFs
- **Interactive 3D viewer** - Navigate assembly instructions with React Three Fiber
- **Web scraping** - Bright Data handles reliable product data and manual fetching

## Quick Start

### Prerequisites
- Node.js 18+
- [Bright Data API key](https://brightdata.com)
- [Google Gemini API key](https://ai.google.dev)

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Add your API keys to .env
npm run dev
```

Runs on `http://localhost:3001`

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
# Add NEXT_PUBLIC_API_URL=http://localhost:3001
npm run dev
```

Runs on `http://localhost:3000`

## Tech Stack

**Frontend**
- Next.js 15 with TypeScript
- React Three Fiber for 3D rendering
- Tailwind CSS + Shadcn/ui
- @react-three/drei for 3D helpers

**Backend**
- Node.js + Express + TypeScript
- Google Gemini API for vision processing
- Bright Data for web scraping (SERP API, Web Unlocker, Web Scraper)
- Automated PDF to image conversion

## How it works

1. User searches for a product, pastes an IKEA URL, or browses the library
2. Bright Data scrapes the product page and downloads the assembly manual PDF
3. Gemini AI analyzes each page and extracts assembly steps, parts, and tools
4. Frontend renders the instructions in an interactive 3D environment

## Project Structure

```
assembl3D/
├── backend/
│   ├── src/
│   │   ├── api/          # REST endpoints
│   │   └── gemini/       # AI processing
│   ├── brightdata/       # Web scraping
│   └── data/             # Cached PDFs and images
└── frontend/
    ├── app/              # Next.js pages
    ├── components/
    │   ├── search/       # Search UI
    │   ├── assembly/     # Step navigation
    │   ├── viewer/       # 3D viewer (React Three Fiber)
    │   └── library/      # Product library
    └── lib/              # Utilities
```

## Environment Variables

**backend/.env**
```bash
BRIGHTDATA_API_KEY=your_key
GEMINI_API_KEY=your_key
PORT=3001
```

**frontend/.env.local**
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## License

MIT
