# assembl3D - DevPost Submission

## Inspiration 💡

We've all been there - sitting on the floor surrounded by hundreds of screws, mysterious wooden dowels, and an incomprehensible IKEA manual that looks like it was designed by aliens. Assembly manuals are notoriously difficult to follow: tiny diagrams, confusing arrows, and no way to see what the final step should actually look like in 3D space.

We wanted to transform this frustrating experience into something intuitive and interactive. What if you could search for any furniture product, automatically get its assembly manual, and see each step visualized in an interactive 3D environment? That's the vision behind **assembl3D** - your AI-powered copilot for furniture assembly.

The inspiration came from watching a teammate struggle for 2 hours assembling a simple bookshelf, constantly flipping back and forth between pages, trying to figure out which screw goes where. We thought: "There has to be a better way." And with modern AI and web scraping technology, there is.

## What it does 🎯

**assembl3D** is an end-to-end platform that makes furniture assembly effortless:

1. **Search**: Enter any furniture product name (e.g., "IKEA Billy Bookcase")
2. **Scrape**: Our system uses Bright Data's powerful APIs to:
   - Search Google for the product using SERP API
   - Scrape product pages to find assembly manuals
   - Download PDF manuals using Web Unlocker
   - Collect product images from Google Images
3. **Process**: Google Gemini AI analyzes each page of the PDF manual and extracts:
   - Step-by-step assembly instructions
   - Required parts with quantities and dimensions
   - Necessary tools (screwdrivers, hammers, etc.)
   - 3D positioning data for each component
   - Assembly actions (move, rotate, attach)
4. **Visualize**: Interactive 3D viewer displays each assembly step with:
   - Real-time 3D rendering using Three.js
   - Step-by-step navigation
   - Parts list with visual indicators
   - Tools required for each step
   - Smooth animations showing how parts fit together

**Bonus Feature**: Browse a curated library of the top 50 most popular IKEA products, complete with real product images and categories.

## How we built it 🛠️

### Tech Stack

**Frontend:**
- **Next.js 15** - React framework with App Router for modern routing
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling for rapid UI development
- **shadcn/ui** - Beautiful, accessible component library
- **Three.js** - 3D graphics rendering
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers and controls for 3D scenes

**Backend:**
- **Node.js + Express** - RESTful API server
- **TypeScript** - Type-safe backend development
- **Google Gemini AI (gemini-1.5-flash)** - Vision AI for PDF analysis
- **Bright Data APIs**:
  - **SERP API** - Google search results scraping
  - **Web Unlocker** - PDF downloading from protected sites
  - **Web Scraper** - Product page data extraction
- **pdf-lib** - PDF manipulation and page extraction
- **sharp** - High-performance image processing

### Architecture

```
User Search
    ↓
Bright Data SERP API → Find product pages
    ↓
Bright Data Web Scraper → Extract manual URLs
    ↓
Bright Data Web Unlocker → Download PDFs
    ↓
PDF Parser → Extract pages as images
    ↓
Google Gemini AI → Analyze each page
    ↓
Scene Generator → Create 3D geometry data
    ↓
Express API → Serve structured JSON
    ↓
Next.js Frontend → Render interactive 3D
    ↓
Three.js → Display assembly steps
```

### Key Implementation Details

**1. PDF Processing Pipeline:**
- Load PDF using `pdf-lib`
- Extract each page as high-resolution PNG (2x scale)
- Optimize images with `sharp` for faster processing
- Generate MD5 hashes to prevent duplicate processing

**2. AI Vision Analysis:**
- Built custom prompts that guide Gemini to extract structured data
- Send page image + context (product name, dimensions, page number)
- Parse AI response into TypeScript-safe JSON
- Extract parts, tools, actions, and assembly sequences

**3. 3D Scene Generation:**
- Map part types to geometric primitives (box, cylinder, sphere, torus, cone)
- Calculate dimensions from AI-extracted measurements
- Assign material-based colors (metal: silver, wood: tan, plastic: white)
- Generate camera positions for optimal viewing angles
- Create assembly animations with move/rotate actions

**4. Web Scraping Strategy:**
- Use SERP API to search "product name + IKEA + assembly manual"
- Extract top results and filter for IKEA domains
- Scrape product pages for PDF links
- Use Web Unlocker to bypass anti-bot protections
- Download and cache PDFs locally
- Scrape product images from Google Images for library

**5. Frontend 3D Viewer:**
- React Three Fiber for declarative 3D rendering
- Orbit controls for user interaction
- Dynamic geometry generation from JSON data
- Step navigation with smooth transitions
- Responsive design that works on all devices

## Challenges we ran into 🚧

