# assem3ly 🛠️

**AI-powered assembly manual finder with 3D visualization**

Built for the Cal Hacks 🏆

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
├── backend/              # Express API
│   ├── src/
│   │   ├── api/         # API routes
│   │   ├── gemini/      # Person 3: AI processing
│   │   └── index.ts     # Server entry point
│   ├── brightdata/      # Person 1: Web scraping
│   └── data/            # Downloaded PDFs and cache
├── frontend/            # Next.js 15 + Tailwind CSS
│   ├── app/            # Pages and routing
│   └── components/     # React components
```

## 👥 Team Structure

### Person 1: Bright Data Scraping
- **Directory**: `backend/brightdata/`
- **Tasks**:
  - Implement SERP API search
  - Scrape IKEA product pages
  - Download PDFs using Web Unlocker

### Person 2: Frontend UI
- **Directory**: `frontend/components/`
- **Tasks**:
  - Build search interface
  - Create assembly step viewer
  - Handle loading/error states

### Person 3: AI Processing
- **Directory**: `backend/src/gemini/`
- **Tasks**:
  - Convert PDFs to images
  - Process with Gemini API
  - Extract step-by-step instructions

### Person 4: 3D Viewer
- **Directory**: `frontend/components/viewer/`
- **Tasks**:
  - Set up Three.js scene
  - Render 3D assembly parts
  - Add camera controls and interactions

## 🔀 Git Workflow

Each person should create their own feature branch:

```bash
git checkout -b feature/brightdata-scraping  # Person 1
git checkout -b feature/frontend-ui          # Person 2
git checkout -b feature/gemini-ai            # Person 3
git checkout -b feature/3d-viewer            # Person 4
```

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
- `@google/generative-ai` - Gemini API (Person 3)
- `axios` - HTTP requests (Person 1)

### Frontend
- `next` - React framework
- `react` - UI library
- `tailwindcss` - Styling
- `three` - 3D rendering (Person 4)

## 🔑 Environment Variables

See `.env.example` files in both `backend/` and `frontend/` directories.

## 📚 Documentation

Check the `.cursor/rules/` directory for detailed implementation guidelines for each team member.

---

**Let's build something amazing in 24 hours!** 🚀
