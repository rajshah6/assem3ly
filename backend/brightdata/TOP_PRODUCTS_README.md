# Top 50 IKEA Products Scraper

This script uses Bright Data's SERP API to scrape the top 50 most popular IKEA products with their images.

## 📋 What It Does

1. **Curated Product List**: Uses a predefined list of the 50 most popular IKEA products (Billy, Kallax, Malm, etc.)
2. **Image Scraping**: For each product, searches Google Images via SERP API to get product images
3. **Categorization**: Automatically categorizes products (Living Room, Bedroom, Office, etc.)
4. **JSON Output**: Saves data to `backend/data/top-50-products.json`
5. **Frontend Integration**: Data is served via `/api/top-manuals` endpoint

## 🚀 How to Run

### 1. Make sure you have Bright Data credentials in `.env`:

```bash
# backend/.env
BRIGHTDATA_API_KEY=your_api_key_here
BRIGHTDATA_ZONE=your_serp_zone_name
```

### 2. Run the scraper:

```bash
cd backend
npm run scrape:top-products
```

### 3. Expected output:

```
🚀 Starting IKEA Top 50 Products Scraper
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Processing 50 products...

[1/50] Processing: BILLY Bookcase
🔍 SERP API Request: https://www.google.com/search?q=BILLY+Bookcase+IKEA+product&tbm=isch...
   ✅ Image: https://www.ikea.com/us/en/images/products/billy-bookcase...

[2/50] Processing: KALLAX Shelf Unit
🔍 SERP API Request: https://www.google.com/search?q=KALLAX+Shelf+Unit+IKEA+product&tbm=isch...
   ✅ Image: https://www.ikea.com/us/en/images/products/kallax-shelf...

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

## 📦 Output Format

The script generates `backend/data/top-50-products.json`:

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
  // ... 48 more products
]
```

## 🌐 API Endpoint

Once the data is generated, it's automatically served by the backend:

**GET** `/api/top-manuals`

```bash
curl http://localhost:3001/api/top-manuals
```

Returns the full array of 50 products.

## 🎨 Frontend Integration

The frontend automatically fetches this data in the "Library" tab:

```typescript
// frontend/lib/api-client.ts
export async function fetchTopManuals(): Promise<Manual[]> {
  const response = await fetch(`${API_URL}/api/top-manuals`);
  return response.json();
}
```

The `LibrarySection` component displays these products in a grid with hover effects showing the product images.

## ⚙️ Configuration

### Rate Limiting

The script includes a 1-second delay between requests to avoid rate limiting:

```typescript
await new Promise(resolve => setTimeout(resolve, 1000));
```

### Fallback Images

If image scraping fails for any product, it uses a default IKEA image as fallback.

### Custom Product List

To modify the product list, edit the `POPULAR_IKEA_PRODUCTS` array in `scrape-top-products.ts`:

```typescript
const POPULAR_IKEA_PRODUCTS = [
  'BILLY Bookcase',
  'KALLAX Shelf Unit',
  // Add your products here...
];
```

## 🔍 How It Uses SERP API

The script uses Bright Data's SERP API to search Google Images:

```typescript
const response = await axios.post(
  'https://api.brightdata.com/request',
  {
    zone: SERP_ZONE,
    url: `https://www.google.com/search?q=${productName}+IKEA+product&tbm=isch`,
    format: 'json',
    brd_json: 1,
  },
  {
    headers: {
      'Authorization': `Bearer ${BRIGHTDATA_API_KEY}`,
    },
  }
);
```

Reference: [Bright Data SERP API Documentation](https://docs.brightdata.com/scraping-automation/serp-api/introduction)

## 🐛 Troubleshooting

### Error: "BRIGHTDATA_API_KEY not found"

**Fix**: Make sure you have `BRIGHTDATA_API_KEY` in `backend/.env`

### Error: "SERP API Error: 401"

**Fix**: Check that your API key is correct and your Bright Data account is active

### Error: "No image found for [product]"

**Fix**: This is normal - the script will use a fallback image. Some products may have limited image results.

### Frontend shows "Top products data not found"

**Fix**: Run `npm run scrape:top-products` first to generate the data file

## 💰 Cost Estimate

- **SERP API**: ~$1-2 per 1000 requests
- **50 products**: ~$0.05-0.10 per run
- **Your $5 credit**: Covers ~50-100 runs

## 🔄 Re-running the Scraper

You can re-run the scraper anytime to refresh the data:

```bash
npm run scrape:top-products
```

The frontend will automatically fetch the updated data on the next page load.

## 📚 Related Files

- **Scraper**: `backend/brightdata/scrape-top-products.ts`
- **API Route**: `backend/src/api/routes.ts` (GET `/api/top-manuals`)
- **Frontend Client**: `frontend/lib/api-client.ts` (`fetchTopManuals()`)
- **UI Component**: `frontend/components/library/library-section.tsx`
- **Data Output**: `backend/data/top-50-products.json`

---

**Built with ❤️ using Bright Data SERP API**

