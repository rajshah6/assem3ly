# Bright Data Setup Guide - Residential Proxies

## 🔑 Getting Your Bright Data Credentials

### Step 1: Sign up for Bright Data
1. Go to https://brightdata.com
2. Create a free account
3. You'll get **$5 free credit** to test!

### Step 2: Create a Residential Proxy Zone
1. Log in to https://brightdata.com/cp/zones
2. Click **"Add Zone"**
3. Configure your zone:
   - **Product**: Select **"Residential"** (NOT Scraping Browser!)
   - **Zone Name**: `ikea-scraper` (or any name you want)
   - **Country**: Leave as "All" or select "United States"
   - Click **"Save"**

### Step 3: Get Your Credentials
After creating the zone, you'll see:
1. **Customer ID**: Looks like `hl_abc123def` or similar
2. **Zone Name**: The name you chose (e.g., `ikea-scraper`)
3. **Password/API Key**: Click to reveal or generate

**Where to find them:**
- Go to: https://brightdata.com/cp/zones
- Click on your `ikea-scraper` zone
- Look for "Access parameters" section
- Copy:
  - Customer ID
  - Zone name
  - Password (this is your API key)

### Step 4: Add to .env file
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` and paste your credentials:

```bash
BRIGHTDATA_CUSTOMER_ID=hl_abc123def
BRIGHTDATA_ZONE=ikea-scraper
BRIGHTDATA_API_KEY=your_password_here
```

**Important**: 
- The zone name must match EXACTLY what you named it
- No quotes around the values
- No spaces before or after the `=`

---

## 🧪 Testing Your Setup

### Test 1: Verify Environment Variables
```bash
cd backend
node -e "require('dotenv').config(); console.log('✅ Customer ID:', process.env.BRIGHTDATA_CUSTOMER_ID)"
```

Should print your customer ID (not "undefined")

### Test 2: Run the Scraper
```bash
cd backend
npx ts-node brightdata/test.ts
```

**This will:**
1. ✅ Check your Bright Data credentials
2. 🔍 Search IKEA for "billy bookcase"
3. 📄 Navigate to product page (using Bright Data proxies)
4. 📊 Extract product data
5. 📥 Download the PDF manual
6. ✅ Print results

**Expected output:**
```
🧪 Testing Bright Data IKEA Scraper
✅ Environment variables loaded
🔍 Starting IKEA scrape for: billy bookcase
🌐 Using Bright Data Residential Proxies (150M+ IPs)...
🔎 Searching: https://www.ikea.com/us/en/search/?query=billy+bookcase
📄 Product page: https://www.ikea.com/us/en/p/billy-bookcase-white-20522046/
🌐 Fetching product page via Bright Data...
📊 Extracting product data...
✅ Product found: BILLY Bookcase
🆔 Product ID: 20522046
📐 Dimensions: { width: '31 1/2 "', height: '79 1/2 "', depth: '11 "' }
📄 PDF URL: https://www.ikea.com/us/en/assembly_instructions/billy-bookcase-white__AA-2289108-3-100.pdf
📥 Downloading PDF with Bright Data Web Unlocker...
💾 PDF saved to: /Users/ajith/Projects/assembl3D/backend/data/pdfs/20522046.pdf

✅ SUCCESS!
Product Name: BILLY Bookcase
Product ID: 20522046
PDF Path: /Users/ajith/Projects/assembl3D/backend/data/pdfs/20522046.pdf
Time taken: 8.2 seconds
```

### Test 3: API Endpoint
Start the server:
```bash
cd backend
npm run dev
```

In another terminal, test the API:
```bash
curl -X POST http://localhost:3001/api/scrape-product \
  -H "Content-Type: application/json" \
  -d '{"query":"billy bookcase"}'
```

---

## 🚨 Troubleshooting

### Error: "Missing BRIGHTDATA_CUSTOMER_ID"
**Fix:**
- Make sure `.env` file exists in `backend/` directory
- Check variable names match exactly (case-sensitive)
- No quotes around values in .env file

### Error: "connect ETIMEDOUT" or "Connection timeout"
**Possible causes:**
1. **Account has no credits**: Check https://brightdata.com/cp/billing
2. **Wrong credentials**: Double-check your .env values
3. **Zone not active**: Verify zone exists at https://brightdata.com/cp/zones

### Error: "Authentication failed" or "407 Proxy Authentication Required"
**Fix:**
- Verify your API key/password is correct
- Make sure zone name matches exactly
- Try regenerating the password in Bright Data dashboard

### Error: "No products found"
**Possible causes:**
1. **Wrong product name**: Try "billy bookcase" or "malm dresser"
2. **IKEA blocking**: This is rare with Residential proxies, but try again
3. **HTML structure changed**: IKEA updates their site sometimes

### Still not working?
1. Check Bright Data dashboard for request logs
2. Make sure you have Residential proxy (not Scraping Browser)
3. Verify your account is active and has credits

---

## 💰 Pricing & Credits

- **Free tier**: $5 credit to start
- **Residential proxies**: ~$15/GB (or $10/GB on subscription)
- **This project uses**: ~1-2MB per product scraped
- **Your $5 credit**: Covers ~300-500 product scrapes

**Tip**: For the hackathon, $5 credit is more than enough!

---

## 📚 Resources

- **Bright Data Dashboard**: https://brightdata.com/cp
- **Residential Proxy Docs**: https://docs.brightdata.com/residential-proxies
- **Zone Management**: https://brightdata.com/cp/zones
- **Support**: https://help.brightdata.com

---

## 🎯 What's Next?

Once your test passes:
1. ✅ Your scraper is working!
2. ✅ API endpoint is ready
3. ✅ Person 2 (Frontend) can start calling your API
4. ✅ Person 3 (AI) can process the PDFs you download

**You're ready to integrate with the rest of the team!** 🚀