### 1. **PDF Page Extraction Complexity**
PDFs are notoriously difficult to parse. IKEA manuals have complex layouts with diagrams, arrows, and annotations. Initially, we tried text extraction, but assembly manuals are primarily visual. We pivoted to converting each page to an image and using AI vision, which worked much better.

### 2. **AI Prompt Engineering**
Getting Gemini to consistently return structured JSON was challenging. The AI would sometimes return markdown-wrapped JSON, add explanatory text, or hallucinate data. We solved this by:
- Crafting very specific prompts with clear instructions
- Adding examples of expected output format
- Implementing robust JSON parsing with fallbacks
- Validating and sanitizing AI responses

### 3. **3D Geometry Mapping**
Initially, we planned to use pre-made 3D models (.glb files) for each part type. However, this required a massive library of models and didn't scale. We pivoted to **geometric primitives** - describing parts as boxes, cylinders, spheres, etc. This was more flexible and allowed us to render any part type on the fly.

### 4. **Rate Limiting & API Costs**
Both Gemini and Bright Data have rate limits and costs:
- **Gemini**: 60 requests/minute on free tier
- **Bright Data**: Pay-per-request pricing
We implemented:
- 500ms delays between Gemini requests
- Caching of processed PDFs to avoid reprocessing
- Smart scraping that only downloads new products
- Fallback to mock data during development

### 5. **Coordinate System Confusion**
Three.js uses a different coordinate system than typical 2D layouts. We had to carefully map:
- PDF diagram positions → 3D world coordinates
- Part rotations → Euler angles
- Camera positioning → optimal viewing angles
This required lots of trial and error and visual debugging.

### 6. **Bright Data Integration Learning Curve**
Learning to use Bright Data's various APIs (SERP, Web Scraper, Web Unlocker) required understanding their different use cases:
- SERP API for search results
- Web Scraper for structured data extraction
- Web Unlocker for bypassing protections
We had to experiment with different configurations to get reliable results.

### 7. **Real-time 3D Performance**
Rendering complex assemblies with many parts in real-time was initially slow. We optimized by:
- Using low-poly geometric primitives
- Implementing frustum culling
- Lazy loading assembly steps
- Optimizing material shaders

## Accomplishments that we're proud of 🏆

### 1. **End-to-End Pipeline That Actually Works**
We built a complete system from search to 3D visualization in 24 hours. Every component works together seamlessly:
- Search → Scrape → Process → Visualize
This isn't just a demo - it's a functional prototype that could be deployed.

### 2. **AI Vision Successfully Parsing Complex Diagrams**
Getting Gemini to understand IKEA assembly diagrams and extract structured data was a huge win. The AI can identify:
- Part types (screws, brackets, panels)
- Quantities and dimensions
- Assembly sequences
- Tool requirements
This opens up possibilities for processing any visual instruction manual.

### 3. **Beautiful, Intuitive UI/UX**
Our frontend is polished and professional:
- Smooth animations and transitions
- Responsive design
- Interactive 3D viewer with orbit controls
- Clear step-by-step navigation
- Hover effects and visual feedback
It looks and feels like a production app, not a hackathon project.

### 4. **Smart Use of Bright Data APIs**
We leveraged three different Bright Data products effectively:
- **SERP API** for product search (50 products for ~$0.05)
- **Web Scraper** for extracting manual URLs
- **Web Unlocker** for downloading protected PDFs
This showcases the power and versatility of Bright Data's platform.

### 5. **Geometric Primitive Innovation**
Instead of relying on pre-made 3D models, we generate geometry procedurally from AI-extracted dimensions. This means we can render ANY part type without needing a model library. This is scalable and flexible.

### 6. **Comprehensive Documentation**
We wrote extensive documentation:
- 7 markdown guides (QUICK_START, USAGE_GUIDE, GEOMETRY-GUIDE, etc.)
- Inline code comments
- TypeScript type definitions
- API documentation
This makes the project maintainable and easy for others to understand.

### 7. **Product Library Feature**
We scraped and cached 50 real IKEA products with images, categorized by room type. This provides immediate value to users without requiring them to search first.

## What we learned 📚

### Technical Skills

1. **AI Vision Capabilities**: We learned how powerful modern vision models like Gemini are at understanding complex visual information. With the right prompts, AI can extract structured data from diagrams that would be nearly impossible to parse programmatically.

2. **Web Scraping at Scale**: Bright Data's APIs taught us how professional web scraping works:
   - SERP API abstracts away the complexity of parsing search results
   - Web Unlocker handles proxies, CAPTCHAs, and anti-bot measures automatically
   - Proper rate limiting and caching are essential for cost management

