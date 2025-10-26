# 🚀 Top 50 IKEA Products Feature - Usage Guide

This guide explains how to use the new Top 50 IKEA Products feature that scrapes real product data using Bright Data's SERP API.

## 📋 Overview

**What it does:**
- Scrapes the 50 most popular IKEA products (Billy, Kallax, Malm, etc.)
- Gets real product images from Google Images using SERP API
- Categorizes products automatically (Living Room, Bedroom, Office, etc.)
- Displays them in the frontend "Library" tab with beautiful hover effects

**Before:** The library showed 50 mock products with the same image  
**After:** Real IKEA products with actual product images!

---

## 🎯 Quick Start (3 Steps)

### Step 1: Test SERP API Connection

```bash
cd backend
npm run test:serp
```

**Expected output:**
```
🧪 Testing Bright Data SERP API Connection
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ API Key found
✅ Zone: serp_api1

🔍 Testing image search for: BILLY Bookcase
✅ SERP API Response received!

Response structure:
  Status: 200
  Images found: 20
  
First image:
  URL: https://www.ikea.com/us/en/images/products/billy-bookcase...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Test passed! SERP API is working correctly.
```

If this fails, check your `.env` file has `BRIGHTDATA_API_KEY` and `BRIGHTDATA_ZONE`.

---

### Step 2: Scrape the Top 50 Products

```bash
cd backend
npm run scrape:top-products
```

**What happens:**
- Scrapes 50 products (takes ~1 minute with rate limiting)
- Gets product images from Google Images
- Saves to `backend/data/top-50-products.json`

**Expected output:**
```
🚀 Starting IKEA Top 50 Products Scraper
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Processing 50 products...

[1/50] Processing: BILLY Bookcase
🔍 SERP API Request: https://www.google.com/search?q=BILLY+Bookcase...
   ✅ Image: https://www.ikea.com/us/en/images/products/billy...

[2/50] Processing: KALLAX Shelf Unit
🔍 SERP API Request: https://www.google.com/search?q=KALLAX+Shelf...
   ✅ Image: https://www.ikea.com/us/en/images/products/kallax...

...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ SUCCESS! Scraped 50 products
💾 Saved to: /path/to/backend/data/top-50-products.json

Sample products:
  • BILLY Bookcase (Office)
  • KALLAX Shelf Unit (Living Room)
  • MALM Bed Frame (Bedroom)
  • POÄNG Armchair (Living Room)
  • LACK Side Table (Living Room)

🎉 Scraping complete!
```

---

### Step 3: Start Backend & Frontend

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

**Terminal 3 - Test the API:**
```bash
curl http://localhost:3001/api/top-manuals
```

Should return JSON array of 50 products!

---

## 🌐 Frontend Usage

Open http://localhost:3000 and:

1. Click the **"Library"** tab
2. See the "Top 50 manuals" section
3. Hover over any card to see the actual product image!

The frontend automatically fetches from `/api/top-manuals` instead of using mock data.

---

## 📁 Files Created/Modified

### New Files:
- ✅ `backend/brightdata/scrape-top-products.ts` - Main scraper script
- ✅ `backend/brightdata/test-top-products.ts` - Test script
- ✅ `backend/brightdata/TOP_PRODUCTS_README.md` - Detailed docs
- ✅ `backend/data/top-50-products.json` - Generated data (after running scraper)

### Modified Files:
- ✅ `backend/src/api/routes.ts` - Added `GET /api/top-manuals` endpoint
- ✅ `backend/package.json` - Added `scrape:top-products` and `test:serp` scripts
- ✅ `frontend/lib/api-client.ts` - Updated `fetchTopManuals()` to use real API

---

## 🔧 Configuration

### Environment Variables

Make sure `backend/.env` has:
```bash
BRIGHTDATA_API_KEY=your_api_key_here
BRIGHTDATA_ZONE=your_serp_zone_name  # e.g., serp_api1
PORT=3001
```

And `frontend/.env.local` has:
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Customizing the Product List

Edit `backend/brightdata/scrape-top-products.ts`:

```typescript
const POPULAR_IKEA_PRODUCTS = [
  'BILLY Bookcase',
  'KALLAX Shelf Unit',
  // Add your products here...
];
```

