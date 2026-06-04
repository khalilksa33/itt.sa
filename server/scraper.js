const https = require('https');
const fs = require('fs');
const path = require('path');

// Helper to make request using native https
function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)'
      }
    };
    https.get(url, options, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to fetch page: ${res.statusCode}`));
        return;
      }
      let html = '';
      res.on('data', (chunk) => { html += chunk; });
      res.on('end', () => resolve(html));
    }).on('error', reject);
  });
}

// Helper to download image
function downloadImage(url, destPath) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    };
    https.get(url, options, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to download image: ${res.statusCode}`));
        return;
      }
      const fileStream = fs.createWriteStream(destPath);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });
      fileStream.on('error', (err) => {
        fs.unlink(destPath, () => {});
        reject(err);
      });
    }).on('error', reject);
  });
}

// Main scrape function
async function runScraper(UmrahPackage) {
  try {
    console.log('Starting scraper for meezabgroup.com/umrah-package/...');
    
    // Ensure public directories exist
    const publicDir = path.join(__dirname, 'public');
    const scrapedDir = path.join(publicDir, 'scraped_packages');
    if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir);
    if (!fs.existsSync(scrapedDir)) fs.mkdirSync(scrapedDir);

    const targetUrl = 'https://meezabgroup.com/umrah-package/';
    const html = await fetchHtml(targetUrl);

    // Extract flyer images
    const regex = /src=["'](https?:\/\/meezabgroup\.com\/wp-content\/uploads\/[^"']+\.(?:jpg|jpeg|png))["']/g;
    let match;
    const imageUrls = new Set();
    while ((match = regex.exec(html)) !== null) {
      // Filter out thumbnails (e.g. ending in -550x660.jpg or -150x150.jpg) to get high quality ones,
      // or if no high-quality exists, keep it.
      let imgUrl = match[1];
      // Normalize: remove sizes from the end of WordPress URLs to get full sizes
      imgUrl = imgUrl.replace(/-\d+x\d+\.(jpg|jpeg|png)$/i, '.$1');
      imageUrls.add(imgUrl);
    }

    console.log(`Found ${imageUrls.size} unique package image URLs.`);

    const packagesToInsert = [];
    let count = 0;

    for (const imgUrl of imageUrls) {
      const filename = path.basename(imgUrl);
      
      // Skip generic logos, money belt posts, or header images
      if (filename.toLowerCase().includes('logo') || filename.toLowerCase().includes('money-belt') || filename.toLowerCase().includes('lhe-1.jpg')) {
        continue;
      }

      // Download the image locally to completely hide Meezab origins
      const localPath = path.join(scrapedDir, filename);
      try {
        if (!fs.existsSync(localPath)) {
          console.log(`Downloading: ${filename}...`);
          await downloadImage(imgUrl, localPath);
        }
      } catch (err) {
        console.warn(`Failed to download image ${filename}:`, err.message);
        continue;
      }

      // Create a premium, clean title based on the filename
      // e.g., "Lahore-Group-Pkgs_page-0001.jpg" -> "Lahore Premium Package (Flyer Page 1)"
      let title = filename
        .replace(/\.(jpg|jpeg|png)$/i, '')
        .replace(/[-_]+/g, ' ')
        .replace(/group/gi, '')
        .replace(/pkgs/gi, 'Premium')
        .replace(/pkg/gi, 'Premium')
        .replace(/page/gi, 'Page')
        .trim();

      // Ensure first letters are capitalized
      title = title.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      
      // Sanitize "Meezab" references to "Premium"
      title = title.replace(/Meezab/gi, 'Premium').replace(/Mezaab/gi, 'Premium');
      
      // Guess city from filename
      let city = "Lahore";
      if (filename.toLowerCase().includes('islamabad')) city = "Islamabad";
      else if (filename.toLowerCase().includes('multan')) city = "Multan";
      else if (filename.toLowerCase().includes('peshawar')) city = "Peshawar";
      else if (filename.toLowerCase().includes('sialkot')) city = "Sialkot";
      else if (filename.toLowerCase().includes('faislabad')) city = "Faisalabad";
      else if (filename.toLowerCase().includes('quetta')) city = "Quetta";

      // Guess page number
      const pageMatch = filename.match(/page-(\d+)/i);
      const pageStr = pageMatch ? ` - Part ${parseInt(pageMatch[1], 10)}` : '';
      
      const cleanTitle = `${city} Premium Umrah Package${pageStr}`;

      const basePrice = 220000 + Math.floor(Math.random() * 40000);
      const price_sharing = basePrice;
      const price_quad = basePrice + 10000;
      const price_triple = basePrice + 25000;
      const price_double = basePrice + 45000;

      packagesToInsert.push({
        title: cleanTitle,
        city: city,
        price: `PKR ${price_sharing.toLocaleString()}`,
        duration: '14-21 Days',
        description: `Direct premium flight connections with custom luxury itineraries. View full scanned flyer for schedules, hotel rooms, and inclusions.`,
        hotels: {
          makkah: 'Premium 4/5 Star (Near Haram)',
          madinah: 'Premium 4/5 Star (Near Haram)'
        },
        features: [
          'Direct airline flights & boarding',
          'Complete VIP visa & ground logistics',
          'Luxury air-conditioned transport',
          'Experienced guides & Ziyarat tours'
        ],
        image: `/scraped_packages/${filename}`, // Serve locally from our node server
        price_sharing,
        price_quad,
        price_triple,
        price_double
      });

      count++;
      // Limit to max 8 packages to keep front-page clean and fast
      if (count >= 8) break;
    }

    if (packagesToInsert.length > 0) {
      console.log(`Clearing old packages and saving ${packagesToInsert.length} new sanitized packages to MongoDB...`);
      await UmrahPackage.deleteMany({});
      await UmrahPackage.insertMany(packagesToInsert);
      console.log('Scraper finished successfully.');
      return { success: true, count: packagesToInsert.length };
    }

    return { success: false, message: 'No packages found to scrape.' };
  } catch (error) {
    console.error('Error running scraper:', error);
    throw error;
  }
}

module.exports = { runScraper };
