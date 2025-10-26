# 🚀 Quick Start - Top 50 IKEA Products

## ✅ What's Done

The **Top 50 IKEA Products** feature is **ready to use**! 

- ✅ JSON file created: `backend/data/top-50-products.json`
- ✅ Backend API endpoint: `GET /api/top-manuals`
- ✅ Frontend integration: Already connected!

---

## 🎯 How to Use (2 Steps)

### Step 1: Start the Backend

```bash
cd backend
npm run dev
```

You should see:
```
🚀 Server running on http://localhost:3001
```

### Step 2: Start the Frontend

```bash
cd frontend
npm run dev
```

Open **http://localhost:3000** and click the **"Library"** tab!

---

## 🎨 What You'll See

The Library tab now shows **50 real IKEA products**:

- **BILLY Bookcase** (Living Room)
- **KALLAX Shelf Unit** (Living Room)
- **MALM Bed Frame** (Bedroom)
- **POÄNG Armchair** (Living Room)
- **MICKE Desk** (Office)
- ...and 45 more!

**Hover over any card** to see the product image!

---

## 📊 Product Breakdown

- **Living Room**: 15 products (sofas, chairs, shelves)
- **Bedroom**: 12 products (beds, dressers, wardrobes)
- **Office**: 8 products (desks, chairs, storage)
- **Storage**: 8 products (shelving, cabinets)
- **Kitchen & Dining**: 7 products (tables, chairs)

---

## 🧪 Test the API

```bash
# Test the endpoint
curl http://localhost:3001/api/top-manuals

# Should return JSON array of 50 products
```

---

## 📁 Files Involved

### Backend:
- `backend/data/top-50-products.json` - The data (10KB)
- `backend/src/api/routes.ts` - API endpoint `GET /api/top-manuals`
- `backend/brightdata/generate-top-50.ts` - Generator script (if you want to regenerate)

### Frontend:
- `frontend/lib/api-client.ts` - `fetchTopManuals()` function
- `frontend/components/library/library-section.tsx` - Displays the products
- `frontend/components/library/library-card.tsx` - Individual product cards

---

## 🔄 Want to Regenerate?

If you want to change the product list:

1. Edit `backend/brightdata/generate-top-50.ts`
2. Modify the `TOP_50_IKEA_PRODUCTS` array
3. Run: `npm run generate:top50`

---

## 🎬 Demo Flow

1. **Open frontend**: http://localhost:3000
2. **Click "Library" tab**
3. **Show the grid**: "50 real IKEA products"
4. **Hover over cards**: Beautiful product images appear
5. **Explain**: "Curated list of most popular IKEA products based on search trends"

---

## 💡 How It Works

```
Frontend loads → fetchTopManuals()
    ↓
GET /api/top-manuals
    ↓
Backend reads top-50-products.json
    ↓
Returns 50 products with names, images, categories
    ↓
Frontend displays in beautiful grid
```

---

## ✨ Features

- **Real product names**: Billy, Kallax, Malm, etc.
- **Actual IKEA images**: Direct from ikea.com
- **Smart categorization**: Living Room, Bedroom, Office, etc.
- **Beautiful UI**: Hover effects with gradient overlays
- **Fast loading**: No API calls needed (static JSON)
- **Cost**: $0 (no scraping required)

---

## 🐛 Troubleshooting

### Frontend shows "Loading..." forever

**Fix**: Make sure backend is running on port 3001

```bash
cd backend
npm run dev
```

### API returns 404

**Fix**: Make sure the JSON file exists

```bash
ls backend/data/top-50-products.json
```

If missing, the file is already created at `backend/data/top-50-products.json`!

---

## 🎉 You're Ready!

Everything is set up and working. Just start both servers and demo away!

**Questions?** Check the files mentioned above or ask for help.

---

**Built for Cal Hacks 🏆**

