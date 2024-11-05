
import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  let browser;
  try {
    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36'
    );

    
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    let productName: string = 'Product name not found';
    let productPrice: string = 'Price not found';
    let productImage: string = 'Image not found';
    let currencySymbol: string = '';

    if (url.includes('amazon.com')) {
      
      currencySymbol = '$';

    
      await page.waitForSelector('#productTitle', { timeout: 10000 });
      productName = await page.$eval('#productTitle', el => el.textContent?.trim() || 'Product name not found');

      const priceSelectors = [
        '.a-price-whole',
        '#priceblock_ourprice',
        '#priceblock_dealprice',
        '#corePriceDisplay_desktop_feature_div .a-price .a-offscreen',
        '#apex_desktop .a-price .a-offscreen'
      ];
      for (const selector of priceSelectors) {
        if (await page.$(selector)) {
          productPrice = await page.$eval(selector, el => el.textContent?.replace(/[^0-9.]/g, '') || 'Price not found');
          break;
        }
      }

      const imageSelector = '#landingImage';
      if (await page.$(imageSelector)) {
        productImage = await page.$eval(imageSelector, el => (el as HTMLImageElement).src || 'Image not found');
      }

    } else if (url.includes('amazon.in')) {
    
      currencySymbol = '₹';

    
      await page.waitForSelector('#productTitle', { timeout: 10000 });
      productName = await page.$eval('#productTitle', el => el.textContent?.trim() || 'Product name not found');

      const priceSelectors = [
        '.a-price-whole',
        '#priceblock_ourprice',
        '#priceblock_dealprice',
        '#corePriceDisplay_desktop_feature_div .a-price .a-offscreen',
        '#apex_desktop .a-price .a-offscreen'
      ];
      for (const selector of priceSelectors) {
        if (await page.$(selector)) {
          productPrice = await page.$eval(selector, el => el.textContent?.replace(/[^0-9.]/g, '') || 'Price not found');
          break;
        }
      }

      const imageSelector = '#landingImage';
      if (await page.$(imageSelector)) {
        productImage = await page.$eval(imageSelector, el => (el as HTMLImageElement).src || 'Image not found');
      }

    } else if (url.includes('flipkart.com')) {
      
      currencySymbol = '₹';

      
      await page.waitForSelector('span.VU-ZEz', { timeout: 10000 });
      productName = await page.$eval('span.VU-ZEz', el => el.textContent?.trim() || 'Product name not found');

      const priceSelector = 'div.Nx9bqj.CxhGGd';
      if (await page.$(priceSelector)) {
        productPrice = await page.$eval(priceSelector, el => el.textContent?.replace(/[^0-9.]/g, '') || 'Price not found');
      }

      const flipkartImageSelector = 'img.DByuf4.IZexXJ.jLEJ7H';
      if (await page.$(flipkartImageSelector)) {
        productImage = await page.$eval(flipkartImageSelector, el => (el as HTMLImageElement).src || 'Image not found');
      }
    } else {
      
      await browser.close();
      return NextResponse.json({ error: 'Unsupported URL. Please provide an Amazon or Flipkart product URL.' }, { status: 400 });
    }

    
    const formattedPrice = currencySymbol + productPrice;

    await browser.close();
    return NextResponse.json({ productName, productPrice: formattedPrice, productImage });
  } catch (error) {
    if (browser) await browser.close();
    const errorMessage = (error as Error)?.message || 'An unknown error occurred';
    console.error('An error occurred while scraping:', errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
