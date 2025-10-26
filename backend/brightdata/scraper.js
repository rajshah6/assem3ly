"use strict";
/**
 * Person 1: Main IKEA Scraper
 * Uses Bright Data Residential Proxies + Cheerio
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrapeProduct = scrapeProduct;
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
const pdf_downloader_1 = require("./pdf-downloader");
// Check required environment variables
if (!process.env.BRIGHTDATA_CUSTOMER_ID) {
    throw new Error('Missing BRIGHTDATA_CUSTOMER_ID in .env file');
}
if (!process.env.BRIGHTDATA_ZONE) {
    throw new Error('Missing BRIGHTDATA_ZONE in .env file');
}
if (!process.env.BRIGHTDATA_API_KEY) {
    throw new Error('Missing BRIGHTDATA_API_KEY in .env file');
}
// Bright Data Residential Proxy configuration
const PROXY_HOST = 'brd.superproxy.io';
const PROXY_PORT = 22225;
const PROXY_USERNAME = `brd-customer-${process.env.BRIGHTDATA_CUSTOMER_ID}-zone-${process.env.BRIGHTDATA_ZONE}`;
const PROXY_PASSWORD = process.env.BRIGHTDATA_API_KEY;
const axiosWithProxy = axios_1.default.create({
    proxy: {
        host: PROXY_HOST,
        port: PROXY_PORT,
        auth: {
            username: PROXY_USERNAME,
            password: PROXY_PASSWORD
        }
    },
    timeout: 30000,
    headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    },
    httpsAgent: new (require('https').Agent)({
        rejectUnauthorized: false // Required for proxy SSL certificates
    })
});
async function scrapeProduct(productName) {
    console.log('🔍 Starting IKEA scrape for:', productName);
    console.log('🌐 Using Bright Data Residential Proxies (150M+ IPs)...');
    try {
        let fullProductUrl = '';
        // Check if user provided a direct IKEA product URL
        if (productName.includes('ikea.com') && productName.includes('/p/')) {
            console.log('📄 Direct URL provided, skipping search');
            fullProductUrl = productName;
        }
        else {
            // Step 1: Search IKEA
            const searchQuery = productName.trim().replace(/\s+/g, '+');
            const searchUrl = `https://www.ikea.com/us/en/search/?query=${searchQuery}`;
            console.log('🔎 Searching:', searchUrl);
            const searchResponse = await axiosWithProxy.get(searchUrl);
            const $search = cheerio.load(searchResponse.data);
            // Try multiple selectors to find product links
            let productUrl = null;
            // Try different selectors that IKEA might use
            const selectors = [
                'a[href*="/p/"]', // Any link containing /p/
                '.plp-product-list__product a',
                '.product-compact a',
                '.product-list a',
                'a.plp-product__name-link'
            ];
            for (const selector of selectors) {
                const links = $search(selector);
                if (links.length > 0) {
                    // Find first link that looks like a product page
                    links.each((i, el) => {
                        const href = $search(el).attr('href');
                        if (href && href.includes('/p/') && href.includes('-')) {
                            productUrl = href;
                            return false; // break
                        }
                    });
                    if (productUrl) {
                        console.log('✅ Found product link with selector:', selector);
                        break;
                    }
                }
            }
            if (!productUrl) {
                console.error('❌ Could not find product link');
                console.error('📄 Page title:', $search('title').text());
                console.error('🔗 Found', $search('a').length, 'total links');
                throw new Error('No products found for: ' + productName);
            }
            // At this point, TypeScript knows productUrl is a string (not null)
            const url = productUrl;
            fullProductUrl = url.startsWith('http')
                ? url
                : `https://www.ikea.com${url}`;
        }
        console.log('📄 Product page:', fullProductUrl);
        // Step 2: Get product page
        console.log('🌐 Fetching product page via Bright Data...');
        const productResponse = await axiosWithProxy.get(fullProductUrl);
        const $ = cheerio.load(productResponse.data);
        // Step 3: Extract product data
        console.log('📊 Extracting product data...');
        // Product name
        const name = $('.range-revamp-header-section__title--big').text().trim();
        // Product ID from URL
        const productIdMatch = fullProductUrl.match(/-(\d{8})\//);
        const productId = productIdMatch ? productIdMatch[1] : '';
        // Find PDF link
        let pdfUrl = '';
        $('a').each((i, el) => {
            const href = $(el).attr('href');
            if (href && href.includes('.pdf') && href.includes('assembly_instructions')) {
                pdfUrl = href.startsWith('http') ? href : `https://www.ikea.com${href}`;
                return false; // break
            }
        });
        // Dimensions
        const dimensions = {};
        $('.pip-product-dimensions__measurement').each((i, el) => {
            const label = $(el).find('.pip-product-dimensions__measurement-name').text().toLowerCase();
            const value = $(el).find('.pip-product-dimensions__measurement-value').text().trim();
            if (label.includes('width'))
                dimensions.width = value;
            if (label.includes('height'))
                dimensions.height = value;
            if (label.includes('depth'))
                dimensions.depth = value;
        });
        // Images
        const images = [];
        $('.pip-media-grid__media-image img').each((i, el) => {
            const src = $(el).attr('src');
            if (src && !src.includes('data:image')) {
                images.push(src);
            }
        });
        // Category
        const categoryLinks = $('.pip-breadcrumbs__item a');
        const category = categoryLinks.last().text().trim();
        console.log('✅ Product found:', name);
        console.log('🆔 Product ID:', productId);
        console.log('📐 Dimensions:', dimensions);
        console.log('📄 PDF URL:', pdfUrl || 'NOT FOUND');
        // Step 4: Download PDF if available
        let pdfPath = '';
        if (pdfUrl) {
            try {
                pdfPath = await (0, pdf_downloader_1.downloadPDF)(pdfUrl, productId);
            }
            catch (error) {
                console.warn('⚠️  PDF download failed, continuing without it:', error.message);
            }
        }
        else {
            console.warn('⚠️  No PDF found for this product');
        }
        // Step 5: Return in standard format
        const result = {
            productName: name,
            productId: productId,
            pdfUrl: pdfUrl,
            pdfPath: pdfPath,
            metadata: {
                dimensions: dimensions,
                images: images.slice(0, 5),
                category: category,
                sourceUrl: fullProductUrl,
                scrapedAt: new Date().toISOString()
            }
        };
        console.log('✅ Scraping complete!');
        return result;
    }
    catch (error) {
        console.error('❌ Scraping failed:', error.message);
        throw error;
    }
}
