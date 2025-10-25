/**
 * Person 1: Main IKEA Scraper
 * Uses Bright Data Residential Proxies + Cheerio
 */

import axios from 'axios'
import * as cheerio from 'cheerio'
import { ScrapedProduct } from './types'
import { downloadPDF } from './pdf-downloader'

// Check required environment variables
if (!process.env.BRIGHTDATA_CUSTOMER_ID) {
  throw new Error('Missing BRIGHTDATA_CUSTOMER_ID in .env file')
}
if (!process.env.BRIGHTDATA_ZONE) {
  throw new Error('Missing BRIGHTDATA_ZONE in .env file')
}
if (!process.env.BRIGHTDATA_API_KEY) {
  throw new Error('Missing BRIGHTDATA_API_KEY in .env file')
}

// Bright Data Residential Proxy configuration
const PROXY_HOST = 'brd.superproxy.io'
const PROXY_PORT = 22225
const PROXY_USERNAME = `brd-customer-${process.env.BRIGHTDATA_CUSTOMER_ID}-zone-${process.env.BRIGHTDATA_ZONE}`
const PROXY_PASSWORD = process.env.BRIGHTDATA_API_KEY

const axiosWithProxy = axios.create({
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
})

export async function scrapeProduct(productName: string): Promise<ScrapedProduct> {
  console.log('🔍 Starting IKEA scrape for:', productName)
  console.log('🌐 Using Bright Data Residential Proxies (150M+ IPs)...')
  
  try {
    let fullProductUrl = ''
    
    // Check if user provided a direct IKEA product URL
    if (productName.includes('ikea.com') && productName.includes('/p/')) {
      console.log('📄 Direct URL provided, skipping search')
      fullProductUrl = productName
    } else {
      // Step 1: Search IKEA
      const searchQuery = productName.trim().replace(/\s+/g, '+')
      const searchUrl = `https://www.ikea.com/us/en/search/?query=${searchQuery}`
      
      console.log('🔎 Searching:', searchUrl)
      const searchResponse = await axiosWithProxy.get(searchUrl)
      const $search = cheerio.load(searchResponse.data)
      
      // Try multiple selectors to find product links
      let productUrl: string | null = null
      
      // Try different selectors that IKEA might use
      const selectors = [
        'a[href*="/p/"]',  // Any link containing /p/
        '.plp-product-list__product a',
        '.product-compact a',
        '.product-list a',
        'a.plp-product__name-link'
      ]
      
      for (const selector of selectors) {
        const links = $search(selector)
        if (links.length > 0) {
          // Find first link that looks like a product page
          links.each((i, el) => {
            const href = $search(el).attr('href')
            if (href && href.includes('/p/') && href.includes('-')) {
              productUrl = href
              return false // break
            }
          })
          if (productUrl) {
            console.log('✅ Found product link with selector:', selector)
            break
          }
        }
      }
      
      if (!productUrl) {
        console.error('❌ Could not find product link')
        console.error('📄 Page title:', $search('title').text())
        console.error('🔗 Found', $search('a').length, 'total links')
        throw new Error('No products found for: ' + productName)
      }
      
      // At this point, TypeScript knows productUrl is a string (not null)
      const url: string = productUrl
      fullProductUrl = url.startsWith('http') 
        ? url 
        : `https://www.ikea.com${url}`
    }
    
    console.log('📄 Product page:', fullProductUrl)
    
    // Step 2: Get product page
    console.log('🌐 Fetching product page via Bright Data...')
    const productResponse = await axiosWithProxy.get(fullProductUrl)
    const $ = cheerio.load(productResponse.data)
    
    // Step 3: Extract product data
    console.log('📊 Extracting product data...')
    
    // Product name
    const name = $('.range-revamp-header-section__title--big').text().trim()
    
    // Product ID from URL
    const productIdMatch = fullProductUrl.match(/-(\d{8})\//)
    const productId = productIdMatch ? productIdMatch[1] : ''
    
    // Find PDF link
    let pdfUrl = ''
    $('a').each((i, el) => {
      const href = $(el).attr('href')
      if (href && href.includes('.pdf') && href.includes('assembly_instructions')) {
        pdfUrl = href.startsWith('http') ? href : `https://www.ikea.com${href}`
        return false // break
      }
    })
    
    // Dimensions
    const dimensions: any = {}
    $('.pip-product-dimensions__measurement').each((i, el) => {
      const label = $(el).find('.pip-product-dimensions__measurement-name').text().toLowerCase()
      const value = $(el).find('.pip-product-dimensions__measurement-value').text().trim()
      
      if (label.includes('width')) dimensions.width = value
      if (label.includes('height')) dimensions.height = value
      if (label.includes('depth')) dimensions.depth = value
    })
    
    // Images
    const images: string[] = []
    $('.pip-media-grid__media-image img').each((i, el) => {
      const src = $(el).attr('src')
      if (src && !src.includes('data:image')) {
        images.push(src)
      }
    })
    
    // Category
    const categoryLinks = $('.pip-breadcrumbs__item a')
    const category = categoryLinks.last().text().trim()
    
    console.log('✅ Product found:', name)
    console.log('🆔 Product ID:', productId)
    console.log('📐 Dimensions:', dimensions)
    console.log('📄 PDF URL:', pdfUrl || 'NOT FOUND')
    
    // Step 4: Download PDF if available
    let pdfPath = ''
    if (pdfUrl) {
      try {
        pdfPath = await downloadPDF(pdfUrl, productId)
      } catch (error: any) {
        console.warn('⚠️  PDF download failed, continuing without it:', error.message)
      }
    } else {
      console.warn('⚠️  No PDF found for this product')
    }
    
    // Step 5: Return in standard format
    const result: ScrapedProduct = {
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
    }
    
    console.log('✅ Scraping complete!')
    return result
    
  } catch (error: any) {
    console.error('❌ Scraping failed:', error.message)
    throw error
  }
}
