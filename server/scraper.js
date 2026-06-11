const fs = require('fs');
const path = require('path');

// Main scrape function that reads local uploaded files in 'uploaded-files/Meezab Packages'
async function runScraper(UmrahPackage) {
  try {
    console.log('Starting local package scanner for uploaded-files/Meezab Packages...');
    
    // Resolve the local directory path, checking both parent (local) and child (container) path options
    let targetDir = '';
    const pathsToTry = [
      path.join(__dirname, 'uploadded-files/umrah-packages'),
      path.join(__dirname, 'uploaded-files/umrah-packages'),
      path.join(__dirname, '../uploadded-files/umrah-packages'),
      path.join(__dirname, '../uploaded-files/umrah-packages'),
      '/app/uploadded-files/umrah-packages',
      '/app/uploaded-files/umrah-packages'
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

    // City-specific premium stock images mapping for exact city matching
    const cityImages = {
      "Islamabad": [
        "https://images.unsplash.com/photo-1602088113235-229c19758e9f?q=80&w=600", // Faisal Mosque, Islamabad
        "https://images.unsplash.com/photo-1595185966579-a78d06ab0e5e?q=80&w=600", // Faisal Mosque courtyard
        "https://images.unsplash.com/photo-1627063162354-94c65e4c0cb8?q=80&w=600"  // Margalla Hills / Islamabad view
      ],
      "Lahore": [
        "https://images.unsplash.com/photo-1608958415124-7f152ba85e2b?q=80&w=600", // Badshahi Mosque, Lahore
        "https://images.unsplash.com/photo-1584714268709-c3dd9c92bd37?q=80&w=600", // Lahore streets
        "https://images.unsplash.com/photo-1599818817290-b96238b7cb60?q=80&w=600"  // Walled City Lahore
      ],
      "Sialkot": [
        "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=600", // Elegant clock tower theme / Sialkot architecture
        "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=600"  // Sialkot landmark view
      ],
      "Peshawar": [
        "https://images.unsplash.com/photo-1626125345510-4603468eedfb?q=80&w=600", // Bab-e-Khyber Peshawar
        "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=600"  // Khyber gate scenic
      ],
      "Multan": [
        "https://images.unsplash.com/photo-1652701460390-8636fbcd53a1?q=80&w=600", // Blue tomb tiles Multan
        "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=600"  // Multan shrines art
      ],
      "Faisalabad": [
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600", // Elegant design Faisalabad clock tower feel
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=600"  // Faisalabad local aesthetic
      ],
      "Karachi": [
        "https://images.unsplash.com/photo-1618218168350-6e7c81151b64?q=80&w=600", // Mazar-e-Quaid, Karachi
        "https://images.unsplash.com/photo-1566908829550-e6551b00979b?q=80&w=600"  // Karachi sea view / beach
      ]
    };

    // A rotating set of beautiful, high-res generic holy mosque photos under ITT name (fallback)
    const fallbackMosques = [
      "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=600", // Masjid Nabawi
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=600", // Taj Mahal
      "https://images.unsplash.com/photo-1542856391-010fb87dcfed?q=80&w=600"  // Masjid Haram
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
      else if (filename.toLowerCase().includes('karachi') || filename.toLowerCase().includes('whatsapp-image')) city = "Karachi";

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

      // Select specific city image or rotate fallbacks
      const imageList = cityImages[city] || fallbackMosques;
      const selectImage = imageList[count % imageList.length];

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
