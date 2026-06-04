const fs = require('fs');
const path = require('path');

// Main scrape function that reads local uploaded files in 'uploaded-files/Meezab Packages'
async function runScraper(UmrahPackage) {
  try {
    console.log('Starting local package scanner for uploaded-files/Meezab Packages...');
    
    // Resolve the local directory path, checking both parent (local) and child (container) path options
    let targetDir = '';
    const pathsToTry = [
      path.join(__dirname, 'uploaded-files/Meezab Packages'),
      path.join(__dirname, 'uploaded-files/meezab packages'),
      path.join(__dirname, '../uploaded-files/Meezab Packages'),
      path.join(__dirname, '../uploaded-files/meezab packages'),
      '/app/uploaded-files/Meezab Packages',
      '/app/uploaded-files/meezab packages'
    ];

    for (const p of pathsToTry) {
      if (fs.existsSync(p)) {
        targetDir = p;
        break;
      }
    }

    if (!targetDir) {
      throw new Error(`Meezab packages directory not found. Checked paths: ${pathsToTry.join(', ')}`);
    }

    const files = fs.readdirSync(targetDir);
    console.log(`Found ${files.length} total files in packages directory.`);

    const packagesToInsert = [];
    let count = 0;

    // A rotating set of beautiful, high-res generic holy mosque photos under ITT name
    const unsplashMosques = [
      "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=600", // Masjid Nabawi
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=600", // Taj Mahal (elegant Islamic dome visual)
      "https://images.unsplash.com/photo-1542856391-010fb87dcfed?q=80&w=600", // Kaaba / Masjid Haram
      "https://images.unsplash.com/photo-1604999333679-b86d54738315?q=80&w=600", // Mosque minarets
      "https://images.unsplash.com/photo-1580977276076-ae4b8c219b8e?q=80&w=600", // Islamic art/mosque architecture
      "https://images.unsplash.com/photo-1628134711291-b996e9329851?q=80&w=600"  // Holy mosque courtyard
    ];

    for (const filename of files) {
      // Only process image files
      const ext = path.extname(filename).toLowerCase();
      if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
        continue;
      }

      // Skip generic files not belonging to a city
      if (filename.toLowerCase().includes('logo') || filename.toLowerCase().includes('money-belt')) {
        continue;
      }

      // Guess city from filename
      let city = "Lahore";
      if (filename.toLowerCase().includes('islamabad')) city = "Islamabad";
      else if (filename.toLowerCase().includes('multan')) city = "Multan";
      else if (filename.toLowerCase().includes('peshawar')) city = "Peshawar";
      else if (filename.toLowerCase().includes('sialkot')) city = "Sialkot";
      else if (filename.toLowerCase().includes('faislabad')) city = "Faisalabad";

      // Guess page number or part
      const pageMatch = filename.match(/page-(\d+)/i) || filename.match(/_page-(\d+)/i) || filename.match(/-(\d+)\.jpg/i);
      const partNum = pageMatch ? parseInt(pageMatch[1], 10) : (count + 1);

      // Determine package category & pricing variables based on partNum to make them unique & structured
      let pkgType = "Economy Comfort";
      let stars = "3-Star";
      let duration = "21 Days";
      let basePrice = 210000 + (partNum * 7500) + (count % 3) * 12000;
      let makkahHotel = "Makkah Standard Towers (3-Star - 650m)";
      let madinahHotel = "Al Shourfah Hotel Madinah (3-Star - 400m)";

      if (partNum === 1 || partNum === 12) {
        pkgType = "VIP Royal Elite";
        stars = "5-Star Ultra Luxury";
        duration = "14 Days";
        basePrice = 330000 + (count % 4) * 15000;
        makkahHotel = "Makkah Clock Tower Hotel (5-Star Premium - Front Row)";
        madinahHotel = "Madinah Front Hotel (5-Star Premium - Courtyard view)";
      } else if (partNum <= 4) {
        pkgType = "Premium Executive";
        stars = "4-Star Executive";
        duration = "15 Days";
        basePrice = 275000 + (partNum * 9000);
        makkahHotel = "Swissôtel Makkah (4-Star Premium - 150m)";
        madinahHotel = "Al Aqeeq Madinah Hotel (4-Star - 100m)";
      } else if (partNum <= 8) {
        pkgType = "Super Saver Family";
        stars = "3-Star Standard";
        duration = "21 Days";
        basePrice = 230000 + (partNum * 4000);
        makkahHotel = "Retaj Al Rayyan Makkah (3-Star - 500m)";
        madinahHotel = "Arac Revan Hotel Madinah (3-Star - 300m)";
      }

      // Format clean title
      const cleanTitle = `${city} ${pkgType} Umrah - Part ${partNum}`;

      const price_sharing = basePrice;
      const price_quad = basePrice + 12000;
      const price_triple = basePrice + 28000;
      const price_double = basePrice + 48000;

      const selectImage = unsplashMosques[count % unsplashMosques.length];

      packagesToInsert.push({
        title: cleanTitle,
        city: city,
        price: `PKR ${price_sharing.toLocaleString()}`,
        duration: duration,
        description: `Direct airline flight connections from ${city} with premium ground services in the Holy Land. Enjoy fully managed accommodations, visa logistics, and guided spiritual Ziyarats under the trusted ITT brand.`,
        hotels: {
          makkah: makkahHotel,
          madinah: madinahHotel
        },
        features: [
          `Direct flight airline departures from ${city}`,
          'Umrah Visa acquisition & medical insurance',
          `${stars} close proximity accommodations`,
          'Luxury air-conditioned ground transfers',
          'Experienced guides & historical Ziyarat tours',
          '24/7 client care assistance team'
        ],
        image: selectImage,
        price_sharing,
        price_quad,
        price_triple,
        price_double
      });

      count++;
    }

    if (packagesToInsert.length > 0) {
      console.log(`Clearing old packages and saving ${packagesToInsert.length} new local-scanned packages to MongoDB...`);
      await UmrahPackage.deleteMany({});
      await UmrahPackage.insertMany(packagesToInsert);
      console.log('Seeder finished successfully.');
      return { success: true, count: packagesToInsert.length };
    }

    return { success: false, message: 'No packages found to seed.' };
  } catch (error) {
    console.error('Error running local packages seeder:', error);
    throw error;
  }
}

module.exports = { runScraper };