3. **3D Web Graphics**: We deepened our understanding of Three.js and React Three Fiber:
   - Declarative 3D rendering in React
   - Geometric primitives and procedural generation
   - Camera positioning and lighting
   - Performance optimization for real-time rendering

4. **TypeScript Type Safety**: Strong typing across the entire stack prevented countless bugs and made refactoring much easier. Defining interfaces for AI responses, API data, and 3D objects was crucial.

5. **PDF Processing**: PDFs are more complex than they appear. We learned about:
   - Page extraction and rendering
   - Image optimization
   - Caching strategies
   - Handling different PDF formats

### Product & Design

1. **User-Centric Design**: We focused on solving a real problem (confusing assembly manuals) rather than just showcasing technology. This guided all our design decisions.

2. **Progressive Enhancement**: The app works with cached data even if APIs are unavailable, providing a good experience regardless of backend status.

3. **Importance of Visual Feedback**: Loading states, progress indicators, and smooth transitions make the app feel responsive and polished.

### Teamwork & Hackathon Strategy

1. **Clear Division of Labor**: We split work into clear domains (scraping, AI processing, 3D viewer, frontend UI) which allowed parallel development.

2. **Documentation as You Go**: Writing documentation during development (not after) helped us stay organized and made integration easier.

3. **MVP First, Polish Later**: We focused on getting core functionality working first, then iteratively improved UI and features.

4. **Embrace Pivots**: When our initial approach (pre-made 3D models) didn't scale, we quickly pivoted to geometric primitives. Being flexible saved the project.

## What's next for assembl3D 🚀

### Short-term Enhancements

1. **Improved Position Parsing**
   - Use AI to extract actual part positions from diagrams
   - Calculate relative positions between components
   - Generate more accurate 3D scenes that match the manual diagrams

2. **Animation System**
   - Implement smooth animations showing assembly actions
   - Add play/pause controls
   - Show movement paths with arrows
   - Highlight parts being assembled in each step

3. **Multi-Source Support**
   - Expand beyond IKEA to other furniture brands
   - Support different manual formats
   - Handle various PDF layouts and styles

4. **Mobile AR Integration**
   - Use WebXR to overlay 3D instructions on real furniture
   - Point phone at parts to identify them
   - Step-by-step AR guidance

5. **User Accounts & Saved Projects**
   - Save assembly progress
   - Create custom notes for each step
   - Share assemblies with others

### Medium-term Features

1. **Crowdsourced Improvements**
   - Allow users to correct AI-extracted data
   - Submit better part positions
   - Rate instruction clarity
   - Build a community-improved database

2. **Video Tutorial Integration**
   - Scrape YouTube for assembly videos
   - Sync video timestamps with steps
   - Show both 3D and real-world assembly

3. **Part Identification via Image Recognition**
   - Take a photo of a part
   - AI identifies what it is
   - Shows where it goes in the assembly

4. **Smart Tool Recommendations**
   - Suggest tool alternatives if you don't have the exact one
   - Link to purchase missing tools
   - Show tool usage techniques

5. **Difficulty Estimation**
   - Analyze assembly complexity
   - Estimate time required
   - Warn about challenging steps

### Long-term Vision

1. **Universal Assembly Database**
   - Process thousands of product manuals
   - Build searchable database of all furniture assemblies
   - Become the "Wikipedia of assembly instructions"

2. **AI Assembly Assistant**
   - Real-time help via chat
   - Answer questions about specific steps
   - Troubleshoot common mistakes
   - Provide personalized tips

3. **Manufacturer Integration**
   - Partner with furniture companies
   - Provide official 3D assembly guides
   - Reduce customer support costs
   - Improve customer satisfaction

4. **Generative 3D Models**
   - Use AI to generate realistic 3D models from part descriptions
   - Move beyond geometric primitives to photo-realistic rendering
   - Support custom furniture designs

5. **Multi-Language Support**
   - Translate instructions automatically
   - Support global user base
   - Make assembly accessible worldwide

6. **Sustainability Features**
   - Show disassembly instructions for moving
   - Promote furniture reuse and recycling
   - Track product lifecycle

### Business Model

- **Freemium**: Basic features free, premium features (AR, saved projects) paid
- **B2B**: License to furniture manufacturers and retailers
- **Affiliate**: Earn commission on tool/furniture purchases
- **API**: Provide assembly data API for other apps

---

**assembl3D transforms the frustrating experience of furniture assembly into an intuitive, interactive, and even enjoyable process. By combining AI vision, web scraping, and 3D visualization, we're making assembly manuals obsolete.**

**Built with ❤️ at Cal Hacks 12.0** 🏆

