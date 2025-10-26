# 📸 IKEA Product Images - Download & Setup Guide

This guide explains how to use Bright Data's SERP API to download real IKEA product images and display them locally in the frontend.

---

## 🎯 What This Does

1. **Searches Google Images** using Bright Data SERP API for each of the 50 products
2. **Downloads images** to `backend/data/images/`
3. **Copies images** to `frontend/public/products/`
4. **Updates frontend data** to use local image paths
5. **Result**: Fast-loading, local images instead of external URLs!

---

## 🚀 Quick Start (One Command)

```bash
cd backend
npm run setup:images
```

This runs all three steps automatically:
1. Download images using SERP API
2. Copy to frontend
3. Update frontend data file

**Time**: ~2-3 minutes for 50 products (with rate limiting)

---

## 📋 Step-by-Step (Manual)

### Step 1: Download Images

```bash
cd backend
npm run download:images
```

**What it does:**
- Searches Google Images for each product using SERP API
- Downloads the first relevant image
- Saves to `backend/data/images/product-1.jpg`, `product-2.jpg`, etc.
- Creates `top-50-products-local.json` with updated paths

**Expected output:**
```
🚀 Starting IKEA Product Image Downloader
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Found 50 products to process

[1/50] BILLY Bookcase
   🔍 Searching: BILLY Bookcase
   ✅ Found IKEA image
   📥 Downloading...
   💾 Saved to: product-1.jpg

[2/50] KALLAX Shelf Unit
   🔍 Searching: KALLAX Shelf Unit
   ✅ Found IKEA image
   📥 Downloading...
   💾 Saved to: product-2.jpg

...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Downloaded: 48 images
❌ Failed: 2 images
💾 Saved to: backend/data/top-50-products-local.json
```

---

### Step 2: Copy to Frontend

```bash
cd backend
npm run copy:images
```

**What it does:**
- Copies all images from `backend/data/images/` to `frontend/public/products/`
- Frontend can now serve them as static files

**Expected output:**
```
📦 Copying images to frontend...

📁 Created frontend/public/products directory
   ✅ Copied: product-1.jpg
   ✅ Copied: product-2.jpg
   ...
   ✅ Copied: product-50.jpg

✅ Copied 50 images to frontend/public/products/
```

---

### Step 3: Update Frontend Data

```bash
cd backend
npm run update:frontend-data
```

**What it does:**
- Reads `top-50-products-local.json`
- Updates `frontend/lib/top-50-data.ts` with local paths like `/products/product-1.jpg`

**Expected output:**
```
🔄 Updating frontend data with local image paths...

✅ Updated frontend/lib/top-50-data.ts
   50 products with local image paths

Next step:
   Restart frontend: cd frontend && npm run dev
```

---

### Step 4: Restart Frontend

```bash
cd frontend
npm run dev
```

Open http://localhost:3000 → Click "Library" → **Hover to see local images!** ⚡

---

## 📁 File Structure After Setup

```
backend/
├── data/
│   ├── images/                    # Downloaded images
│   │   ├── product-1.jpg
│   │   ├── product-2.jpg
│   │   └── ...
│   ├── top-50-products.json       # Original with external URLs
│   └── top-50-products-local.json # Updated with local paths

frontend/
├── public/
│   └── products/                  # Copied images (served statically)
│       ├── product-1.jpg
│       ├── product-2.jpg
│       └── ...
└── lib/
    └── top-50-data.ts            # Updated with /products/... paths
```

---

## 🔧 How It Works

### 1. SERP API Image Search

```typescript
// Search Google Images for "BILLY Bookcase IKEA furniture"
POST https://api.brightdata.com/request
{
  "zone": "serp_api1",
  "url": "https://www.google.com/search?q=BILLY+Bookcase+IKEA+furniture&tbm=isch",
  "format": "raw"
}

// Response contains HTML with image URLs
// Script extracts first IKEA image URL
```

### 2. Image Download

```typescript
// Download image using axios
GET https://www.ikea.com/us/en/images/products/billy-bookcase-white__0625599_pe692385_s5.jpg

// Save to backend/data/images/product-1.jpg
```

