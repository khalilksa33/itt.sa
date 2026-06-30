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

const fs = require('fs');
const uploadedFilesPath = fs.existsSync(path.join(__dirname, '../uploaded-files'))
  ? path.join(__dirname, '../uploaded-files')
  : (fs.existsSync(path.join(__dirname, 'uploaded-files'))
      ? path.join(__dirname, 'uploaded-files')
      : (fs.existsSync('/app/uploaded-files')
          ? '/app/uploaded-files'
          : path.join(__dirname, '../uploadded-files')));
app.use('/uploaded-files', express.static(uploadedFilesPath));
console.log('[Server] Serving uploaded files from:', uploadedFilesPath);


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
  price_double: { type: Number },
  price_single: { type: Number },
  isActive: { type: Boolean, default: false }
});

const UmrahPackage = mongoose.model('UmrahPackage', UmrahPackageSchema);

const BookingSchema = new mongoose.Schema({
  packageId: { type: String, required: true },
  packageName: { type: String, required: true },
  roomingType: { type: String, required: true }, // 'sharing', 'quad', 'triple', 'double'
  pilgrimsCount: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  partnerId: { type: String }, // optional sub-agent linking
  isCustomized: { type: Boolean, default: false },
  customServices: {
    visa: { type: Boolean, default: true },
    tickets: { type: Boolean, default: true },
    ground: { type: Boolean, default: true },
    catering: { type: Boolean, default: true },
    accommodation: { type: Boolean, default: true }
  },
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
  travelDate: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const Booking = mongoose.model('Booking', BookingSchema);

const SubAgentSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  agencyName: { type: String, required: true },
  contactName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  licenseNo: { type: String },
  address: { type: String, required: true },
  experience: { type: Number, required: true },
  bio: { type: String },
  status: { type: String, default: 'Pending' },
  jvConsent: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const SubAgent = mongoose.model('SubAgent', SubAgentSchema);

const TeamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  designation: { type: String, required: true },
  office: { type: String, required: true },
  emails: [{ type: String }],
  phones: [{ type: String }],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const TeamMember = mongoose.model('TeamMember', TeamMemberSchema);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Successfully connected to MongoDB.');
    try {
      const count = await UmrahPackage.countDocuments({});
      if (count < 10) {
        console.log(`Only ${count} packages in DB (< 10). Running local file scraper...`);
        await runScraper(UmrahPackage);
      } else {
        console.log(`Database has ${count} packages. Skipping auto-scrape.`);
      }
    } catch (err) {
      console.error('Could not auto-run scraper on startup:', err.message);
    }

    try {
      const memberCount = await TeamMember.countDocuments({});
      if (memberCount === 0) {
        console.log('Seeding default team members into database...');
        await TeamMember.insertMany([
          {
            name: "Mr. Hafiz Laique Shahid",
            role: "Team Head",
            designation: "CEO",
            office: "Lahore Office",
            emails: ["ceo@itt.sa", "support@itt.sa"],
            phones: ["+92 300-0860633", "+966 50-086-0633"],
            isActive: true
          },
          {
            name: "Ahmad Hasan Marjan",
            role: "Executive Director",
            designation: "Executive Director",
            office: "Lahore Office",
            emails: ["director@itt.sa"],
            phones: ["+966 50-086-1820"],
            isActive: true
          },
          {
            name: "Mr. Muhammad Atif Zafar",
            role: "Operations",
            designation: "Manager Operations",
            office: "Madinah Al-Munawarah Head Office",
            emails: ["operations@itt.sa"],
            phones: ["+966 54 426 6932"],
            isActive: true
          },
          {
            name: "Syed Suleman Haider",
            role: "Human Resources",
            designation: "HR Manager",
            office: "Head Office",
            emails: ["hr@itt.sa"],
            phones: ["+966 50 685 8795"],
            isActive: true
          }
        ]);
      } else {
        // Ensure existing members have active property
        await TeamMember.updateMany({ isActive: { $exists: false } }, { isActive: true });
      }
    } catch (err) {
      console.error('Could not seed team members on startup:', err.message);
    }
  })
  .catch(err => console.error('MongoDB connection error:', err));

// API Routes

// Team CRUD API Routes
app.get('/api/team', async (req, res) => {
  try {
    const members = await TeamMember.find({}).sort({ createdAt: 1 });
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch team members.' });
  }
});

app.post('/api/team', async (req, res) => {
  try {
    const { name, role, designation, office, emails, phones, isActive } = req.body;
    if (!name || !role || !designation || !office) {
      return res.status(400).json({ error: 'Name, role, designation, and office are required.' });
    }
    const newMember = new TeamMember({
      name,
      role,
      designation,
      office,
      emails,
      phones,
      isActive: isActive === undefined ? true : isActive
    });
    await newMember.save();
    res.status(201).json({ success: true, member: newMember });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create team member.' });
  }
});

app.put('/api/team/:id', async (req, res) => {
  try {
    const { name, role, designation, office, emails, phones, isActive } = req.body;
    const updateData = { name, role, designation, office, emails, phones };
    if (isActive !== undefined) {
      updateData.isActive = isActive;
    }
    const updatedMember = await TeamMember.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    if (!updatedMember) return res.status(404).json({ error: 'Team member not found.' });
    res.json({ success: true, member: updatedMember });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update team member.' });
  }
});