Then re-run `npm run scrape:top-products`.

---

## 🐛 Troubleshooting

### ❌ "BRIGHTDATA_API_KEY not found"

**Fix:**
```bash
cd backend
# Create .env file if it doesn't exist
cat > .env << 'EOF'
BRIGHTDATA_API_KEY=your_key_here
BRIGHTDATA_ZONE=serp_api1
PORT=3001
EOF
```

### ❌ "401 Unauthorized" from SERP API

**Fix:**
- Check your API key is correct
- Verify your Bright Data account is active
- Make sure you have a SERP API zone created at https://brightdata.com/cp/zones

### ❌ Frontend shows "Top products data not found"

**Fix:**
```bash
cd backend
npm run scrape:top-products
```

The data file needs to be generated first!

### ❌ Frontend still shows mock data

**Fix:**
- Make sure backend is running (`npm run dev`)
- Check `NEXT_PUBLIC_API_URL` in `frontend/.env.local`
- Open browser console to see if API call is failing
- Verify `/api/top-manuals` returns data: `curl http://localhost:3001/api/top-manuals`

---

## 💰 Cost Estimate

Using Bright Data SERP API:

- **Cost**: ~$1-2 per 1000 requests
- **50 products**: ~$0.05-0.10 per run
- **Your $5 credit**: Covers ~50-100 runs

Very affordable for a hackathon! 🎉

---

## 🔄 Re-running the Scraper

You can refresh the data anytime:

```bash
cd backend
npm run scrape:top-products
```

The frontend will automatically fetch the updated data on next page load.

---

## 📊 Data Format

Generated `backend/data/top-50-products.json`:

```json
[
  {
    "id": "product-1",
    "name": "BILLY Bookcase",
    "imageUrl": "https://www.ikea.com/us/en/images/products/billy-bookcase-white__0625599_pe692385_s5.jpg",
    "category": "Office"
  },
  {
    "id": "product-2",
    "name": "KALLAX Shelf Unit",
    "imageUrl": "https://www.ikea.com/us/en/images/products/kallax-shelf-unit-white__0644768_pe702939_s5.jpg",
    "category": "Living Room"
  }
  // ... 48 more
]
```

---

## 🎨 Frontend Display

The `LibrarySection` component shows these products in a responsive grid:

- **Default state**: Product name visible
- **On hover**: Beautiful gradient overlay with product image
- **Click**: Navigate to assembly page (when implemented)

---

## 📚 API Endpoints

### GET `/api/top-manuals`

Returns array of 50 products.

**Example:**
```bash
curl http://localhost:3001/api/top-manuals
```

**Response:**
```json
[
  {
    "id": "product-1",
    "name": "BILLY Bookcase",
    "imageUrl": "https://...",
    "category": "Office"
  }
  // ... 49 more
]
```

---

## 🚀 Demo Flow for Hackathon

1. **Show the problem**: "Library tab shows fake data with same image"
2. **Run the scraper**: `npm run scrape:top-products` (takes ~1 min)
3. **Refresh frontend**: Show real IKEA products with actual images
4. **Hover effect**: Demonstrate the beautiful UI with real product photos
5. **Explain tech**: "Using Bright Data SERP API to scrape Google Images"

---

## 📖 Documentation Links

- [Bright Data SERP API Docs](https://docs.brightdata.com/scraping-automation/serp-api/introduction)
- [Detailed README](backend/brightdata/TOP_PRODUCTS_README.md)
- [Project Main README](README.md)

---

## ✅ Testing Checklist

- [ ] Test SERP API connection: `npm run test:serp`
- [ ] Run scraper: `npm run scrape:top-products`
- [ ] Verify JSON file created: `backend/data/top-50-products.json`
- [ ] Start backend: `npm run dev`
- [ ] Test API endpoint: `curl http://localhost:3001/api/top-manuals`
- [ ] Start frontend: `npm run dev`
- [ ] Open http://localhost:3000
- [ ] Click "Library" tab
- [ ] Verify 50 products display with real images on hover

---

**Built with ❤️ using Bright Data SERP API**

Questions? Check `backend/brightdata/TOP_PRODUCTS_README.md` for more details!