### 3. Frontend Integration

```typescript
// Before:
imageUrl: "https://images.unsplash.com/photo-1594620302200-9a762244a156"

// After:
imageUrl: "/products/product-1.jpg"  // Served from public directory
```

---

## 💰 Cost Estimate

Using Bright Data SERP API:

- **50 products** × 1 SERP request each = 50 requests
- **Cost**: ~$0.05-0.10 total
- **Your $5 credit**: Covers 50-100 runs

**Very affordable!** 🎉

---

## ⚡ Benefits of Local Images

### Before (External URLs):
- ❌ Slow loading from external servers
- ❌ CORS issues
- ❌ Images can break if URLs change
- ❌ Requires internet connection

### After (Local Images):
- ✅ **Instant loading** (served locally)
- ✅ No CORS issues
- ✅ Images never break
- ✅ Works offline
- ✅ Perfect for demo

---

## 🐛 Troubleshooting

### Error: "BRIGHTDATA_API_KEY not found"

**Fix**: Make sure `backend/.env` has:
```bash
BRIGHTDATA_API_KEY=your_api_key_here
BRIGHTDATA_ZONE=serp_api1
```

### Error: "top-50-products.json not found"

**Fix**: Generate it first:
```bash
cd backend
npm run generate:top50
```

### Some images failed to download

**Normal!** Some products may not have images available. The script will:
- Keep the original URL for failed downloads
- Continue with remaining products
- Show count of successful/failed downloads

### Images not showing in frontend

**Checklist:**
1. ✅ Images copied to `frontend/public/products/`?
2. ✅ Frontend data updated with local paths?
3. ✅ Frontend restarted after changes?

**Verify:**
```bash
# Check images exist
ls frontend/public/products/

# Check data file
cat frontend/lib/top-50-data.ts | grep "/products/"
```

---

## 🔄 Re-downloading Images

Want to refresh the images?

```bash
cd backend
npm run setup:images
```

This will:
- Re-download all images
- Overwrite existing files
- Update frontend data

---

## 📊 Scripts Reference

| Command | Description |
|---------|-------------|
| `npm run download:images` | Download images using SERP API |
| `npm run copy:images` | Copy images to frontend |
| `npm run update:frontend-data` | Update frontend data file |
| `npm run setup:images` | **Run all three steps** |

---

## 🎬 Demo Flow

### Before Demo:
```bash
cd backend
npm run setup:images
```

### During Demo:

1. **Show the problem**: "External image URLs are slow and unreliable"

2. **Show the solution**: 
   - "We use Bright Data SERP API to find images"
   - "Download them once, serve them locally"
   - "Instant loading, no external dependencies"

3. **Show the code**:
   - Open `download-product-images.ts`
   - Highlight SERP API integration
   - Show image download logic

4. **Show the results**:
   - Open `frontend/public/products/` folder
   - Show 50 downloaded images
   - Open frontend → Library tab
   - **Hover over cards** → Instant image loading!

5. **Explain benefits**:
   - "50 images downloaded in ~2 minutes"
   - "Cost: ~$0.05 with Bright Data"
   - "Now loads instantly from local files"
   - "Perfect for production deployment"

---

## 📚 Related Files

- **`backend/brightdata/download-product-images.ts`** - Main download script
- **`backend/brightdata/copy-images-to-frontend.ts`** - Copy script
- **`backend/brightdata/update-frontend-data.ts`** - Data update script
- **`backend/data/images/`** - Downloaded images
- **`frontend/public/products/`** - Frontend images
- **`frontend/lib/top-50-data.ts`** - Frontend data with local paths

---

## ✅ Success Checklist

- [ ] SERP API credentials in `.env`
- [ ] Run `npm run setup:images`
- [ ] Images in `backend/data/images/`
- [ ] Images in `frontend/public/products/`
- [ ] Frontend data updated
- [ ] Frontend restarted
- [ ] Images show on hover

---

**Built with ❤️ using Bright Data SERP API**

Ready to download! 🚀

