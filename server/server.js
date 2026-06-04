const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const { runScraper } = require('./scraper');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/scraped_packages', express.static(path.join(__dirname, 'public/scraped_packages')));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Successfully connected to MongoDB.');
    try {
      const count = await UmrahPackage.countDocuments({});
      if (count === 0) {
        console.log('No packages found in database. Running meezab scraper...');
        await runScraper(UmrahPackage);
      }
    } catch (err) {
      console.error('Could not auto-run scraper on startup:', err.message);
    }
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Mongoose Schemas & Models
const InquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  service: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Inquiry = mongoose.model('Inquiry', InquirySchema);

const UmrahPackageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  city: { type: String, required: true },
  price: { type: String, required: true },
  duration: { type: String, required: true },
  description: { type: String, required: true },
  hotels: {
    makkah: { type: String, required: true },
    madinah: { type: String, required: true }
  },
  features: [{ type: String }],
  image: { type: String },
  price_sharing: { type: Number },
  price_quad: { type: Number },
  price_triple: { type: Number },
  price_double: { type: Number }
});

const UmrahPackage = mongoose.model('UmrahPackage', UmrahPackageSchema);

const BookingSchema = new mongoose.Schema({
  packageId: { type: String, required: true },
  packageName: { type: String, required: true },
  roomingType: { type: String, required: true }, // 'sharing', 'quad', 'triple', 'double'
  pilgrimsCount: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  contact: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }
  },
  pilgrims: [{
    name: { type: String, required: true },
    passportNumber: { type: String, required: true }
  }],
  status: { type: String, default: 'Confirmed - Pending Payment' },
  createdAt: { type: Date, default: Date.now }
});

const Booking = mongoose.model('Booking', BookingSchema);

// API Routes

