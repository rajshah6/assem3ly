"use strict";
/**
 * Person 1: PDF Downloader
 * Downloads PDFs using Bright Data Web Unlocker
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadPDF = downloadPDF;
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const PDF_DIR = path_1.default.join(__dirname, '../data/pdfs');
async function downloadPDF(pdfUrl, productId) {
    console.log('📥 Downloading PDF with Bright Data Web Unlocker...');
    console.log('   URL:', pdfUrl);
    // Ensure directory exists
    if (!fs_1.default.existsSync(PDF_DIR)) {
        fs_1.default.mkdirSync(PDF_DIR, { recursive: true });
    }
    const filePath = path_1.default.join(PDF_DIR, `${productId}.pdf`);
    // Check environment variables
    if (!process.env.BRIGHTDATA_CUSTOMER_ID || !process.env.BRIGHTDATA_ZONE || !process.env.BRIGHTDATA_API_KEY) {
        throw new Error('Missing Bright Data credentials in .env file');
    }
    try {
        // Use Bright Data Web Unlocker proxy
        const response = await axios_1.default.get(pdfUrl, {
            proxy: {
                host: 'brd.superproxy.io',
                port: 22225,
                auth: {
                    username: `brd-customer-${process.env.BRIGHTDATA_CUSTOMER_ID}-zone-${process.env.BRIGHTDATA_ZONE}`,
                    password: process.env.BRIGHTDATA_API_KEY
                }
            },
            responseType: 'arraybuffer',
            timeout: 30000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
            },
            httpsAgent: new (require('https').Agent)({
                rejectUnauthorized: false // Required for proxy SSL certificates
            })
        });
        fs_1.default.writeFileSync(filePath, response.data);
        console.log('💾 PDF saved to:', filePath);
        return filePath;
    }
    catch (error) {
        console.error('❌ PDF download failed:', error.message);
        throw new Error(`Failed to download PDF: ${error.message}`);
    }
}