app.delete('/api/team/:id', async (req, res) => {
  try {
    const deletedMember = await TeamMember.findByIdAndDelete(req.params.id);
    if (!deletedMember) return res.status(404).json({ error: 'Team member not found.' });
    res.json({ success: true, message: 'Team member deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete team member.' });
  }
});


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

// 2b. Get all inquiries (BI Dashboard)
app.get('/api/inquiries', async (req, res) => {
  try {
    const inquiries = await Inquiry.find({}).sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve inquiries.' });
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

// 4b. Force re-seed packages from local uploaded files (bypasses count check)
app.post('/api/packages/reseed', async (req, res) => {
  try {
    console.log('[Admin] Force reseed triggered via API...');
    const result = await runScraper(UmrahPackage);
    res.json({ success: true, ...result, path: uploadedFilesPath });
  } catch (error) {
    res.status(500).json({ error: 'Force reseed failed: ' + error.message });
  }
});

// 5. Submit a booking (Checkout)
app.post('/api/bookings', async (req, res) => {
  try {
    const { packageId, packageName, roomingType, pilgrimsCount, totalPrice, contact, pilgrims, partnerId, isCustomized, customServices } = req.body;
    if (!packageId || !packageName || !roomingType || !pilgrimsCount || !totalPrice || !contact || !pilgrims) {
      return res.status(400).json({ error: 'Missing required checkout information.' });
    }
    const newBooking = new Booking({
      packageId,
      packageName,
      roomingType,
      pilgrimsCount,
      totalPrice,
      partnerId,
      isCustomized: !!isCustomized,
      customServices: customServices || {
        visa: true,
        tickets: true,
        ground: true,
        catering: true,
        accommodation: true
      },
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

// 7. Verify staff credentials
app.post('/api/auth/login', (req, res) => {
  const { password } = req.body;
  const expectedPassword = process.env.STAFF_PASSWORD || 'admin123';
  if (password === expectedPassword) {
    return res.json({ success: true, token: 'staff-session-token' });
  }
  return res.status(401).json({ success: false, error: 'Invalid portal password.' });
});

// 7b. Get partners from scanned JV Contract PDFs in uploaded-files/partners
app.get('/api/partners/files', (req, res) => {
  try {
    const partnersDir = path.join(uploadedFilesPath, 'partners');
    if (!fs.existsSync(partnersDir)) {
      return res.json([]);
    }
    const files = fs.readdirSync(partnersDir);
    const parsedPartners = files
      .filter(f => f.endsWith('.pdf'))
      .map(f => {
        // Parse company name from filename
        let companyName = f.replace(' - JV Contract - Insight Travel N Tourism', '')
                           .replace('JV Contract Template - Insight Travel N Tourism', 'Template')
                           .replace('JV Insight Travel N Tourism Vs ', '')
                           .replace('.pdf', '')
                           .trim();
        
        // Remove trailing date like "-01-06-2026" or " - 18-5-2026"
        companyName = companyName.replace(/-\d{1,2}-\d{1,2}-\d{4}/, '')
                                 .replace(/\s*-\s*\d{1,2}-\d{1,2}-\d{4}/, '')
                                 .trim();
        
        return {
          filename: f,
          companyName: companyName,
          url: `/uploaded-files/partners/${encodeURIComponent(f)}`
        };
      });
    res.json(parsedPartners);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve partner files: ' + error.message });
  }
});

// 8. Submit partner sub-agent registration
app.post('/api/subagents', async (req, res) => {
  try {
    const { agencyName, contactName, email, phone, licenseNo, address, experience, bio, jvConsent } = req.body;
    if (!agencyName || !contactName || !email || !phone || !address || experience === undefined) {
      return res.status(400).json({ error: 'Missing required subagent fields.' });
    }
    const count = await SubAgent.countDocuments({});
    const year = new Date().getFullYear();
    const agentId = `AGT-${year}-${String(count + 1).padStart(4, '0')}`;

    const newAgent = new SubAgent({
      name: agentId,
      agencyName,
      contactName,
      email,
      phone,
      licenseNo,
      address,
      experience,
      bio,
      jvConsent: !!jvConsent
    });
    await newAgent.save();

    res.status(201).json({
      success: true,
      agent_id: agentId,
      agency_name: agencyName,
      message: 'Sub-agent registration application received.'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit agent application: ' + error.message });
  }
});

// 9. Get all sub-agents (staff only)
app.get('/api/subagents', async (req, res) => {
  try {
    const agents = await SubAgent.find({}).sort({ createdAt: -1 });
    res.json(agents);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve sub-agents.' });
  }
});

// 10. Update sub-agent status (staff only)
app.put('/api/subagents/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Approved', 'Suspended', 'Pending'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value.' });
    }
    const agent = await SubAgent.findOneAndUpdate({ name: req.params.id }, { status }, { new: true });
    if (!agent) {
      return res.status(404).json({ error: 'Sub-agent not found.' });
    }
    res.json({ success: true, agent });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update agent status: ' + error.message });
  }
});

// 11. Update package rates (staff only)
app.put('/api/packages/:code/rates', async (req, res) => {
  try {
    const { price_sharing, price_quad, price_triple, price_double, price_single } = req.body;
    
    // Find by ID first, then by title
    let pkg = await UmrahPackage.findById(req.params.code);
    if (!pkg) {
      pkg = await UmrahPackage.findOne({ title: req.params.code });
    }
    
    if (!pkg) {
      return res.status(404).json({ error: 'Package not found.' });
    }
    
    if (price_sharing !== undefined) pkg.price_sharing = price_sharing;
    if (price_quad !== undefined) pkg.price_quad = price_quad;
    if (price_triple !== undefined) pkg.price_triple = price_triple;
    if (price_double !== undefined) pkg.price_double = price_double;
    if (price_single !== undefined) pkg.price_single = price_single;
    
    // Auto-update standard price text
    if (price_sharing !== undefined) {
      pkg.price = `PKR ${price_sharing.toLocaleString()}`;
    }
    
    await pkg.save();
    res.json({ success: true, package: pkg });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update rates: ' + error.message });
  }
});

// 11b. Create new package
app.post('/api/packages', async (req, res) => {
  try {
    const { title, city, price, duration, description, hotels, features, image, price_sharing, price_quad, price_triple, price_double, price_single, isActive } = req.body;
    if (!title || !city || !duration || !hotels || !hotels.makkah || !hotels.madinah) {
      return res.status(400).json({ error: 'Title, departure city, duration, Makkah hotel, and Madinah hotel are required.' });
    }
    const newPkg = new UmrahPackage({
      title,
      city,
      price: price || (price_sharing ? `PKR ${price_sharing.toLocaleString()}` : 'PKR 0'),
      duration,
      description: description || '',
      hotels,
      features: features || [],
      image: image || '',
      price_sharing: price_sharing || 0,
      price_quad: price_quad || 0,
      price_triple: price_triple || 0,
      price_double: price_double || 0,
      price_single: price_single || 0,
      isActive: isActive === undefined ? false : isActive
    });
    await newPkg.save();
    res.status(201).json({ success: true, package: newPkg });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create package: ' + error.message });
  }
});

// 11c. Update full package details
app.put('/api/packages/:id', async (req, res) => {
  try {
    const { title, city, price, duration, description, hotels, features, image, price_sharing, price_quad, price_triple, price_double, price_single, isActive } = req.body;
    const updateData = {
      title,
      city,
      price: price || (price_sharing ? `PKR ${price_sharing.toLocaleString()}` : 'PKR 0'),
      duration,
      description,
      hotels,
      features,
      image,
      price_sharing,
      price_quad,
      price_triple,
      price_double,
      price_single
    };
    if (isActive !== undefined) {
      updateData.isActive = isActive;
    }
    const updatedPkg = await UmrahPackage.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updatedPkg) return res.status(404).json({ error: 'Package not found.' });
    res.json({ success: true, package: updatedPkg });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update package: ' + error.message });
  }
});

// 11d. Delete package
app.delete('/api/packages/:id', async (req, res) => {
  try {
    const deletedPkg = await UmrahPackage.findByIdAndDelete(req.params.id);
    if (!deletedPkg) return res.status(404).json({ error: 'Package not found.' });
    res.json({ success: true, message: 'Package deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete package: ' + error.message });
  }
});

// 12. Partner Login for Dashboard
app.post('/api/partner/login', async (req, res) => {
  try {
    const { agentId, phone } = req.body;
    if (!agentId || !phone) {
      return res.status(400).json({ error: 'Agent ID and Phone number are required.' });
    }
    const agent = await SubAgent.findOne({ name: agentId, phone: phone });
    if (!agent) {
      return res.status(401).json({ error: 'Invalid partner credentials.' });
    }
    if (agent.status !== 'Approved') {
      return res.status(403).json({ error: 'Your partner account is pending approval or suspended.' });
    }
    res.json({ success: true, agent });
  } catch (error) {
    res.status(500).json({ error: 'Login failed: ' + error.message });
  }
});

// 13. Get all bookings for a specific partner
app.get('/api/partner/bookings/:agentId', async (req, res) => {
  try {
    const bookings = await Booking.find({ partnerId: req.params.agentId }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve partner bookings.' });
  }
});

// 14. Customer Booking Lookup
app.post('/api/customer/lookup', async (req, res) => {
  try {
    const { query } = req.body; // Booking ID or passport number
    if (!query) {
      return res.status(400).json({ error: 'Please enter a Booking Reference ID or Passport Number.' });
    }

    let booking = null;
    if (mongoose.Types.ObjectId.isValid(query)) {
      booking = await Booking.findById(query);
    }
    if (!booking) {
      booking = await Booking.findOne({ 'pilgrims.passportNumber': query });
    }
    if (!booking) {
      return res.status(404).json({ error: 'No booking record found matching your query.' });
    }
    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ error: 'Lookup failed: ' + error.message });
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