// 1. Get all packages
app.get('/api/packages', async (req, res) => {
  try {
    const packages = await UmrahPackage.find({});
    res.json(packages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch packages.' });
  }
});

// 2. Submit an inquiry
app.post('/api/inquiries', async (req, res) => {
  try {
    const { name, email, phone, service, message } = req.body;
    if (!name || !email || !phone || !service || !message) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
    const newInquiry = new Inquiry({ name, email, phone, service, message });
    await newInquiry.save();
    res.status(201).json({ success: true, message: 'Inquiry successfully saved to database.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save inquiry.' });
  }
});

// 3. Seed initial Meezab Group packages
app.post('/api/packages/seed', async (req, res) => {
  try {
    // Clear existing packages
    await UmrahPackage.deleteMany({});

    const seedPackages = [
      {
        title: "Lahore VIP Umrah Package",
        city: "Lahore",
        price: "PKR 310,000",
        duration: "15 Days",
        description: "Experience absolute peace of mind with our signature Lahore VIP Package. Designed for comfort, offering premium 5-star accommodations right next to the holy Harams and executive transport services.",
        hotels: {
          makkah: "Makkah Clock Tower Hotel (5-Star)",
          madinah: "Madinah Front Hotel (5-Star)"
        },
        features: [
          "Direct flights from Lahore (LHE)",
          "Umrah Visa processing & insurance",
          "5-Star hotel stays close to Haram",
          "VIP private SUV transportation",
          "Buffet breakfast & dinner included",
          "Guided Ziyarat tours in Makkah & Madinah"
        ],
        image: "https://meezabgroup.com/wp-content/uploads/2025/07/Lahore-Group-Pkgs_page-0001.jpg",
        price_sharing: 274850,
        price_quad: 283475,
        price_triple: 290950,
        price_double: 305325
      },
      {
        title: "Islamabad Elite Umrah Package",
        city: "Islamabad",
        price: "PKR 285,000",
        duration: "15 Days",
        description: "Our premium package out of Islamabad features selected 4-star properties providing an optimal mix of religious proximity and luxurious comfort at highly competitive rates.",
        hotels: {
          makkah: "Swissôtel Makkah (4-Star)",
          madinah: "Al Aqeeq Madinah Hotel (4-Star)"
        },
        features: [
          "Direct flights from Islamabad (ISB)",
          "Visa acquisition & ground logistics",
          "Comfortable 4-Star hotels within 300m",
          "Luxury shared air-conditioned coach transfers",
          "Catering plans available on request",
          "Complete historical Ziyarat guided program"
        ],
        image: "https://meezabgroup.com/wp-content/uploads/2025/07/Islamabad-Group-Pkg-_page-0001.jpg",
        price_sharing: 312800,
        price_quad: 324875,
        price_triple: 345575,
        price_double: 387550
      },
      {
        title: "Faisalabad Economy Plus Package",
        city: "Faisalabad",
        price: "PKR 215,000",
        duration: "21 Days",
        description: "Extended spiritual retreat designed for families. Stay in comfortable, clean, and modern 3-star standard accommodations with easily accessible transport links.",
        hotels: {
          makkah: "Standard Makkah Towers (3-Star)",
          madinah: "Al Shourfah Hotel Madinah (3-Star)"
        },
        features: [
          "Flights from Faisalabad (LYP) with stops",
          "Complete visa processing & assistance",
          "21 Days total duration (10 Makkah / 11 Madinah)",
          "Clean hotels within 600m - 800m of the Haram",
          "24/7 dedicated local staff support",
          "Standard ground transportation"
        ],
        image: "https://meezabgroup.com/wp-content/uploads/2025/08/Faislabad-Group-Pkgs-_page-0001.jpg",
        price_sharing: 215000,
        price_quad: 225000,
        price_triple: 235000,
        price_double: 255000
      },
      {
        title: "Peshawar Executive Umrah Package",
        city: "Peshawar",
        price: "PKR 245,000",
        duration: "15 Days",
        description: "Specially tailored for our pilgrims from KP, offering direct travel convenience, highly rated hotels, and dedicated local guide assistance throughout the sacred rituals.",
        hotels: {
          makkah: "Retaj Al Rayyan Makkah (4-Star)",
          madinah: "Arac Revan Hotel Madinah (4-Star)"
        },
        features: [
          "Convenient flights from Peshawar (PEW)",
          "Hassle-free visa & insurance handling",
          "Premium properties within 400m",
          "Guided tour of Islamic heritage sites",
          "24/7 on-call customer care in KSA",
          "Comfortable group airport and intercity transfers"
        ],
        image: "https://meezabgroup.com/wp-content/uploads/2025/07/Peshawar-Group-Pkgs_page-0001.jpg",
        price_sharing: 245000,
        price_quad: 255000,
        price_triple: 265000,
        price_double: 285000
      }
    ];

    await UmrahPackage.insertMany(seedPackages);
    res.json({ success: true, message: 'Umrah packages seeded successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to seed database: ' + error.message });
  }
});

// 4. Scrape meezab site packages
app.post('/api/packages/scrape', async (req, res) => {
  try {
    const result = await runScraper(UmrahPackage);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Scraper failed: ' + error.message });
  }
});

// 5. Submit a booking (Checkout)
app.post('/api/bookings', async (req, res) => {
  try {
    const { packageId, packageName, roomingType, pilgrimsCount, totalPrice, contact, pilgrims } = req.body;
    if (!packageId || !packageName || !roomingType || !pilgrimsCount || !totalPrice || !contact || !pilgrims) {
      return res.status(400).json({ error: 'Missing required checkout information.' });
    }
    const newBooking = new Booking({
      packageId,
      packageName,
      roomingType,
      pilgrimsCount,
      totalPrice,
      contact,
      pilgrims
    });
    await newBooking.save();
    res.status(201).json({ success: true, bookingId: newBooking._id, message: 'Booking created successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process booking: ' + error.message });
  }
});

// 6. Get all bookings
app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find({}).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve bookings.' });
  }
});

// Root Route
app.get('/', (req, res) => {
  res.send('Insight Travel & Tourism Backend API is running.');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
