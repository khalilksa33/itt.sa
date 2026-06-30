import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';


interface UmrahPackage {
  _id?: string;
  title: string;
  city: string;
  price: string;
  duration: string;
  description: string;
  hotels: {
    makkah: string;
    madinah: string;
  };
  features: string[];
  image?: string;
  price_sharing?: number;
  price_quad?: number;
  price_triple?: number;
  price_double?: number;
  price_single?: number;
  isActive?: boolean;
}

interface Pilgrim {
  name: string;
  passportNumber: string;
}

interface SubAgent {
  name: string;
  agencyName: string;
  contactName: string;
  email: string;
  phone: string;
  licenseNo?: string;
  address: string;
  experience: number;
  bio?: string;
  status: string;
  jvConsent?: boolean;
  createdAt: string;
}

interface TeamMember {
  _id?: string;
  name: string;
  role: string;
  designation: string;
  office: string;
  emails: string[];
  phones: string[];
  isActive?: boolean;
  createdAt?: string;
}

const fallbackTeam: TeamMember[] = [
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
    emails: ["m@iicc.sa"],
    phones: ["+966 50-086-1820"],
    isActive: true
  },
  {
    name: "Mr. Muhammad Atif Zafar",
    role: "Operations",
    designation: "Manager Operations",
    office: "Madinah Al-Munawarah Head Office",
    emails: ["z@itt.sa"],
    phones: ["+966 54 426 6932"],
    isActive: true
  },
  {
    name: "Syed Suleman Haider",
    role: "Human Resources",
    designation: "HR Manager",
    office: "Head Office",
    emails: ["hr@iicc.sa"],
    phones: ["+966 50 685 8795"],
    isActive: true
  }
];

const fallbackPackages: UmrahPackage[] = [
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
      "VIP private SUV transportation"
    ],
    price_sharing: 274850,
    price_quad: 283475,
    price_triple: 290950,
    price_double: 305325,
    price_single: 450000
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
      "Luxury shared air-conditioned coach transfers"
    ],
    price_sharing: 312800,
    price_quad: 324875,
    price_triple: 345575,
    price_double: 387550,
    price_single: 520000
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
    price_sharing: 215000,
    price_quad: 225000,
    price_triple: 235000,
    price_double: 255000,
    price_single: 350000
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
    price_sharing: 245000,
    price_quad: 255000,
    price_triple: 265000,
    price_double: 285000,
    price_single: 390000
  },
  {
    title: "Karachi Economy Comfort Package",
    city: "Karachi",
    price: "PKR 195,000",
    duration: "15 Days",
    description: "Value-packed pilgrimage starting from Karachi. Enjoy budget-friendly yet clean lodging with regular shuttle services to the Haram gates.",
    hotels: {
      makkah: "Al Kiswah Towers Makkah (3-Star)",
      madinah: "Dar Al Naeem Madinah (3-Star)"
    },
    features: [
      "Direct flights from Karachi (KHI)",
      "Visa processing and basic medical insurance",
      "Clean rooms with 24/7 Haram shuttle services",
      "Ziyarat tours in Makkah and Madinah included",
      "Dedicated airport meet and assist service"
    ],
    price_sharing: 195000,
    price_quad: 205000,
    price_triple: 215000,
    price_double: 235000,
    price_single: 320000
  },
  {
    title: "Multan Premium Umrah Package",
    city: "Multan",
    price: "PKR 260,000",
    duration: "15 Days",
    description: "Comfortable spiritual journey from the City of Saints. Premium 4-star lodging closer to the Harams with buffet meal options available.",
    hotels: {
      makkah: "Swissôtel Makkah (4-Star)",
      madinah: "Al Aqeeq Madinah Hotel (4-Star)"
    },
    features: [
      "Convenient flights from Multan (MUX)",
      "Express visa processing & flight booking",
      "Luxury accommodation within walking distance",
      "Private air-conditioned bus transfers",
      "Complete historical Ziyarat program"
    ],
    price_sharing: 260000,
    price_quad: 270000,
    price_triple: 285000,
    price_double: 310000,
    price_single: 430000
  },
  {
    title: "Sialkot Saver Umrah Package",
    city: "Sialkot",
    price: "PKR 225,000",
    duration: "21 Days",
    description: "Affordable and extensive 3-star package departing from Sialkot. Ideal for families looking for an extended stay in the holy cities.",
    hotels: {
      makkah: "Standard Makkah Towers (3-Star)",
      madinah: "Al Shourfah Hotel Madinah (3-Star)"
    },
    features: [
      "Departures from Sialkot International Airport (SKT)",
      "Visa and complete logistical assistance",
      "Clean standard hotels within 500m of the outer courtyards",
      "Guided spiritual group tours in KSA",
      "Complimentary Zamzam water bottle distribution"
    ],
    price_sharing: 225000,
    price_quad: 235000,
    price_triple: 245000,
    price_double: 265000,
    price_single: 360000
  }
];


export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [theme, setTheme] = useState<'gold' | 'emerald' | 'sapphire' | 'purple'>(
    (localStorage.getItem('theme') as any) || 'gold'
  );
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);

  const [packages, setPackages] = useState<UmrahPackage[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // BI Dashboard states
  const [bookings, setBookings] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [subagents, setSubagents] = useState<SubAgent[]>([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalSales: 0,
    totalCommissions: 0,
    bookingsCount: 0,
    inquiriesCount: 0,
    packagesCount: 0
  });

  const [exchangeRates, setExchangeRates] = useState({
    sarToPkr: 74.5,
    usdToPkr: 278.0,
    usdToSar: 3.73,
    aedToPkr: 75.7,
    usdToAed: 3.67,
    isLive: false
  });

  const [displayCurrency, setDisplayCurrency] = useState<'PKR' | 'USD' | 'SAR' | 'AED'>('PKR');

  const formatConvertedPrice = (priceInPkr: number, currency: 'PKR' | 'USD' | 'SAR' | 'AED') => {
    if (!priceInPkr) return 'N/A';
    switch (currency) {
      case 'USD':
        return `USD ${(priceInPkr / exchangeRates.usdToPkr).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
      case 'SAR':
        return `SAR ${(priceInPkr / exchangeRates.sarToPkr).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
      case 'AED':
        return `AED ${(priceInPkr / exchangeRates.aedToPkr).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
      case 'PKR':
      default:
        return `PKR ${priceInPkr.toLocaleString()}`;
    }
  };

  const formatShortPrice = (priceInPkr: number, currency: 'PKR' | 'USD' | 'SAR' | 'AED') => {
    if (!priceInPkr) return 'N/A';
    switch (currency) {
      case 'USD':
        return `$${(priceInPkr / exchangeRates.usdToPkr).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
      case 'SAR':
        return `SR ${(priceInPkr / exchangeRates.sarToPkr).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
      case 'AED':
        return `DH ${(priceInPkr / exchangeRates.aedToPkr).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
      case 'PKR':
      default:
        return `${(priceInPkr / 1000).toFixed(0)}k`;
    }
  };

  useEffect(() => {
    fetch('https://open.er-api.com/v6/latest/USD')
      .then(res => res.json())
      .then(data => {
        if (data && data.rates && data.rates.PKR && data.rates.SAR && data.rates.AED) {
          const pkr = data.rates.PKR;
          const sar = data.rates.SAR;
          const aed = data.rates.AED;
          setExchangeRates({
            sarToPkr: pkr / sar,
            usdToPkr: pkr,
            usdToSar: sar,
            aedToPkr: pkr / aed,
            usdToAed: aed,
            isLive: true
          });
        }
      })
      .catch(err => console.warn('Could not fetch live exchange rates, using budget defaults:', err));
  }, []);

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('staff_token') === 'staff-session-token';
  });

  // Lead Inquiry form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error' | 'info' | null; message: string }>({
    type: null,
    message: ''
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // E-commerce Checkout Modal States
  const [selectedPkg, setSelectedPkg] = useState<UmrahPackage | null>(null);
  const [roomingType, setRoomingType] = useState<'sharing' | 'quad' | 'triple' | 'double'>('sharing');
  const [pilgrimsCount, setPilgrimsCount] = useState<number>(1);
  const [contactInfo, setContactInfo] = useState({ name: '', email: '', phone: '' });
  const [pilgrims, setPilgrims] = useState<Pilgrim[]>([{ name: '', passportNumber: '' }]);
  const [partnerId, setPartnerId] = useState('');
  const [packageMode, setPackageMode] = useState<'complete' | 'customized'>('complete');
  const [travelDate, setTravelDate] = useState<string>('');
  const [currentCalDate, setCurrentCalDate] = useState<Date>(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const [customServices, setCustomServices] = useState({
    visa: true,
    tickets: true,
    ground: true,
    catering: true,
    accommodation: true
  });
  const [bookingStatus, setBookingStatus] = useState<{ type: 'success' | 'error' | 'info' | null; message: string; bookingId?: string }>({
    type: null,
    message: ''
  });

  const BACKEND_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : '';

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/packages`)
      .then(res => {
        if (!res.ok) throw new Error("API status error");
        return res.json();
      })
      .then(data => {
        if (data && data.length > 0) {
          setPackages(data);
        } else {
          setPackages(fallbackPackages);
        }
        setLoading(false);
      })
      .catch(err => {
        console.warn('Backend server unreachable, rendering fallback packages:', err);
        setPackages(fallbackPackages);
        setLoading(false);
      });
  }, [BACKEND_URL]);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/team`)
      .then(res => {
        if (!res.ok) throw new Error("API status error");
        return res.json();
      })
      .then(data => {
        if (data && data.length > 0) {
          setTeamMembers(data);
        } else {
          setTeamMembers(fallbackTeam);
        }
      })
      .catch(err => {
        console.warn('Backend server unreachable, rendering fallback team:', err);
        setTeamMembers(fallbackTeam);
      });
  }, [BACKEND_URL]);

  useEffect(() => {
    if (isAuthenticated) {
      // Load BI dashboard data
      fetch(`${BACKEND_URL}/api/bookings`)
        .then(res => res.json())
        .then(data => {
          setBookings(data);
          const total = data.reduce((sum: number, b: any) => sum + (b.totalPrice || 0), 0);
          setDashboardStats(prev => ({
            ...prev,
            totalSales: total,
            totalCommissions: total * 0.05,
            bookingsCount: data.length
          }));
        })
        .catch(err => console.error("Error fetching bookings:", err));

      fetch(`${BACKEND_URL}/api/inquiries`)
        .then(res => res.json())
        .then(data => {
          setInquiries(data);
          setDashboardStats(prev => ({
            ...prev,
            inquiriesCount: data.length
          }));
        })
        .catch(err => console.error("Error fetching inquiries:", err));

      fetch(`${BACKEND_URL}/api/subagents`)
        .then(res => res.json())
        .then(data => {
          setSubagents(data);
        })
        .catch(err => console.error("Error fetching subagents:", err));

      setDashboardStats(prev => ({
        ...prev,
        packagesCount: packages.length
      }));
    }
  }, [isAuthenticated, BACKEND_URL, packages]);

  const navigateTo = (path: string, hash?: string) => {
    setMobileMenuOpen(false);
    setSearchQuery('');
    if (path === '/' && hash) {
      if (location.pathname === '/') {
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate('/');
        setTimeout(() => {
          const el = document.getElementById(hash);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    } else {
      navigate(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('staff_token');
    setIsAuthenticated(false);
    navigateTo('/');
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus({ type: 'info', message: 'Sending your inquiry...' });

    fetch(`${BACKEND_URL}/api/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      .then(res => {
        if (!res.ok) throw new Error("Server error");
        return res.json();
      })
      .then(() => {
        setSubmitStatus({
          type: 'success',
          message: 'Thank you! Your inquiry details have been saved successfully. Our team will get back to you shortly.'
        });
        setFormData({ name: '', email: '', phone: '', service: '', message: '' });
      })
      .catch(err => {
        console.error('Inquiry submit failed:', err);
        setSubmitStatus({
          type: 'error',
          message: 'Unable to connect to the backend server. Please try again later.'
        });
      });
  };

  const openBookingModal = (pkg: UmrahPackage) => {
    setSelectedPkg(pkg);
    setRoomingType('sharing');
    setPilgrimsCount(1);
    setContactInfo({ name: '', email: '', phone: '' });
    setPilgrims([{ name: '', passportNumber: '' }]);
    setPartnerId('');
    setPackageMode('complete');
    setTravelDate('');
    setCurrentCalDate(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
    setCustomServices({ visa: true, tickets: true, ground: true, catering: true, accommodation: true });
    setBookingStatus({ type: null, message: '' });
  };

  const handlePilgrimCountChange = (count: number) => {
    const newCount = Math.max(1, count);
    setPilgrimsCount(newCount);
    setPilgrims(prev => {
      const copy = [...prev];
      if (copy.length < newCount) {
        while (copy.length < newCount) {
          copy.push({ name: '', passportNumber: '' });
        }
      } else if (copy.length > newCount) {
        copy.splice(newCount);
      }
      return copy;
    });
  };

  const handlePilgrimFieldChange = (index: number, field: keyof Pilgrim, value: string) => {
    setPilgrims(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const getPricePerPilgrim = (pkg: UmrahPackage): number => {
    let base = 270000;
    switch (roomingType) {
      case 'sharing': base = pkg.price_sharing || 274850; break;
      case 'quad': base = pkg.price_quad || 283475; break;
      case 'triple': base = pkg.price_triple || 290950; break;
      case 'double': base = pkg.price_double || 305325; break;
    }
    if (packageMode === 'customized') {
      if (!customServices.visa) base -= 45000;
      if (!customServices.tickets) base -= 110000;
      if (!customServices.ground) base -= 30000;
      if (!customServices.catering) base -= 25000;
      if (!customServices.accommodation) base -= 80000;
      base = Math.max(base, 10000); // Minimum processing fee of PKR 10k
    }
    return base;
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPkg) return;
    if (!travelDate) {
      setBookingStatus({ type: 'error', message: 'Please select a departure travel date from the dual calendars.' });
      return;
    }

    setBookingStatus({ type: 'info', message: 'Creating your reservation...' });
    const total = getPricePerPilgrim(selectedPkg) * pilgrimsCount;

    const payload = {
      packageId: selectedPkg._id || 'fallback_id',
      packageName: selectedPkg.title,
      roomingType,
      pilgrimsCount,
      totalPrice: total,
      contact: contactInfo,
      pilgrims,
      partnerId: partnerId.trim() || undefined,
      isCustomized: packageMode === 'customized',
      travelDate: travelDate || undefined,
      customServices: packageMode === 'customized' ? customServices : {
        visa: true,
        tickets: true,
        ground: true,
        catering: true,
        accommodation: true
      }
    };

    fetch(`${BACKEND_URL}/api/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => {
        if (!res.ok) throw new Error("Order creation failed");
        return res.json();
      })
      .then(data => {
        setBookingStatus({
          type: 'success',
          message: 'Booking Created! Your reservation has been verified and registered. Please transfer payment to our bank account or visit our office to finalize documents.',
          bookingId: data.bookingId
        });
      })
      .catch(err => {
        console.error('Booking save failed:', err);
        setBookingStatus({
          type: 'error',
          message: 'Database connection error. We have cached your checkout locally. Our billing department will contact you directly.'
        });
      });
  };
  const themesObj = {
    gold: {
      accent: '#c5a059',
      accentHover: '#b48e47',
      primary: '#05080a',
      cardDark: '#0e1217',
      rgbAccent: '197, 160, 89',
      rgbPrimary: '5, 8, 10'
    },
    emerald: {
      accent: '#10b981',
      accentHover: '#059669',
      primary: '#040806',
      cardDark: '#08120d',
      rgbAccent: '16, 185, 129',
      rgbPrimary: '4, 8, 6'
    },
    sapphire: {
      accent: '#3b82f6',
      accentHover: '#2563eb',
      primary: '#030712',
      cardDark: '#0b1329',
      rgbAccent: '59, 130, 246',
      rgbPrimary: '3, 7, 18'
    },
    purple: {
      accent: '#a855f7',
      accentHover: '#7e22ce',
      primary: '#0b0712',
      cardDark: '#160e24',
      rgbAccent: '168, 85, 247',
      rgbPrimary: '11, 7, 18'
    }
  };

  const activeTheme = themesObj[theme] || themesObj.gold;

  return (
    <div className="min-h-screen bg-[#05080a] text-gray-100 flex flex-col font-sans selection:bg-[#c5a059] selection:text-[#05080a]">
      <style>{`
        :root {
          --primary: ${activeTheme.primary};
          --card-dark: ${activeTheme.cardDark};
          --accent: ${activeTheme.accent};
          --accent-hover: ${activeTheme.accentHover};
          --border-color: rgba(${activeTheme.rgbAccent}, 0.15);
        }
        
        body {
          background-color: ${activeTheme.primary} !important;
        }
        
        ::selection {
          background-color: ${activeTheme.accent} !important;
          color: ${activeTheme.primary} !important;
        }
        
        .text-\\[\\#c5a059\\] {
          color: ${activeTheme.accent} !important;
        }
        .text-\\[\\#b48e47\\] {
          color: ${activeTheme.accentHover} !important;
        }
        .bg-\\[\\#c5a059\\] {
          background-color: ${activeTheme.accent} !important;
        }
        .bg-\\[\\#c5a059\\]\\/10 {
          background-color: rgba(${activeTheme.rgbAccent}, 0.10) !important;
        }
        .bg-\\[\\#c5a059\\]\\/20 {
          background-color: rgba(${activeTheme.rgbAccent}, 0.20) !important;
        }
        .border-\\[\\#c5a059\\] {
          border-color: ${activeTheme.accent} !important;
        }
        .border-\\[\\#c5a059\\]\\/10 {
          border-color: rgba(${activeTheme.rgbAccent}, 0.10) !important;
        }
        .border-\\[\\#c5a059\\]\\/15 {
          border-color: rgba(${activeTheme.rgbAccent}, 0.15) !important;
        }
        .border-\\[\\#c5a059\\]\\/20 {
          border-color: rgba(${activeTheme.rgbAccent}, 0.20) !important;
        }
        .border-\\[\\#c5a059\\]\\/30 {
          border-color: rgba(${activeTheme.rgbAccent}, 0.30) !important;
        }
        .hover\\:bg-\\[\\#b48e47\\]:hover {
          background-color: ${activeTheme.accentHover} !important;
        }
        .hover\\:text-\\[\\#c5a059\\]:hover {
          color: ${activeTheme.accent} !important;
        }
        .bg-black\\/80 {
          background-color: rgba(${activeTheme.rgbPrimary}, 0.8) !important;
        }
        .bg-\\[\\#0e1217\\] {
          background-color: ${activeTheme.cardDark} !important;
        }
        .bg-\\[\\#05080a\\] {
          background-color: ${activeTheme.primary} !important;
        }
        .bg-\\[\\#030507\\] {
          background-color: ${activeTheme.primary} !important;
        }
        .border-gray-900 {
          border-color: rgba(${activeTheme.rgbAccent}, 0.1) !important;
        }
        .from-\\[\\#0e1217\\] {
          --tw-gradient-from: ${activeTheme.cardDark} var(--tw-gradient-from-position) !important;
        }
        .to-\\[\\#05080a\\] {
          --tw-gradient-to: ${activeTheme.primary} var(--tw-gradient-to-position) !important;
        }
        .shadow-\\[\\#c5a059\\]\\/5 {
          --tw-shadow-color: rgba(${activeTheme.rgbAccent}, 0.05) !important;
        }
      `}</style>
      {/* HEADER & NAVBAR */}
      <header className="sticky top-0 z-50 bg-[#05080a]/95 backdrop-blur-md border-b border-[#c5a059]/15">
        <div className="w-full mx-auto px-4 lg:px-8 py-4 flex justify-between items-center">
          <a href="/" onClick={(e) => { e.preventDefault(); navigateTo('/'); }} className="flex items-center gap-3">
            <img 
              src={`${BACKEND_URL}/uploaded-files/itt-logo-4k-13-05-2026.png`} 
              alt="Insight Travel and Tourism Company" 
              className="h-12 w-auto object-contain" 
            />
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            <a href="/" onClick={(e) => { e.preventDefault(); navigateTo('/'); }} className={`text-xs font-semibold hover:text-[#c5a059] transition-colors ${location.pathname === '/' ? 'text-white' : 'text-gray-400'}`}>Home</a>
            <a href="#services" onClick={(e) => { e.preventDefault(); navigateTo('/', 'services'); }} className="text-xs font-semibold text-gray-400 hover:text-[#c5a059] transition-colors">Services</a>
            <a href="#spiritual" onClick={(e) => { e.preventDefault(); navigateTo('/', 'spiritual'); }} className="text-xs font-semibold text-gray-400 hover:text-[#c5a059] transition-colors">Spiritual</a>
            <a href="#wonders" onClick={(e) => { e.preventDefault(); navigateTo('/', 'wonders'); }} className="text-xs font-semibold text-gray-400 hover:text-[#c5a059] transition-colors">World Tours</a>
            {/* Umrah Booking E-Portal */}
            <a href="/portal" onClick={(e) => { e.preventDefault(); navigateTo('/portal'); }} className={`text-xs font-semibold hover:text-[#c5a059] transition-colors ${location.pathname === '/portal' ? 'text-[#c5a059] font-bold' : 'text-gray-400'}`}>Umrah E-Portal</a>
            <a href="/partner" onClick={(e) => { e.preventDefault(); navigateTo('/partner'); }} className={`text-xs font-semibold hover:text-[#c5a059] transition-colors ${location.pathname === '/partner' ? 'text-[#c5a059] font-bold' : 'text-gray-400'}`}>Partner Register</a>
            {/* Partner Dashboard */}
            <a href="/partner/dashboard" onClick={(e) => { e.preventDefault(); navigateTo('/partner/dashboard'); }} className={`text-xs font-semibold hover:text-[#c5a059] transition-colors ${location.pathname === '/partner/dashboard' ? 'text-[#c5a059] font-bold' : 'text-gray-400'}`}>Partner Dashboard</a>
            {/* Customer Booking Portal */}
            <a href="/customer/portal" onClick={(e) => { e.preventDefault(); navigateTo('/customer/portal'); }} className={`text-xs font-semibold hover:text-[#c5a059] transition-colors ${location.pathname === '/customer/portal' ? 'text-[#c5a059] font-bold' : 'text-gray-400'}`}>Customer Portal</a>

            {isAuthenticated ? (
              <>
                {/* BI Dashboard */}
                <a href="/dashboard" onClick={(e) => { e.preventDefault(); navigateTo('/dashboard'); }} className={`text-xs font-semibold hover:text-[#c5a059] transition-colors ${location.pathname === '/dashboard' ? 'text-[#c5a059] font-bold' : 'text-gray-400'}`}>BI Dashboard</a>
                {/* Staff Access Portal */}
                <a href="/sales" onClick={(e) => { e.preventDefault(); navigateTo('/sales'); }} className={`text-xs font-semibold hover:text-[#c5a059] transition-colors ${location.pathname === '/sales' ? 'text-[#c5a059] font-bold' : 'text-gray-400'}`}>Sales Portal</a>
                <button onClick={handleLogout} className="px-3 py-1 border border-red-500/30 text-red-400 text-[10px] font-bold rounded hover:bg-red-500/10 transition-all">
                  Log Out
                </button>
              </>
            ) : (
              <a href="/sales" onClick={(e) => { e.preventDefault(); navigateTo('/sales'); }} className={`text-xs font-semibold hover:text-[#c5a059] transition-colors ${location.pathname === '/sales' ? 'text-[#c5a059] font-bold' : 'text-gray-400'}`}>Staff Login</a>
            )}

            <a href="#contact" onClick={(e) => { e.preventDefault(); navigateTo('/', 'contact'); }} className="px-4 py-1.5 bg-[#c5a059] text-[#05080a] text-xs font-bold rounded hover:bg-[#b48e47] transition-all">
              Inquire Now
            </a>
          </nav>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-2xl text-white hover:text-[#c5a059] transition-colors"
          >
            <i className={`fa-solid ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#0e1217] border-b border-[#c5a059]/15 py-6 px-8 flex flex-col gap-4">
            <a href="/" onClick={(e) => { e.preventDefault(); navigateTo('/'); }} className="text-base hover:text-[#c5a059] transition-colors">Home</a>
            <a href="#services" onClick={(e) => { e.preventDefault(); navigateTo('/', 'services'); }} className="text-base hover:text-[#c5a059] transition-colors">Services</a>
            <a href="#spiritual" onClick={(e) => { e.preventDefault(); navigateTo('/', 'spiritual'); }} className="text-base hover:text-[#c5a059] transition-colors">Spiritual Journeys</a>
            <a href="#wonders" onClick={(e) => { e.preventDefault(); navigateTo('/', 'wonders'); }} className="text-base hover:text-[#c5a059] transition-colors">World Tours</a>
            {/* Umrah Booking E-Portal */}
            <a href="/portal" onClick={(e) => { e.preventDefault(); navigateTo('/portal'); }} className="text-base text-[#c5a059] font-bold">Umrah E-Portal</a>
            <a href="/partner" onClick={(e) => { e.preventDefault(); navigateTo('/partner'); }} className="text-base hover:text-[#c5a059] transition-colors">Partner Register</a>
            {/* Partner Dashboard */}
            <a href="/partner/dashboard" onClick={(e) => { e.preventDefault(); navigateTo('/partner/dashboard'); }} className="text-base hover:text-[#c5a059] transition-colors">Partner Dashboard</a>
            {/* Customer Booking Portal */}
            <a href="/customer/portal" onClick={(e) => { e.preventDefault(); navigateTo('/customer/portal'); }} className="text-base hover:text-[#c5a059] transition-colors">Customer Portal</a>

            {isAuthenticated ? (
              <>
                {/* BI Dashboard */}
                <a href="/dashboard" onClick={(e) => { e.preventDefault(); navigateTo('/dashboard'); }} className="text-base hover:text-[#c5a059] transition-colors">BI Dashboard</a>
                {/* Staff Access Portal */}
                <a href="/sales" onClick={(e) => { e.preventDefault(); navigateTo('/sales'); }} className="text-base hover:text-[#c5a059] transition-colors">Sales Portal</a>
                <button onClick={handleLogout} className="py-2 text-center border border-red-500/30 text-red-400 font-bold rounded">
                  Log Out
                </button>
              </>
            ) : (
              <a href="/sales" onClick={(e) => { e.preventDefault(); navigateTo('/sales'); }} className="text-base hover:text-[#c5a059] transition-colors">Staff Login</a>
            )}

            <a href="#contact" onClick={(e) => { e.preventDefault(); navigateTo('/', 'contact'); }} className="py-2.5 text-center bg-[#c5a059] text-[#05080a] font-bold rounded">
              Inquire Now
            </a>
          </div>
        )}
      </header>

      {/* ROUTES CONFIGURATION */}
      <Routes>
        <Route path="/" element={<HomeView navigateTo={navigateTo} handleFormChange={handleFormChange} handleInquirySubmit={handleInquirySubmit} formData={formData} submitStatus={submitStatus} teamMembers={teamMembers.filter(m => m.isActive !== false)} fallbackTeam={fallbackTeam.filter(m => m.isActive !== false)} BACKEND_URL={BACKEND_URL} />} />
        <Route path="/portal" element={<PortalView loading={loading} packages={packages.filter(p => p.isActive === true)} selectedCity={selectedCity} setSelectedCity={setSelectedCity} searchQuery={searchQuery} setSearchQuery={setSearchQuery} openBookingModal={openBookingModal} displayCurrency={displayCurrency} setDisplayCurrency={setDisplayCurrency} formatConvertedPrice={formatConvertedPrice} formatShortPrice={formatShortPrice} />} />
        <Route path="/partner" element={<PartnerRegisterView BACKEND_URL={BACKEND_URL} />} />
        <Route path="/partner/dashboard" element={<PartnerDashboardView BACKEND_URL={BACKEND_URL} exchangeRates={exchangeRates} />} />
        <Route path="/customer/portal" element={<CustomerPortalView BACKEND_URL={BACKEND_URL} exchangeRates={exchangeRates} />} />

        {/* Private Dashboard Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} BACKEND_URL={BACKEND_URL}>
            <DashboardView dashboardStats={dashboardStats} bookings={bookings} inquiries={inquiries} exchangeRates={exchangeRates} subagents={subagents} BACKEND_URL={BACKEND_URL} />
          </ProtectedRoute>
        } />
        <Route path="/sales" element={
          <ProtectedRoute isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} BACKEND_URL={BACKEND_URL}>
            <SalesPortalView packages={packages} subagents={subagents} bookings={bookings} teamMembers={teamMembers} BACKEND_URL={BACKEND_URL} setSubagents={setSubagents} setPackages={setPackages} setTeamMembers={setTeamMembers} />
          </ProtectedRoute>
        } />
      </Routes>

      {/* FOOTER */}
      <footer className="bg-[#030507] border-t border-gray-900 py-12 mt-auto text-xs text-gray-500">
        <div className="container mx-auto px-6 max-w-7xl flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="text-[#c5a059] text-lg"><i className="fa-solid fa-compass"></i></span>
            <span className="text-xl font-bold tracking-wide text-white uppercase">
              Travel & <span className="text-[#c5a059] font-serif capitalize">Tourism Agency</span>
            </span>
          </div>
          <p className="text-center">
            &copy; 2026 Insight Travel & Tourism. All Rights Reserved.
          </p>
          <div className="flex gap-4">
            <a href="/partner" onClick={(e) => { e.preventDefault(); navigateTo('/partner'); }} className="hover:text-[#c5a059]">Partner Registration</a>
            {/* Partner Dashboard */}
            <a href="/partner/dashboard" onClick={(e) => { e.preventDefault(); navigateTo('/partner/dashboard'); }} className="hover:text-[#c5a059]">Partner Dashboard</a>
            {/* Customer Booking Portal */}
            <a href="/customer/portal" onClick={(e) => { e.preventDefault(); navigateTo('/customer/portal'); }} className="hover:text-[#c5a059]">Customer Portal</a>
            {/* Staff Access Portal */}
            <a href="/sales" onClick={(e) => { e.preventDefault(); navigateTo('/sales'); }} className="hover:text-[#c5a059]">Sales Portal</a>
          </div>
        </div>
      </footer>

      {/* FLOATING THEME SELECTOR */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setThemeMenuOpen(!themeMenuOpen)}
          className="w-12 h-12 bg-[#0e1217]/90 hover:bg-[#c5a059] hover:text-[#05080a] text-[#c5a059] rounded-full border border-[#c5a059]/30 shadow-xl backdrop-blur-md flex items-center justify-center transition-all duration-300 transform hover:scale-105"
          title="Change Theme"
        >
          <i className="fa-solid fa-palette text-lg"></i>
        </button>

        {themeMenuOpen && (
          <div className="absolute bottom-16 right-0 w-52 bg-[#0e1217]/95 border border-[#c5a059]/20 rounded-xl shadow-2xl backdrop-blur-md p-4 animate-fadeIn flex flex-col gap-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#c5a059] border-b border-[#c5a059]/10 pb-2">Select Theme</h4>
            <div className="flex flex-col gap-1.5 text-left">
              {[
                { id: 'gold', name: 'Gold Luxury', color: '#c5a059' },
                { id: 'emerald', name: 'Emerald Green', color: '#10b981' },
                { id: 'sapphire', name: 'Sapphire Blue', color: '#3b82f6' },
                { id: 'purple', name: 'Royal Purple', color: '#a855f7' }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => {
                    setTheme(t.id as any);
                    localStorage.setItem('theme', t.id);
                    setThemeMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-all hover:bg-[#c5a059]/10 ${theme === t.id ? 'bg-[#c5a059]/20 text-white font-bold' : 'text-gray-400 hover:text-white'
                    }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-white/10"
                    style={{ backgroundColor: t.color }}
                  ></span>
                  <span>{t.name}</span>
                  {theme === t.id && (
                    <i className="fa-solid fa-check text-[10px] ml-auto text-[#c5a059]"></i>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* E-COMMERCE CHECKOUT MODAL */}
      {selectedPkg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-[#0e1217] w-full max-w-2xl rounded-xl border border-[#c5a059]/20 shadow-2xl overflow-hidden animate-fadeIn">
            {/* Modal Header */}
            <div className="bg-[#05080a] py-4 px-6 border-b border-[#c5a059]/15 flex justify-between items-center">
              <div>
                <span className="text-xs text-[#c5a059] font-bold uppercase tracking-widest">E-Portal Checkout</span>
                <h3 className="text-lg font-bold text-white mt-0.5">{selectedPkg.title}</h3>
              </div>
              <button
                onClick={() => setSelectedPkg(null)}
                className="text-gray-400 hover:text-white text-xl"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {bookingStatus.type === 'success' ? (
              /* Success Screen */
              <div className="p-8 text-center flex flex-col items-center gap-4">
                <span className="text-6xl text-green-500"><i className="fa-regular fa-circle-check"></i></span>
                <h4 className="text-2xl font-bold text-white">Booking Placed Successfully!</h4>
                <div className="bg-[#05080a] py-2.5 px-6 rounded border border-gray-800 text-sm">
                  Booking Reference ID: <strong className="text-[#c5a059]">{bookingStatus.bookingId}</strong>
                </div>
                <p className="text-gray-400 text-sm max-w-md leading-relaxed mt-2">
                  {bookingStatus.message}
                </p>
                <button
                  onClick={() => setSelectedPkg(null)}
                  className="mt-6 px-8 py-3 bg-[#c5a059] text-[#05080a] font-bold rounded hover:bg-[#b48e47] transition-all"
                >
                  Return to Dashboard
                </button>
              </div>
            ) : (
              /* Booking Flow Form */
              <form onSubmit={handleCheckoutSubmit} className="p-6 flex flex-col gap-6 max-h-[80vh] overflow-y-auto">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#c5a059] tracking-wider mb-2">1. Select Rooming Type</label>
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { type: 'sharing', label: 'Sharing', price: selectedPkg.price_sharing },
                      { type: 'quad', label: 'Quad (4)', price: selectedPkg.price_quad },
                      { type: 'triple', label: 'Triple (3)', price: selectedPkg.price_triple },
                      { type: 'double', label: 'Double (2)', price: selectedPkg.price_double }
                    ].map(room => (
                      <button
                        key={room.type}
                        type="button"
                        onClick={() => setRoomingType(room.type as any)}
                        className={`py-3 px-1.5 rounded border text-center transition-all ${roomingType === room.type
                          ? 'border-[#c5a059] bg-[#c5a059]/10 text-white font-bold'
                          : 'border-gray-800 bg-[#05080a]/60 text-gray-400 hover:border-gray-700'
                          }`}
                      >
                        <div className="text-xs">{room.label}</div>
                        <div className="text-xs text-[#c5a059] mt-1 font-extrabold">
                          {room.price ? `${(room.price / 1000).toFixed(0)}k` : 'N/A'}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#c5a059] tracking-wider mb-2">2. Package Mode Choice</label>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {[
                      { mode: 'complete', label: 'Complete Package', desc: 'All standard services included' },
                      { mode: 'customized', label: 'Customized Package', desc: 'Select individual services separately' }
                    ].map(opt => (
                      <button
                        key={opt.mode}
                        type="button"
                        onClick={() => setPackageMode(opt.mode as any)}
                        className={`py-3 px-3 rounded-lg border text-left transition-all ${packageMode === opt.mode
                          ? 'border-[#c5a059] bg-[#c5a059]/10 text-white font-bold'
                          : 'border-gray-800 bg-[#05080a]/60 text-gray-400 hover:border-gray-700'
                          }`}
                      >
                        <div className="text-xs font-bold text-white">{opt.label}</div>
                        <div className="text-[10px] text-gray-400 mt-1 font-medium">{opt.desc}</div>
                      </button>
                    ))}
                  </div>

                  {packageMode === 'customized' && (
                    <div className="bg-[#05080a] border border-[#c5a059]/15 p-4 rounded-lg flex flex-col gap-3.5 animate-fadeIn">
                      <div className="text-[10px] font-bold text-[#c5a059] uppercase tracking-wider border-b border-gray-800 pb-2 flex justify-between">
                        <span>Select Services to Include</span>
                        <span>Deduction Value if Deselected</span>
                      </div>

                      {[
                        { key: 'visa', label: 'Visa Services & Processing', price: 45000 },
                        { key: 'tickets', label: 'Air Tickets (Flights)', price: 110000 },
                        { key: 'ground', label: 'Ground Travel Services (Bus/Private Car)', price: 30000 },
                        { key: 'catering', label: 'Catering Services (Meals/Buffet)', price: 25000 },
                        { key: 'accommodation', label: 'Accommodation (Hotels)', price: 80000 }
                      ].map(srv => {
                        const isChecked = (customServices as any)[srv.key];
                        return (
                          <div key={srv.key} className="flex items-center justify-between text-xs py-1">
                            <label className="flex items-center gap-2.5 cursor-pointer text-gray-300 font-medium">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => setCustomServices(prev => ({ ...prev, [srv.key]: e.target.checked }))}
                                className="cursor-pointer accent-[#c5a059] rounded"
                              />
                              <span>{srv.label}</span>
                            </label>
                            <span className="font-mono text-[10px] text-red-400">
                              - PKR {srv.price.toLocaleString()}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 3. Departure Travel Date (Gregorian & Hijri Calendars) */}
                <div>
                  <label className="block text-xs font-bold uppercase text-[#c5a059] tracking-wider mb-2">3. Select Departure Travel Date (Gregorian & Hijri)</label>

                  <div className="bg-[#05080a] border border-gray-800 rounded-lg p-4 flex flex-col gap-4">
                    <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                      <button
                        type="button"
                        onClick={() => setCurrentCalDate(new Date(currentCalDate.getFullYear(), currentCalDate.getMonth() - 1, 1))}
                        className="px-2.5 py-1 hover:text-white text-gray-400 bg-gray-900 border border-gray-800 rounded text-[11px] transition-all flex items-center gap-1"
                      >
                        <i className="fa-solid fa-chevron-left text-[9px]"></i> Prev Month
                      </button>
                      <div className="text-center">
                        <div className="text-xs font-bold text-white uppercase tracking-wider">
                          {currentCalDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                        </div>
                        <div className="text-[10px] text-[#c5a059] font-bold mt-0.5">
                          {(() => {
                            const midMonthDate = new Date(currentCalDate.getFullYear(), currentCalDate.getMonth(), 15);
                            try {
                              const parts = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
                                month: 'long',
                                year: 'numeric'
                              }).formatToParts(midMonthDate);
                              const hMonth = parts.find(p => p.type === 'month')?.value || '';
                              const hYear = parts.find(p => p.type === 'year')?.value || '';
                              return `${hMonth} ${hYear} AH`;
                            } catch (e) {
                              return '';
                            }
                          })()}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCurrentCalDate(new Date(currentCalDate.getFullYear(), currentCalDate.getMonth() + 1, 1))}
                        className="px-2.5 py-1 hover:text-white text-gray-400 bg-gray-900 border border-gray-800 rounded text-[11px] transition-all flex items-center gap-1"
                      >
                        Next Month <i className="fa-solid fa-chevron-right text-[9px]"></i>
                      </button>
                    </div>

                    <div>
                      {/* Week Headers */}
                      <div className="grid grid-cols-7 text-center text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-2">
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => <div key={day}>{day}</div>)}
                      </div>

                      {/* Day Grid */}
                      <div className="grid grid-cols-7 gap-1">
                        {(() => {
                          const year = currentCalDate.getFullYear();
                          const month = currentCalDate.getMonth();
                          const firstDayIndex = new Date(year, month, 1).getDay();
                          const totalDays = new Date(year, month + 1, 0).getDate();

                          const cells = [];

                          // Offset days
                          for (let i = 0; i < firstDayIndex; i++) {
                            cells.push(<div key={`empty-${i}`} className="p-2"></div>);
                          }

                          // Days
                          for (let d = 1; d <= totalDays; d++) {
                            const cellDate = new Date(year, month, d);
                            const cellDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                            const isSelected = travelDate === cellDateStr;

                            // Convert to Hijri Day Number
                            let hijriDay = '';
                            try {
                              const parts = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', { day: 'numeric' }).formatToParts(cellDate);
                              hijriDay = parts.find(p => p.type === 'day')?.value || '';
                            } catch (e) {
                              hijriDay = '';
                            }

                            cells.push(
                              <button
                                key={`day-${d}`}
                                type="button"
                                onClick={() => setTravelDate(cellDateStr)}
                                className={`p-1 rounded border flex flex-col items-center justify-between transition-all aspect-square min-h-[40px] ${isSelected
                                  ? 'bg-[#c5a059] border-[#c5a059] text-[#05080a]'
                                  : 'bg-[#0e1217] border-gray-800/80 text-white hover:border-gray-700'
                                  }`}
                              >
                                <span className="text-[11px] font-bold leading-none">{d}</span>
                                <span className={`text-[8px] leading-none mt-1 font-mono font-bold ${isSelected ? 'text-[#05080a]/85' : 'text-[#c5a059]'}`}>
                                  {hijriDay}
                                </span>
                              </button>
                            );
                          }

                          return cells;
                        })()}
                      </div>
                    </div>

                    {/* Feedback */}
                    {travelDate ? (
                      <div className="bg-[#c5a059]/10 border border-[#c5a059]/20 p-2.5 rounded text-[11px] text-[#c5a059] flex items-center gap-2">
                        <i className="fa-solid fa-calendar-check"></i>
                        <span>
                          <strong>Selected Travel Date:</strong> {new Date(travelDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                          {' / '}
                          {(() => {
                            try {
                              return new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(travelDate));
                            } catch (e) {
                              return '';
                            }
                          })()}
                        </span>
                      </div>
                    ) : (
                      <div className="bg-red-500/10 border border-red-500/20 p-2.5 rounded text-[11px] text-red-400 flex items-center gap-2">
                        <i className="fa-solid fa-circle-info"></i>
                        <span>Please select a departure travel date from the dual Gregorian/Hijri calendar above.</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center bg-[#05080a] p-4 rounded border border-gray-800">
                  <div>
                    <div className="text-sm font-bold text-white">Number of Pilgrims</div>
                    <div className="text-xs text-gray-400 mt-0.5">Adjust count to calculate total</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handlePilgrimCountChange(pilgrimsCount - 1)}
                      className="w-8 h-8 rounded bg-gray-800 text-white font-bold flex items-center justify-center hover:bg-gray-700 text-lg"
                    >
                      -
                    </button>
                    <span className="text-lg font-extrabold text-white w-6 text-center">{pilgrimsCount}</span>
                    <button
                      type="button"
                      onClick={() => handlePilgrimCountChange(pilgrimsCount + 1)}
                      className="w-8 h-8 rounded bg-[#c5a059] text-[#05080a] font-bold flex items-center justify-center hover:bg-[#b48e47] text-lg"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#c5a059] tracking-wider mb-2.5">4. Contact Details</label>
                  <div className="grid sm:grid-cols-4 gap-4">
                    <input
                      type="text"
                      placeholder="Contact Name"
                      required
                      value={contactInfo.name}
                      onChange={(e) => setContactInfo(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-[#05080a]/60 border border-gray-800 focus:border-[#c5a059] text-white px-3 py-2 rounded text-xs outline-none"
                    />
                    <input
                      type="email"
                      placeholder="Contact Email"
                      required
                      value={contactInfo.email}
                      onChange={(e) => setContactInfo(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full bg-[#05080a]/60 border border-gray-800 focus:border-[#c5a059] text-white px-3 py-2 rounded text-xs outline-none"
                    />
                    <input
                      type="tel"
                      placeholder="Contact Phone"
                      required
                      value={contactInfo.phone}
                      onChange={(e) => setContactInfo(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full bg-[#05080a]/60 border border-gray-800 focus:border-[#c5a059] text-white px-3 py-2 rounded text-xs outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Partner Agent ID (Optional)"
                      value={partnerId}
                      onChange={(e) => setPartnerId(e.target.value)}
                      className="w-full bg-[#05080a]/60 border border-[#c5a059]/30 focus:border-[#c5a059] text-white px-3 py-2 rounded text-xs outline-none placeholder:text-gray-650"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#c5a059] tracking-wider mb-2.5">5. Pilgrim Information</label>
                  <div className="flex flex-col gap-3 max-h-40 overflow-y-auto pr-1">
                    {pilgrims.map((pilgrim, idx) => (
                      <div key={idx} className="grid grid-cols-12 gap-3 items-center bg-[#05080a]/40 p-2.5 rounded border border-gray-800/80">
                        <span className="col-span-2 text-xs font-semibold text-gray-400">P{idx + 1}:</span>
                        <input
                          type="text"
                          placeholder="Full Name"
                          required
                          value={pilgrim.name}
                          onChange={(e) => handlePilgrimFieldChange(idx, 'name', e.target.value)}
                          className="col-span-5 bg-[#05080a]/60 border border-gray-800 focus:border-[#c5a059] text-white px-2 py-1.5 rounded text-xs outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Passport Number"
                          required
                          value={pilgrim.passportNumber}
                          onChange={(e) => handlePilgrimFieldChange(idx, 'passportNumber', e.target.value)}
                          className="col-span-5 bg-[#05080a]/60 border border-gray-800 focus:border-[#c5a059] text-white px-2 py-1.5 rounded text-xs outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {bookingStatus.type === 'error' && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded text-xs font-semibold">
                    {bookingStatus.message}
                  </div>
                )}

                <div className="border-t border-[#c5a059]/15 pt-5 flex justify-between items-center">
                  <div>
                    <div className="text-xs text-gray-400">Total Price Calculation</div>
                    <div className="text-xl font-black text-[#c5a059]">
                      PKR {(getPricePerPilgrim(selectedPkg) * pilgrimsCount).toLocaleString()}
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-[#c5a059] text-[#05080a] font-bold rounded hover:bg-[#b48e47] transition-all flex items-center gap-2 shadow-lg"
                  >
                    Confirm & Reserve <i className="fa-solid fa-credit-card"></i>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* PROTECTED ROUTE COMPONENT FOR STAFF */
interface ProtectedRouteProps {
  isAuthenticated: boolean;
  setIsAuthenticated: (val: boolean) => void;
  BACKEND_URL: string;
  children: React.ReactNode;
}

function ProtectedRoute({ isAuthenticated, setIsAuthenticated, BACKEND_URL, children }: ProtectedRouteProps) {
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        localStorage.setItem('staff_token', data.token);
        setIsAuthenticated(true);
      } else {
        setErrorMsg(data.error || 'Authentication failed.');
      }
    } catch (err) {
      setErrorMsg('Failed to connect to the server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <section className="py-24 bg-[#05080a] flex-grow flex items-center justify-center">
      <div className="bg-[#0e1217] w-full max-w-md p-8 rounded-2xl border border-[#c5a059]/20 shadow-2xl text-center">
        <span className="text-[#c5a059] text-3xl mb-4 inline-block"><i className="fa-solid fa-lock"></i></span>
        <h3 className="text-xl font-bold text-white mb-2">Staff Access Portal</h3>
        <p className="text-gray-400 text-xs mb-6">Enter portal password to view dashboards and manage sales transactions.</p>

        {errorMsg && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded mb-4 font-semibold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4 text-left">
          <div>
            <label className="block text-[10px] font-bold uppercase text-[#c5a059] tracking-wider mb-2">Authentication Password</label>
            <input
              type="password"
              placeholder="••••••••••••"
              required
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full bg-[#05080a] border border-gray-800 focus:border-[#c5a059] text-white px-4 py-3 rounded text-sm outline-none transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-[#c5a059] text-[#05080a] font-bold rounded hover:bg-[#b48e47] transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <><i className="fa-solid fa-circle-notch fa-spin"></i> Authenticating...</>
            ) : (
              'Authenticate'
            )}
          </button>
        </form>
      </div>
    </section>
  );
}

/* HOME VIEW COMPONENT */
function HomeView({ navigateTo, handleFormChange, handleInquirySubmit, formData, submitStatus, teamMembers = [], fallbackTeam = [], BACKEND_URL }: any) {
  return (
    <>
      {/* HERO SECTION */}
      <section id="home" className="relative min-h-[80vh] flex items-center justify-center bg-[#05080a] py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/hero_bg.png')] bg-cover bg-center opacity-75"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_40%,rgba(7,13,15,0.3)_0%,rgba(7,13,15,0.92)_85%)]"></div>
        <div className="container mx-auto px-6 max-w-7xl relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="col-span-1 lg:col-span-7 text-left">
            <span className="text-[#c5a059] text-xs uppercase tracking-[4px] font-semibold mb-4 block animate-fadeIn">Your Gateway to Spiritual & Global Horizons</span>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
              Experience the <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c5a059] via-[#e2c98a] to-[#c5a059] font-serif italic font-normal">
                Journey of a Lifetime
              </span>
            </h1>
            <p className="text-gray-400 text-base sm:text-lg mb-10 leading-relaxed font-sans max-w-xl">
              Specializing in spiritual, serene Umrah pilgrimages and premium, tailored World Tour packages. Connect with our Travel & Tourism Agency for trusted guidance, comfort, and premium arrangements.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={() => navigateTo('/portal')}
                className="w-full sm:w-auto px-8 py-4 bg-[#c5a059] text-[#05080a] font-bold rounded hover:bg-[#b48e47] transition-all transform hover:-translate-y-1 shadow-lg shadow-[#c5a059]/20 flex items-center justify-center gap-2"
              >
                Submit Inquiry <i className="fa-solid fa-arrow-right"></i>
              </button>
              <button
                onClick={() => navigateTo('/', 'services')}
                className="w-full sm:w-auto px-8 py-4 bg-transparent text-white border border-gray-700 font-bold rounded hover:border-[#c5a059] hover:text-[#c5a059] transition-all"
              >
                Explore Services
              </button>
            </div>
          </div>
          <div className="col-span-1 lg:col-span-5 flex flex-col gap-6 items-center lg:items-end justify-center">
            <div className="bg-[#0e1217]/80 border border-white/10 backdrop-blur-md p-6 rounded-2xl flex items-center gap-5 w-[260px] shadow-2xl transition-all hover:-translate-y-1.5 hover:border-[#c5a059]/40 animate-float cursor-pointer" onClick={() => navigateTo('/portal')}>
              <span className="text-[#c5a059] text-3xl"><i className="fa-solid fa-kaaba"></i></span>
              <span className="text-base font-bold text-white">Umrah & Hajj</span>
            </div>
            <div className="bg-[#0e1217]/80 border border-white/10 backdrop-blur-md p-6 rounded-2xl flex items-center gap-5 w-[260px] shadow-2xl transition-all hover:-translate-y-1.5 hover:border-[#c5a059]/40 animate-float-delayed cursor-pointer" onClick={() => navigateTo('/', 'wonders')}>
              <span className="text-[#c5a059] text-3xl"><i className="fa-solid fa-earth-americas"></i></span>
              <span className="text-base font-bold text-white">World Tours</span>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section id="services" className="py-24 bg-[#080d12]/50 border-y border-[#c5a059]/5">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-serif text-white font-bold">Premium Travel Solutions</h2>
            <div className="w-16 h-0.5 bg-[#c5a059] mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#0e1217] rounded-3xl overflow-hidden border border-[#c5a059]/10 hover:border-[#c5a059]/30 hover:-translate-y-1.5 transition-all flex flex-col group shadow-xl">
              <div className="relative h-64 overflow-hidden">
                <img src="/umrah_card.png" alt="Umrah Pilgrimage" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e1217] to-transparent opacity-60"></div>
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <span className="self-start px-3 py-1 bg-[#c5a059]/10 text-[#c5a059] text-xs font-bold uppercase tracking-wider rounded border border-[#c5a059]/20 mb-4">
                  Spiritual Journey
                </span>
                <h3 className="text-2xl font-bold text-white mb-3">Sacred Umrah Packages</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  Embark on a deeply spiritual pilgrimage to the Holy Sites. From visa facilitation and elegant hotel bookings in Makkah and Madinah near the Harams, to comfortable transport services, we take care of every detail so you can focus on worship.
                </p>
                <ul className="text-gray-400 text-sm space-y-3 mb-8">
                  <li className="flex items-center gap-3"><i className="fa-solid fa-circle-check text-[#c5a059]"></i> Close-to-Haram Accommodations</li>
                  <li className="flex items-center gap-3"><i className="fa-solid fa-circle-check text-[#c5a059]"></i> Complete Visa & Ground Logistics</li>
                  <li className="flex items-center gap-3"><i className="fa-solid fa-circle-check text-[#c5a059]"></i> Experienced Guided Assistance</li>
                </ul>
                <a href="/portal" onClick={(e) => { e.preventDefault(); navigateTo('/portal'); }} className="text-[#c5a059] font-bold text-sm hover:underline mt-auto flex items-center gap-2">
                  View Live Packages <i className="fa-solid fa-chevron-right text-xs"></i>
                </a>
              </div>
            </div>

            <div className="bg-[#0e1217] rounded-3xl overflow-hidden border border-[#c5a059]/10 hover:border-[#c5a059]/30 hover:-translate-y-1.5 transition-all flex flex-col group shadow-xl">
              <div className="relative h-64 overflow-hidden">
                <img src="/world_tour_card.png" alt="World Tour Destinations" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e1217] to-transparent opacity-60"></div>
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <span className="self-start px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-wider rounded border border-blue-500/20 mb-4">
                  Global Exploration
                </span>
                <h3 className="text-2xl font-bold text-white mb-3">Bespoke World Tours</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  Explore spectacular destinations across Europe, Asia, the Americas, and beyond. Whether you seek leisure beach holidays, exciting family vacations, or custom group tours, we craft itineraries to match your travel dreams perfectly.
                </p>
                <ul className="text-gray-400 text-sm space-y-3 mb-8">
                  <li className="flex items-center gap-3"><i className="fa-solid fa-circle-check text-blue-400"></i> Tailored Itineraries & Group Tours</li>
                  <li className="flex items-center gap-3"><i className="fa-solid fa-circle-check text-blue-400"></i> Flight & Hotel Reservations</li>
                  <li className="flex items-center gap-3"><i className="fa-solid fa-circle-check text-blue-400"></i> Local Excursions & Guided Activities</li>
                </ul>
                <a href="#wonders" onClick={(e) => { e.preventDefault(); navigateTo('/', 'wonders'); }} className="text-[#c5a059] font-bold text-sm hover:underline mt-auto flex items-center gap-2">
                  Inquire about World Tours <i className="fa-solid fa-chevron-right text-xs"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SPIRITUAL JOURNEYS */}
      <section id="spiritual" className="py-24 bg-[#05080a]">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-serif text-white font-bold">Spiritual Journeys</h2>
            <div className="w-16 h-0.5 bg-[#c5a059] mx-auto mt-4"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-[#0e1217] rounded overflow-hidden border border-[#c5a059]/10">
              <img src="https://images.unsplash.com/photo-1693590614566-1d3ea9ef32f7?auto=format&fit=crop&w=600" alt="The Center of the Soul" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-lg font-bold text-[#c5a059] mb-3">The Center of the Soul</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Makkah is not just a destination on a map; it is the gravitational pull of the believer’s heart. When the eyes first fall upon the Kaaba, the noise of the world falls silent, and the soul finally hears the echo of its own beginning.
                </p>
              </div>
            </div>

            <div className="bg-[#0e1217] rounded overflow-hidden border border-[#c5a059]/10">
              <img src="https://plus.unsplash.com/premium_photo-1697730274057-19338e84db8e?auto=format&fit=crop&w=600" alt="The House of Equality" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-lg font-bold text-[#c5a059] mb-3">The House of Equality</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  In the shadows of the Black Stone, there are no kings and no beggars—only souls draped in white, circling the House of the One. It is here we learn that the only true rank in existence is the sincerity of our prostration.
                </p>
              </div>
            </div>

            <div className="bg-[#0e1217] rounded overflow-hidden border border-[#c5a059]/10">
              <img src="https://images.unsplash.com/photo-1511652019870-fbd8713560bf?auto=format&fit=crop&w=600" alt="The Infinite Return" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-lg font-bold text-[#c5a059] mb-3">The Infinite Return</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  To perform Tawaf is to realize that life is a circle that begins and ends with God. Every step around the Kaaba is a shedding of the ego, until nothing remains but the servant and the Master in a state of perfect peace.
                </p>
              </div>
            </div>

            <div className="bg-[#0e1217] rounded overflow-hidden border border-[#c5a059]/10">
              <img src="https://images.unsplash.com/photo-1602733458155-647c07d32ef6?auto=format&fit=crop&w=600" alt="The City of Light" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-lg font-bold text-[#c5a059] mb-3">The City of Light</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  If Makkah is the majesty of Divine Law, Madinah is the beauty of Divine Mercy. To enter the City of the Prophet is to move from the scorching heat of worldly struggle into the cool, fragrant shade of unconditional love.
                </p>
              </div>
            </div>

            <div className="bg-[#0e1217] rounded overflow-hidden border border-[#c5a059]/10">
              <img src="https://images.unsplash.com/photo-1729931421786-7bbd6c7d78f6?auto=format&fit=crop&w=600" alt="The Fragrance of Presence" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-lg font-bold text-[#c5a059] mb-3">The Fragrance of Presence</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  There is a stillness in the air of Madinah that cannot be found elsewhere. It is the scent of a thousand salutations and the weight of a Presence that reassures every broken heart: 'You are home, and you are welcome here.'
                </p>
              </div>
            </div>

            <div className="bg-[#0e1217] rounded overflow-hidden border border-[#c5a059]/10">
              <img src="https://images.unsplash.com/photo-1667454496584-9838026037af?auto=format&fit=crop&w=600" alt="The Garden of Paradise" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-lg font-bold text-[#c5a059] mb-3">The Garden of Paradise</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Walking through the gates of Al-Masjid an-Nabawi is like stepping out of time. Between the Rawdah and the Minbar lies a garden of Paradise, where the spirit breathes the air of the heavens while the feet still touch the earth.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTERNATIONAL WONDERS */}
      <section id="wonders" className="py-24 bg-[#080d12]/50 border-t border-[#c5a059]/5">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-serif text-white font-bold">International Wonders</h2>
            <div className="w-16 h-0.5 bg-[#c5a059] mx-auto mt-4"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-[#0e1217] rounded overflow-hidden border border-[#c5a059]/10 group">
              <img src="https://images.unsplash.com/photo-1615811648503-479d06197ff3?auto=format&fit=crop&w=600" alt="Petra" className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="p-6">
                <h3 className="text-lg font-bold text-white mb-2">Petra, (Jordan)</h3>
                <p className="text-gray-400 text-sm leading-relaxed">Discover the ancient "Rose City" carved into sandstone.</p>
              </div>
            </div>

            <div className="bg-[#0e1217] rounded overflow-hidden border border-[#c5a059]/10 group">
              <img src="https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=600" alt="Great Wall" className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="p-6">
                <h3 className="text-lg font-bold text-white mb-2">Great Wall, (China)</h3>
                <p className="text-gray-400 text-sm leading-relaxed">Walk the historic fortifications of the Ming Dynasty.</p>
              </div>
            </div>

            <div className="bg-[#0e1217] rounded overflow-hidden border border-[#c5a059]/10 group">
              <img src="https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600" alt="Colosseum" className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="p-6">
                <h3 className="text-lg font-bold text-white mb-2">The Colosseum, (Rome)</h3>
                <p className="text-gray-400 text-sm leading-relaxed">Experience the architectural marvel of ancient Italy.</p>
              </div>
            </div>

            <div className="bg-[#0e1217] rounded overflow-hidden border border-[#c5a059]/10 group">
              <img src="https://images.unsplash.com/photo-1509273954142-d24fb1bb212d?auto=format&fit=crop&w=600" alt="Machu Picchu" className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="p-6">
                <h3 className="text-lg font-bold text-white mb-2">Machu Picchu Trek (Peru)</h3>
                <p className="text-gray-400 text-sm leading-relaxed">Unveil the mysteries of the Incan Empire in the Peruvian Andes.</p>
              </div>
            </div>

            <div className="bg-[#0e1217] rounded overflow-hidden border border-[#c5a059]/10 group">
              <img src="https://images.unsplash.com/photo-1647220499997-ae2a94540ed6?auto=format&fit=crop&w=600" alt="Chichen Itza" className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="p-6">
                <h3 className="text-lg font-bold text-white mb-2">Chichén Itzá, (Mexico)</h3>
                <p className="text-gray-400 text-sm leading-relaxed">Experience the Chichén Itzá (Mexico): A large Maya pyramid city.</p>
              </div>
            </div>

            <div className="bg-[#0e1217] rounded overflow-hidden border border-[#c5a059]/10 group">
              <img src="https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=600" alt="Taj Mahal" className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="p-6">
                <h3 className="text-lg font-bold text-white mb-2">The Taj Mahal, (India)</h3>
                <p className="text-gray-400 text-sm leading-relaxed">Experience the white marble mausoleum commissioned in 1632 by Shah Jahan.</p>
              </div>
            </div>
          </div>

          {/* Umrah Booking E-Portal section */}
          <div className="mt-20 bg-[#0e1217] border border-[#c5a059]/15 rounded-xl p-8 sm:p-12 text-center max-w-4xl mx-auto shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-[#c5a059]"></div>
            <h3 className="text-2xl font-serif text-white font-bold mb-4">Umrah Booking E-Portal</h3>
            <p className="text-gray-400 text-sm max-w-2xl mx-auto mb-8 leading-relaxed">
              Ready to answer the sacred call? We offer dynamic, clean Unicode packages mapped directly from respected departure cities across Pakistan. Choose room options and place bookings through our real-time checkout flow.
            </p>
            <button
              onClick={() => navigateTo('/portal')}
              className="px-8 py-3.5 bg-[#c5a059] text-[#05080a] font-bold rounded-lg hover:bg-[#b48e47] transition-all transform hover:-translate-y-0.5 shadow-lg shadow-[#c5a059]/10"
            >
              Enter Sacred Umrah Portal <i className="fa-solid fa-arrow-right-to-bracket ml-2"></i>
            </button>
          </div>
        </div>
      </section>

      {/* HAJJ & UMRAH POLICY SECTION */}
      <section id="policy" className="py-24 bg-[#0e1217]">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif text-white font-bold mb-4">Umrah Policy</h2>
            <div className="w-16 h-0.5 bg-[#c5a059] mx-auto mb-6"></div>
            <p className="text-gray-400 text-sm max-w-2xl mx-auto">
              Please review our comprehensive Umrah policy below. You can also download the document for your convenience.
            </p>
          </div>
          
          <div className="bg-[#05080a] border border-[#c5a059]/20 rounded-xl p-4 sm:p-8 shadow-2xl relative">
            <div className="w-full h-[600px] rounded border border-gray-800 overflow-hidden mb-8">
              <iframe 
                src={`${BACKEND_URL}/uploaded-files/umrah%20policy/UMRAH%20POLICY.pdf`} 
                className="w-full h-full"
                title="Umrah Policy"
              ></iframe>
            </div>
            
            <div className="text-center">
              <a 
                href={`${BACKEND_URL}/uploaded-files/umrah%20policy/UMRAH%20POLICY.pdf`}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-[#c5a059] text-[#05080a] font-bold rounded hover:bg-[#b48e47] transition-all"
              >
                <i className="fa-solid fa-download"></i>
                Download Policy PDF
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* TEAM SECTION */}
      <section id="team" className="py-24 bg-[#05080a]">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-serif text-white font-bold">Our Team</h2>
            {/* <p className="text-[#c5a059] text-sm mt-1">Leadership at Lahore Office</p> */}
            <div className="w-16 h-0.5 bg-[#c5a059] mx-auto mt-4"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {(teamMembers.length > 0 ? teamMembers : fallbackTeam).map((member: any, idx: number) => (
              <div key={idx} className="bg-[#0e1217] p-8 rounded border border-[#c5a059]/10 hover:border-[#c5a059]/30 transition-all flex flex-col">
                <span className="self-start px-3 py-1 bg-[#c5a059]/10 text-[#c5a059] text-xs font-bold uppercase tracking-wider rounded border border-[#c5a059]/20 mb-4">
                  {member.role}
                </span>
                <h3 className="text-2xl font-bold text-white mb-1">{member.name}</h3>
                <p className="text-sm text-[#c5a059] font-semibold mb-2 font-serif">{member.designation}</p>
                <p className="text-xs text-gray-400 mb-6"><i className="fa-solid fa-location-dot"></i> {member.office}</p>

                <div className="flex flex-col gap-3 mt-auto pt-6 border-t border-gray-800">
                  <div className="flex items-center gap-3 text-sm text-gray-300">
                    <span className="text-[#c5a059] w-5"><i className="fa-solid fa-envelope"></i></span>
                    <div className="flex flex-col">
                      {member.emails.map((email: string, eIdx: number) => (
                        <a key={eIdx} href={`mailto:${email}`} className="hover:text-[#c5a059] transition-colors">{email}</a>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-300">
                    <span className="text-[#c5a059] w-5"><i className="fa-solid fa-phone"></i></span>
                    <div className="flex flex-col">
                      {member.phones.map((phone: string, pIdx: number) => (
                        <a key={pIdx} href={`tel:${phone}`} className="hover:text-[#c5a059] transition-colors">{phone}</a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CHAIRMAN'S MESSAGE */}
      <section id="ceo-message" className="py-24 bg-[#05080a] border-t border-[#c5a059]/5">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="bg-[#0e1217] rounded-xl border border-[#c5a059]/10 p-8 sm:p-12 relative overflow-hidden text-center max-w-3xl mx-auto">
            <span className="text-5xl text-[#c5a059]/20 absolute top-6 right-8"><i className="fa-solid fa-quote-right"></i></span>
            <h3 className="text-[#c5a059] text-xs uppercase tracking-widest font-semibold mb-2">Chairman's Message</h3>
            <h4 className="text-2xl font-serif text-white mb-4 font-bold">A Sacred Commitment to Quality</h4>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 italic max-w-2xl mx-auto">
              "Our mission at Insight Travel is rooted in trust, integrity, and absolute devotion. Having guided thousands of pilgrims from Pakistan and across the globe, we pledge our signature standards of comfort and care as you answer the sacred call. Your spiritual satisfaction is our ultimate reward."
            </p>
            <div>
              <p className="text-white font-bold text-sm">Chauhdry Muhammad Aslam</p>
              <p className="text-[#c5a059] text-xs">Chairman, Insight Travel & Tourism</p>
              <p className="text-[#c5a059] text-xs">+966 50 086 1820, a@iicc.sa</p>
            </div>
          </div>
        </div>
      </section>

      {/* LEAD INQUIRY SECTION */}
      <section id="contact" className="py-24 bg-[#080d12]/50 border-t border-[#c5a059]/5">
        <div className="container mx-auto px-6 max-w-7xl grid md:grid-cols-12 gap-12">
          <div className="md:col-span-5 flex flex-col justify-center">
            <h2 className="text-3xl font-serif text-white mb-6">Plan Your Custom Journey</h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              Fill out our responsive inquiry form to lock in promotional packages, map custom flight paths, or consult with our regional experts.
            </p>
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-4 text-sm text-gray-300">
                <span className="text-[#c5a059] text-xl"><i className="fa-solid fa-location-dot"></i></span>
                <span>Al-Madinah Al-Munawarah, Saudi Arabia</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-300">
                <span className="text-[#c5a059] text-xl"><i className="fa-solid fa-envelope"></i></span>
                <span>info@itt.sa</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-300">
                <span className="text-[#c5a059] text-xl"><i className="fa-solid fa-phone"></i></span>
                <span>+966 50 086 1820</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-7 bg-[#0e1217] p-8 sm:p-10 rounded border border-[#c5a059]/10">
            <form onSubmit={handleInquirySubmit} className="flex flex-col gap-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="Full Name"
                  required
                  className="w-full bg-[#05080a]/60 border border-gray-800 focus:border-[#c5a059] text-white px-4 py-3 rounded outline-none text-sm transition-all"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  placeholder="Email Address"
                  required
                  className="w-full bg-[#05080a]/60 border border-gray-800 focus:border-[#c5a059] text-white px-4 py-3 rounded outline-none text-sm transition-all"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleFormChange}
                  placeholder="Phone Number"
                  required
                  className="w-full bg-[#05080a]/60 border border-gray-800 focus:border-[#c5a059] text-white px-4 py-3 rounded outline-none text-sm transition-all"
                />
                <select
                  name="service"
                  value={formData.service}
                  onChange={handleFormChange}
                  required
                  className="w-full bg-[#05080a]/60 border border-gray-800 focus:border-[#c5a059] text-gray-300 px-4 py-3 rounded outline-none text-sm transition-all"
                >
                  <option value="" disabled>Interested in...</option>
                  <option value="Hajj Package">Sacred Hajj Package</option>
                  <option value="Umrah Package">Sacred Umrah Package</option>
                  <option value="World Tourism">World Tourism (7 Wonders)</option>
                  <option value="Flight Ticketing">Flight Ticketing</option>
                </select>
              </div>

              <textarea
                name="message"
                value={formData.message}
                onChange={handleFormChange}
                rows={4}
                placeholder="Specific preferences or travel dates..."
                required
                className="w-full bg-[#05080a]/60 border border-gray-800 focus:border-[#c5a059] text-white px-4 py-3 rounded outline-none text-sm transition-all"
              />

              {submitStatus.type && (
                <div className={`p-4 rounded text-sm ${submitStatus.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                  submitStatus.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                    'bg-[#c5a059]/10 text-[#c5a059] border border-[#c5a059]/20'
                  }`}>
                  {submitStatus.message}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 bg-[#c5a059] hover:bg-[#b48e47] text-[#05080a] font-bold rounded transition-colors"
              >
                Submit Inquiry
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

function PortalView({ loading, packages, selectedCity, setSelectedCity, searchQuery, setSearchQuery, openBookingModal, displayCurrency, setDisplayCurrency, formatConvertedPrice, formatShortPrice }: any) {
  const navigate = useNavigate();

  return (
    <section className="py-16 bg-[#05080a] flex-grow animate-fadeIn">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-[#0e1217] to-[#080b0f] border border-[#c5a059]/15 rounded-xl p-8 mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2.5 text-xs text-[#c5a059] font-bold uppercase tracking-wider mb-2">
              <span className="hover:underline cursor-pointer" onClick={() => navigate('/')}>Home</span>
              <span><i className="fa-solid fa-chevron-right text-[10px]"></i></span>
              <span>Umrah Booking E-Portal</span>
            </div>
            <h2 className="text-3xl font-serif text-white font-bold">Umrah Booking E-Portal</h2>
            <p className="text-gray-400 text-sm mt-1 leading-relaxed">
              Categorized offerings from Islamabad, Karachi, Lahore, Sialkot, Peshawar, Multan, and Faisalabad.
            </p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2.5 bg-transparent border border-gray-800 text-gray-300 rounded hover:border-[#c5a059] hover:text-[#c5a059] transition-all text-sm font-semibold flex items-center gap-2"
          >
            <i className="fa-solid fa-arrow-left"></i> Back to Homepage
          </button>
        </div>

        {/* Currency Switcher */}
        <div className="flex justify-between items-center bg-[#0e1217] border border-gray-800 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-[#c5a059] text-xs"><i className="fa-solid fa-coins"></i></span>
            <span className="text-xs font-bold text-white uppercase tracking-wider">Select Display Currency</span>
            <span className="text-[10px] text-gray-500 font-mono">(Rates fetch live)</span>
          </div>
          <div className="flex gap-2">
            {(['PKR', 'USD', 'SAR', 'AED'] as const).map(curr => (
              <button
                key={curr}
                type="button"
                onClick={() => setDisplayCurrency(curr)}
                className={`px-4 py-1.5 rounded text-xs font-bold transition-all ${displayCurrency === curr
                  ? 'bg-[#c5a059] text-[#05080a]'
                  : 'bg-transparent text-gray-400 border border-gray-800 hover:border-gray-700 hover:text-white'
                  }`}
              >
                {curr}
              </button>
            ))}
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex flex-col md:flex-row gap-6 justify-between items-center mb-10 bg-[#0e1217] p-5 rounded-lg border border-[#c5a059]/10">
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {['All', 'Islamabad', 'Karachi', 'Lahore', 'Sialkot', 'Peshawar', 'Multan', 'Faisalabad'].map(city => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border transition-all ${selectedCity === city
                  ? 'bg-[#c5a059] text-[#05080a] border-[#c5a059] shadow-lg shadow-[#c5a059]/15'
                  : 'bg-[#05080a] text-gray-400 border-gray-800 hover:border-gray-700 hover:text-white'
                  }`}
              >
                {city === 'All' ? 'All Cities' : `From ${city}`}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              <i className="fa-solid fa-magnifying-glass text-xs"></i>
            </span>
            <input
              type="text"
              placeholder="Search packages or hotels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#05080a]/80 border border-gray-800 focus:border-[#c5a059] text-white pl-9 pr-4 py-2 rounded text-xs outline-none transition-all placeholder:text-gray-600"
            />
          </div>
        </div>

        {/* Dynamic Display */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <span className="text-[#c5a059] text-4xl animate-spin"><i className="fa-solid fa-circle-notch"></i></span>
            <p className="text-gray-400 text-sm">Loading dynamic packages...</p>
          </div>
        ) : (
          (() => {
            const filtered = packages.filter((pkg: any) => {
              const matchesCity = selectedCity === 'All' || pkg.city.toLowerCase() === selectedCity.toLowerCase();
              const matchesSearch = searchQuery === '' ||
                pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                pkg.hotels.makkah.toLowerCase().includes(searchQuery.toLowerCase()) ||
                pkg.hotels.madinah.toLowerCase().includes(searchQuery.toLowerCase()) ||
                pkg.description.toLowerCase().includes(searchQuery.toLowerCase());
              return matchesCity && matchesSearch;
            });

            if (filtered.length === 0) {
              return (
                <div className="text-center py-20 bg-[#0e1217] rounded-lg border border-gray-800">
                  <span className="text-5xl text-gray-700 block mb-4"><i className="fa-solid fa-folder-open"></i></span>
                  <h4 className="text-lg font-bold text-white mb-1">No Packages Found</h4>
                  <p className="text-gray-500 text-xs">Try selecting another city tab or clearing your search filter.</p>
                </div>
              );
            }

            return (
              <div className="grid md:grid-cols-3 gap-6 animate-fadeIn">
                {filtered.map((pkg: any, index: number) => {
                  return (
                    <div key={pkg._id || index} className="bg-[#0e1217] rounded-xl overflow-hidden border border-[#c5a059]/10 hover:border-[#c5a059]/20 transition-all flex flex-col group shadow-lg">
                      <div className="p-6 flex flex-col flex-grow">
                        <div className="flex justify-between items-start gap-2 mb-3">
                          <span className="px-2 py-0.5 bg-[#c5a059]/10 border border-[#c5a059]/20 text-[#c5a059] rounded text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">
                            {pkg.duration}
                          </span>
                          <span className="px-2 py-0.5 bg-gray-800/80 text-gray-300 rounded text-[10px] font-semibold tracking-wide whitespace-nowrap">
                            <i className="fa-solid fa-plane-departure mr-1"></i> {pkg.city}
                          </span>
                        </div>

                        <div className="mb-3">
                          <h3 className="text-lg font-extrabold text-white group-hover:text-[#c5a059] transition-colors leading-tight mb-1">{pkg.title}</h3>
                          <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                            Starts <span className="text-[#c5a059] font-extrabold text-sm">{formatConvertedPrice(pkg.price_sharing || (pkg.price ? parseInt(pkg.price.replace(/[^0-9]/g, '')) : 0), displayCurrency)}</span>
                          </div>
                        </div>

                        <p className="text-gray-400 text-xs leading-relaxed mb-4 line-clamp-2 h-8">{pkg.description}</p>

                        <div className="bg-[#05080a]/60 border border-gray-800/80 p-3 rounded-lg flex flex-col gap-2 mb-4">
                          <div className="flex items-center gap-2.5 text-[11px] text-gray-300">
                            <span className="text-[#c5a059]"><i className="fa-solid fa-kaaba"></i></span>
                            <span className="truncate">Makkah: <strong>{pkg.hotels.makkah}</strong></span>
                          </div>
                          <div className="flex items-center gap-2.5 text-[11px] text-gray-300">
                            <span className="text-[#c5a059]"><i className="fa-solid fa-mosque"></i></span>
                            <span className="truncate">Madinah: <strong>{pkg.hotels.madinah}</strong></span>
                          </div>
                        </div>

                        <div className="mb-4">
                          <h4 className="text-[10px] font-bold uppercase text-[#c5a059] tracking-wider mb-2">Package Inclusions</h4>
                          <div className="grid grid-cols-2 gap-1.5 text-[10px] text-gray-400">
                            {pkg.features ? pkg.features.slice(0, 4).map((feat: string, fIdx: number) => (
                              <div key={fIdx} className="flex items-center gap-1.5">
                                <span className="text-green-500"><i className="fa-solid fa-circle-check text-[8px]"></i></span>
                                <span className="truncate">{feat}</span>
                              </div>
                            )) : (
                              <>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-green-500"><i className="fa-solid fa-circle-check text-[8px]"></i></span>
                                  <span>Flights Included</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-green-500"><i className="fa-solid fa-circle-check text-[8px]"></i></span>
                                  <span>Visa & Insurance</span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="border border-gray-800 rounded-lg overflow-hidden mb-5 text-[11px] bg-[#05080a]/30">
                          <div className="bg-gray-900/40 grid grid-cols-4 py-1.5 px-2 text-gray-400 font-bold border-b border-gray-800 text-center">
                            <div>Db</div>
                            <div>Tr</div>
                            <div>Qd</div>
                            <div>Sh</div>
                          </div>
                          <div className="grid grid-cols-4 py-1.5 px-2 text-center text-[#c5a059] font-bold">
                            <div>{pkg.price_double ? formatShortPrice(pkg.price_double, displayCurrency) : 'N/A'}</div>
                            <div>{pkg.price_triple ? formatShortPrice(pkg.price_triple, displayCurrency) : 'N/A'}</div>
                            <div>{pkg.price_quad ? formatShortPrice(pkg.price_quad, displayCurrency) : 'N/A'}</div>
                            <div>{pkg.price_sharing ? formatShortPrice(pkg.price_sharing, displayCurrency) : 'N/A'}</div>
                          </div>
                        </div>

                        <button
                          onClick={() => openBookingModal(pkg)}
                          className="mt-auto w-full py-2.5 bg-[#c5a059] text-[#05080a] font-bold rounded-lg hover:bg-[#b48e47] transition-all flex items-center justify-center gap-2 shadow shadow-[#c5a059]/10 text-xs"
                        >
                          Book Online <i className="fa-solid fa-cart-shopping"></i>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()
        )}
      </div>
    </section>
  );
}

/* PARTNER REGISTER VIEW */

function PartnerRegisterView({ BACKEND_URL }: { BACKEND_URL: string }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    agencyName: '',
    contactName: '',
    email: '',
    phone: '',
    licenseNo: '',
    address: '',
    experience: 3,
    bio: '',
    jvConsent: false
  });
  const [loading, setLoading] = useState(false);
  const [regResult, setRegResult] = useState<{ agent_id: string; agency_name: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/subagents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setRegResult({ agent_id: data.agent_id, agency_name: data.agency_name });
      } else {
        alert(data.error || 'Failed to submit application.');
      }
    } catch (err) {
      alert('Network error. Failed to reach backend server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 bg-[#05080a] flex-grow animate-fadeIn">
      <div className="container mx-auto px-6 max-w-3xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Partner With <span className="text-[#c5a059]">Our Travel Agency</span></h1>
          <p className="text-gray-400 text-sm mt-3 max-w-xl mx-auto">
            Grow your pilgrimage business by becoming an authorized sub-agent. Access premium rates, real-time booking, and white-label tools instantly.
          </p>
        </div>

        <div className="bg-[#0e1217] border border-[#c5a059]/15 p-8 rounded-2xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#c5a059] to-transparent"></div>

          {regResult ? (
            <div className="text-center py-6 flex flex-col items-center gap-4">
              <span className="text-5xl text-green-500"><i className="fa-solid fa-circle-check"></i></span>
              <h3 className="text-2xl font-bold text-white">Application Submitted!</h3>
              <p className="text-gray-400 text-sm max-w-md leading-relaxed">
                Thank you, <strong>{regResult.agency_name}</strong>. Your partner request has been registered. Reference ID: <strong className="text-[#c5a059] font-mono">{regResult.agent_id}</strong>.
              </p>
              <div className="bg-[#05080a] p-5 rounded-lg border border-gray-800 text-left max-w-md mt-4 text-xs text-gray-400 flex flex-col gap-2.5">
                <div className="font-bold text-white flex items-center gap-1.5"><i className="fa-solid fa-circle-info text-[#c5a059]"></i> What happens next?</div>
                <ol className="list-decimal pl-4 flex flex-col gap-1.5">
                  <li>Our verification department will review your business details.</li>
                  <li>An email containing your approval status and access keys will be dispatched.</li>
                  <li>You can then start booking dynamic Umrah packages directly at agent commissions.</li>
                </ol>
              </div>
              <button onClick={() => navigate('/')} className="mt-6 px-6 py-2.5 bg-[#c5a059] text-[#05080a] font-bold rounded">Return to Homepage</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <h3 className="text-lg font-bold text-white border-b border-gray-800 pb-3 flex items-center gap-2"><i className="fa-solid fa-hotel text-[#c5a059]"></i> Agency Details Form</h3>

              <div className="grid sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold uppercase text-[#c5a059] tracking-wider">Agency / Company Name</label>
                  <input
                    type="text"
                    placeholder="Al-Basit Travel (Pvt) Ltd"
                    required
                    value={form.agencyName}
                    onChange={(e) => setForm(prev => ({ ...prev, agencyName: e.target.value }))}
                    className="bg-[#05080a] border border-gray-800 focus:border-[#c5a059] text-white px-3.5 py-2.5 rounded text-xs outline-none"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold uppercase text-[#c5a059] tracking-wider">Primary Contact Person</label>
                  <input
                    type="text"
                    placeholder="Muhammad Ali"
                    required
                    value={form.contactName}
                    onChange={(e) => setForm(prev => ({ ...prev, contactName: e.target.value }))}
                    className="bg-[#05080a] border border-gray-800 focus:border-[#c5a059] text-white px-3.5 py-2.5 rounded text-xs outline-none"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold uppercase text-[#c5a059] tracking-wider">Business Email Address</label>
                  <input
                    type="email"
                    placeholder="contact@agency.com"
                    required
                    value={form.email}
                    onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                    className="bg-[#05080a] border border-gray-800 focus:border-[#c5a059] text-white px-3.5 py-2.5 rounded text-xs outline-none"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold uppercase text-[#c5a059] tracking-wider">Phone / WhatsApp Number</label>
                  <input
                    type="tel"
                    placeholder="+92 300 1234567"
                    required
                    value={form.phone}
                    onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="bg-[#05080a] border border-gray-800 focus:border-[#c5a059] text-white px-3.5 py-2.5 rounded text-xs outline-none"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold uppercase text-[#c5a059] tracking-wider">Business License / Registration No (Optional)</label>
                  <input
                    type="text"
                    placeholder="DTS-LHR-9481"
                    value={form.licenseNo}
                    onChange={(e) => setForm(prev => ({ ...prev, licenseNo: e.target.value }))}
                    className="bg-[#05080a] border border-gray-800 focus:border-[#c5a059] text-white px-3.5 py-2.5 rounded text-xs outline-none"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold uppercase text-[#c5a059] tracking-wider">City & Country</label>
                  <input
                    type="text"
                    placeholder="Lahore, Pakistan"
                    required
                    value={form.address}
                    onChange={(e) => setForm(prev => ({ ...prev, address: e.target.value }))}
                    className="bg-[#05080a] border border-gray-800 focus:border-[#c5a059] text-white px-3.5 py-2.5 rounded text-xs outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold uppercase text-[#c5a059] tracking-wider">Years of Experience in Hajj & Umrah Tourism</label>
                <select
                  value={form.experience}
                  onChange={(e) => setForm(prev => ({ ...prev, experience: parseInt(e.target.value) }))}
                  className="bg-[#05080a] border border-gray-800 focus:border-[#c5a059] text-gray-300 px-3.5 py-2.5 rounded text-xs outline-none"
                >
                  <option value={0}>Less than 1 year</option>
                  <option value={1}>1 - 2 Years</option>
                  <option value={3}>3 - 5 Years</option>
                  <option value={5}>5 - 10 Years</option>
                  <option value={10}>10+ Years</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold uppercase text-[#c5a059] tracking-wider">Brief Agency Profile / Description</label>
                <textarea
                  rows={4}
                  placeholder="Tell us about your agency, number of monthly pilgrims you handle..."
                  value={form.bio}
                  onChange={(e) => setForm(prev => ({ ...prev, bio: e.target.value }))}
                  className="bg-[#05080a] border border-gray-800 focus:border-[#c5a059] text-white px-3.5 py-2.5 rounded text-xs outline-none"
                />
              </div>

              <div className="flex items-start gap-3 bg-[#05080a] border border-[#c5a059]/10 p-4 rounded-lg">
                <input
                  type="checkbox"
                  id="jvConsent"
                  required
                  checked={form.jvConsent}
                  onChange={(e) => setForm(prev => ({ ...prev, jvConsent: e.target.checked }))}
                  className="mt-1 cursor-pointer accent-[#c5a059]"
                />
                <label htmlFor="jvConsent" className="text-xs text-gray-300 leading-relaxed cursor-pointer select-none">
                  I accept and agree to the terms of the{' '}
                  <a
                    href={`${BACKEND_URL}/uploaded-files/JV Partners/General JV Contract Template.pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#c5a059] hover:underline font-bold inline-flex items-center gap-1"
                  >
                    Joint Venture Agreement <i className="fa-solid fa-file-pdf"></i>
                  </a>
                  {' '}as consent to proceed with partner registration.
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#c5a059] text-[#05080a] font-bold rounded hover:bg-[#b48e47] transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><i className="fa-solid fa-circle-notch fa-spin"></i> Submitting Request...</>
                ) : (
                  'Submit Registration Application'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

/* PARTNER DASHBOARD VIEW */
function PartnerDashboardView({ BACKEND_URL, exchangeRates }: { BACKEND_URL: string, exchangeRates: any }) {
  const [agentId, setAgentId] = useState('');
  const [phone, setPhone] = useState('');
  const [partner, setPartner] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const EXCHANGE_RATE = exchangeRates?.sarToPkr || 74.5;
  const USD_RATE = exchangeRates?.usdToPkr || 278.0;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoginError('');
    try {
      const res = await fetch(`${BACKEND_URL}/api/partner/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId: agentId.trim(), phone: phone.trim() })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPartner(data.agent);
        fetchBookings(data.agent.name);
      } else {
        setLoginError(data.error || 'Invalid credentials or pending approval.');
      }
    } catch (err) {
      setLoginError('Network error. Unable to connect to server.');
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async (id: string) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/partner/bookings/${id}`);
      const data = await res.json();
      if (res.ok) {
        setBookings(data);
      }
    } catch (err) {
      console.error('Failed to fetch bookings', err);
    }
  };

  const handleLogout = () => {
    setPartner(null);
    setBookings([]);
    setAgentId('');
    setPhone('');
  };

  const totalSalesPKR = bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
  const totalSalesSAR = totalSalesPKR / EXCHANGE_RATE;
  const totalSalesUSD = totalSalesPKR / USD_RATE;

  const commissionPKR = totalSalesPKR * 0.05;
  const commissionSAR = totalSalesSAR * 0.05;
  const commissionUSD = totalSalesUSD * 0.05;

  if (!partner) {
    return (
      <section className="py-24 bg-[#05080a] flex-grow animate-fadeIn">
        <div className="container mx-auto px-6 max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-white">Partner <span className="text-[#c5a059]">Dashboard</span></h1>
            <p className="text-gray-400 text-xs mt-2">Sign in with your Agent ID and Registered Phone Number</p>
          </div>

          <div className="bg-[#0e1217] border border-[#c5a059]/15 p-6 rounded-2xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#c5a059] to-transparent"></div>

            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              {loginError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded text-center font-semibold">
                  {loginError}
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase text-[#c5a059] tracking-wider">Agent Reference ID</label>
                <input
                  type="text"
                  placeholder="AGT-2026-0001"
                  required
                  value={agentId}
                  onChange={(e) => setAgentId(e.target.value)}
                  className="bg-[#05080a] border border-gray-800 focus:border-[#c5a059] text-white px-3.5 py-2.5 rounded text-xs outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase text-[#c5a059] tracking-wider">Registered Phone Number</label>
                <input
                  type="tel"
                  placeholder="+92 300 1234567"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-[#05080a] border border-gray-800 focus:border-[#c5a059] text-white px-3.5 py-2.5 rounded text-xs outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#c5a059] text-[#05080a] font-bold rounded hover:bg-[#b48e47] transition-all flex items-center justify-center gap-2 mt-2 text-xs uppercase tracking-wider font-semibold"
              >
                {loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : 'Sign In'}
              </button>
            </form>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-[#05080a] flex-grow animate-fadeIn">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Portal Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-800 pb-6 mb-8">
          <div>
            <div className="text-xs text-[#c5a059] font-bold uppercase tracking-widest font-mono">B2B Partner Portal</div>
            <h1 className="text-3xl font-black text-white mt-1">{partner.agencyName}</h1>
            <p className="text-gray-400 text-xs mt-1">Welcome back, {partner.contactName} &bull; ID: <strong className="text-[#c5a059] font-mono">{partner.name}</strong></p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={`${BACKEND_URL}/uploaded-files/JV Partners/General JV Contract Template.pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-[#c5a059]/10 border border-[#c5a059]/25 text-[#c5a059] text-xs font-bold rounded hover:bg-[#c5a059] hover:text-[#05080a] transition-all flex items-center gap-2"
            >
              <i className="fa-solid fa-file-pdf"></i> Download JV Contract
            </a>
            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-red-500/30 text-red-400 text-xs font-semibold rounded hover:bg-red-500/10 transition-all"
            >
              Log Out
            </button>
          </div>
        </div>

        {/* Dynamic currency alert bar */}
        <div className="bg-[#0e1217] border border-[#c5a059]/15 p-4 rounded-xl flex flex-wrap gap-6 items-center justify-between text-xs mb-8">
          <div className="flex items-center gap-2">
            <span className="text-[#c5a059] text-base"><i className="fa-solid fa-calculator"></i></span>
            <div>
              <span className="font-bold text-white uppercase">Live Exchange Spot Rates Active</span>
              <p className="text-gray-500 text-[10px]">Real-time commissions and booking values computed in 3 major currencies.</p>
            </div>
          </div>
          <div className="flex gap-4 font-mono text-gray-400">
            <span className="bg-[#05080a] px-3 py-1.5 rounded border border-gray-800">
              1 SAR = <strong className="text-[#c5a059]">{EXCHANGE_RATE.toFixed(2)} PKR</strong>
            </span>
            <span className="bg-[#05080a] px-3 py-1.5 rounded border border-gray-800">
              1 USD = <strong className="text-blue-400">{USD_RATE.toFixed(2)} PKR</strong>
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Sales Volume */}
          <div className="bg-[#0e1217] border border-[#c5a059]/15 p-6 rounded-xl shadow-lg relative overflow-hidden flex flex-col justify-between">
            <div className="absolute -right-3 -bottom-3 text-7xl text-[#c5a059]/5"><i className="fa-solid fa-coins"></i></div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total B2B Sales Volume</span>
              <div className="text-2xl font-black text-white mt-2">
                PKR {totalSalesPKR.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
              <div className="text-[11px] text-[#c5a059] font-mono mt-2 flex flex-col gap-0.5">
                <span>SAR: {totalSalesSAR.toLocaleString(undefined, { maximumFractionDigits: 0 })} SAR</span>
                <span>USD: {totalSalesUSD.toLocaleString(undefined, { maximumFractionDigits: 0 })} USD</span>
              </div>
            </div>
          </div>

          {/* Commissions Card */}
          <div className="bg-[#0e1217] border border-[#c5a059]/15 p-6 rounded-xl shadow-lg relative overflow-hidden flex flex-col justify-between">
            <div className="absolute -right-3 -bottom-3 text-7xl text-green-500/5"><i className="fa-solid fa-chart-line"></i></div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Commissions Earned (5%)</span>
              <div className="text-2xl font-black text-green-400 mt-2">
                PKR {commissionPKR.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
              <div className="text-[11px] text-gray-400 font-mono mt-2 flex flex-col gap-0.5">
                <span>SAR: {commissionSAR.toLocaleString(undefined, { maximumFractionDigits: 0 })} SAR</span>
                <span>USD: {commissionUSD.toLocaleString(undefined, { maximumFractionDigits: 0 })} USD</span>
              </div>
            </div>
          </div>

          {/* Dynamic Bookings */}
          <div className="bg-[#0e1217] border border-[#c5a059]/15 p-6 rounded-xl shadow-lg relative overflow-hidden flex flex-col justify-between">
            <div className="absolute -right-3 -bottom-3 text-7xl text-blue-500/5"><i className="fa-solid fa-user-group"></i></div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Bookings Logged</span>
              <div className="text-3xl font-black text-blue-400 mt-2">
                {bookings.length}
              </div>
              <div className="text-[11px] text-gray-500 mt-2">
                Pilgrims Transited: <strong className="text-white font-bold">{bookings.reduce((acc, b) => acc + (b.pilgrimsCount || 0), 0)}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-[#0e1217] border border-gray-800 rounded-xl overflow-hidden shadow-lg">
          <div className="bg-[#05080a] py-4 px-6 border-b border-gray-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Your B2B Bookings Log</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#05080a] text-gray-400 uppercase font-bold border-b border-gray-800">
                <tr>
                  <th className="py-3.5 px-4">Booking ID</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Package</th>
                  <th className="py-3.5 px-4 text-center">Pilgrims</th>
                  <th className="py-3.5 px-4 text-right">Base Cost</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 text-gray-300">
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-500">No B2B bookings registered yet. Use your Agent ID at checkout.</td>
                  </tr>
                ) : (
                  bookings.map((booking: any, idx: number) => {
                    const pricePKR = booking.totalPrice || 0;
                    const priceSAR = pricePKR / EXCHANGE_RATE;
                    const priceUSD = pricePKR / USD_RATE;
                    return (
                      <tr key={booking._id || idx} className="hover:bg-gray-900/40">
                        <td className="py-4 px-4 font-mono text-[#c5a059] font-bold">{booking._id ? booking._id.substring(18) : `B-${idx}`}</td>
                        <td className="py-4 px-4">
                          <div className="font-bold text-white">{booking.contact.name}</div>
                          <div className="text-[10px] text-gray-500">{booking.contact.phone}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-semibold text-white">{booking.packageName} ({booking.roomingType})</div>
                          <div className="text-[10px] mt-1">
                            {booking.isCustomized ? (
                              <span className="text-yellow-400 font-bold bg-yellow-500/10 border border-yellow-500/20 px-1.5 py-0.5 rounded text-[9px]">Customized Pack</span>
                            ) : (
                              <span className="text-gray-400 bg-gray-800/60 border border-gray-700 px-1.5 py-0.5 rounded text-[9px]">Complete Pack</span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center font-bold text-white">{booking.pilgrimsCount}</td>
                        <td className="py-4 px-4 text-right">
                          <div className="font-black text-white">PKR {pricePKR.toLocaleString()}</div>
                          <div className="text-[9px] text-gray-400 font-mono">
                            {priceSAR.toLocaleString(undefined, { maximumFractionDigits: 0 })} SAR / {priceUSD.toLocaleString(undefined, { maximumFractionDigits: 0 })} USD
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="px-2 py-0.5 rounded bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 font-bold text-[9px] uppercase">
                            {booking.status || 'Pending Payment'}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

/* CUSTOMER PORTAL VIEW */
function CustomerPortalView({ BACKEND_URL, exchangeRates }: { BACKEND_URL: string, exchangeRates: any }) {
  const [query, setQuery] = useState('');
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const EXCHANGE_RATE = exchangeRates?.sarToPkr || 74.5;
  const USD_RATE = exchangeRates?.usdToPkr || 278.0;

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setBooking(null);

    try {
      const res = await fetch(`${BACKEND_URL}/api/customer/lookup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query.trim() })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setBooking(data.booking);
      } else {
        setError(data.error || 'No matching booking record found.');
      }
    } catch (err) {
      setError('Connection error. Failed to reach the database.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 bg-[#05080a] flex-grow animate-fadeIn">
      <div className="container mx-auto px-6 max-w-3xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Customer <span className="text-[#c5a059]">Booking Portal</span></h1>
          <p className="text-gray-400 text-sm mt-3 max-w-xl mx-auto">
            Retrieve your official booking receipt, check status real-time, and download your travel itinerary documents.
          </p>
        </div>

        {/* Lookup form */}
        <div className="bg-[#0e1217] border border-[#c5a059]/15 p-6 rounded-xl shadow-2xl mb-8">
          <form onSubmit={handleLookup} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-grow flex flex-col gap-1.5">
              <input
                type="text"
                placeholder="Enter Passport Number or Booking Reference ID"
                required
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-[#05080a] border border-gray-800 focus:border-[#c5a059] text-white px-4 py-3 rounded text-xs outline-none font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="py-3 px-8 bg-[#c5a059] text-[#05080a] font-bold rounded hover:bg-[#b48e47] transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider font-semibold whitespace-nowrap"
            >
              {loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : 'Lookup Booking'}
            </button>
          </form>
          {error && <p className="text-red-400 text-xs font-semibold mt-3 text-center">{error}</p>}
        </div>

        {/* Results Container */}
        {booking && (
          <div className="bg-[#0e1217] border border-[#c5a059]/20 rounded-2xl shadow-2xl overflow-hidden relative font-sans">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#c5a059] to-transparent"></div>

            {/* Receipt Header */}
            <div className="bg-[#05080a] py-6 px-8 border-b border-gray-850 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-[10px] text-[#c5a059] font-bold uppercase tracking-widest font-mono">Official Booking Receipt</span>
                <h3 className="text-lg font-bold text-white mt-0.5">Travel & Tourism Agency</h3>
                <p className="text-[10px] text-gray-500 font-mono mt-0.5">Issued on: {new Date(booking.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <span className="px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 font-bold uppercase tracking-wider text-[10px]">
                  {booking.status}
                </span>
                <div className="text-[10px] text-gray-400 font-mono mt-2">Ref: <span className="text-white font-bold">{booking._id}</span></div>
              </div>
            </div>

            {/* Receipt Body */}
            <div className="p-8 flex flex-col gap-6">
              {/* Product and rooming details */}
              <div className="grid grid-cols-2 gap-6 bg-[#05080a]/60 border border-gray-850 p-4 rounded-lg">
                <div>
                  <div className="text-[10px] text-gray-500 font-bold uppercase">Package Choice</div>
                  <div className="text-sm font-bold text-white mt-1">{booking.packageName}</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-500 font-bold uppercase">Rooming Preference</div>
                  <div className="text-sm font-bold text-white mt-1 capitalize">{booking.roomingType} Configuration</div>
                </div>
              </div>

              {/* Package Customization Mode Indicator */}
              <div className="bg-[#05080a]/60 border border-gray-850 p-4 rounded-lg text-xs">
                <div className="text-[10px] text-[#c5a059] font-bold uppercase tracking-wider mb-2">Package Service Mode</div>
                {!booking.isCustomized ? (
                  <div className="text-gray-300 font-medium flex items-center gap-2">
                    <span className="text-green-500"><i className="fa-solid fa-circle-check"></i></span> Complete Package (All standard services included)
                  </div>
                ) : (
                  <div>
                    <div className="text-yellow-400 font-bold mb-2 flex items-center gap-2">
                      <span className="text-yellow-400"><i className="fa-solid fa-sliders"></i></span> Customized Package (Services selected below)
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2 font-mono text-[10px]">
                      {[
                        { key: 'visa', label: 'Visa Processing' },
                        { key: 'tickets', label: 'Flight Tickets' },
                        { key: 'ground', label: 'Ground Travel' },
                        { key: 'catering', label: 'Catering/Meals' },
                        { key: 'accommodation', label: 'Accommodation' }
                      ].map(srv => {
                        const included = booking.customServices?.[srv.key] !== false;
                        return (
                          <div key={srv.key} className="flex items-center gap-1.5">
                            <span className={included ? 'text-green-500' : 'text-red-500'}>
                              <i className={`fa-solid ${included ? 'fa-circle-check' : 'fa-circle-xmark'}`}></i>
                            </span>
                            <span className={included ? 'text-gray-300' : 'text-gray-500 line-through'}>{srv.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Passenger info */}
              <div>
                <h4 className="text-xs font-bold uppercase text-[#c5a059] tracking-wider mb-3">Pilgrims Registered</h4>
                <div className="flex flex-col gap-2">
                  {booking.pilgrims.map((p: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center text-xs bg-[#05080a]/30 py-2.5 px-4 rounded border border-gray-850">
                      <div className="font-bold text-white">{idx + 1}. {p.name}</div>
                      <div className="font-mono text-gray-400">Passport: {p.passportNumber}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing breakdown (Three-Currency Display) */}
              <div>
                <h4 className="text-xs font-bold uppercase text-[#c5a059] tracking-wider mb-3">Total Amount Breakdown</h4>
                <div className="bg-[#05080a] border border-gray-850 p-5 rounded-lg flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">Total Price in PKR</span>
                    <span className="text-lg font-black text-white">PKR {booking.totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-gray-850/60 pt-3 flex justify-between items-center text-xs">
                    <span className="text-gray-500">Saudi Riyal Equivalent</span>
                    <span className="font-bold text-[#c5a059]">{(booking.totalPrice / EXCHANGE_RATE).toLocaleString(undefined, { maximumFractionDigits: 0 })} SAR</span>
                  </div>
                  <div className="border-t border-gray-850/60 pt-3 flex justify-between items-center text-xs">
                    <span className="text-gray-500">US Dollar Equivalent</span>
                    <span className="font-bold text-blue-400">{(booking.totalPrice / USD_RATE).toLocaleString(undefined, { maximumFractionDigits: 0 })} USD</span>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="border-t border-gray-850/60 pt-6">
                <div className="text-[10px] text-gray-500 font-bold uppercase mb-2">Booking Contact Details</div>
                <div className="text-xs text-gray-400 leading-relaxed">
                  For updates, please contact: <strong className="text-white">{booking.contact.name}</strong> ({booking.contact.phone} / {booking.contact.email}).
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* STAFF BI DASHBOARD VIEW Component */
function DashboardView({ dashboardStats, bookings, inquiries, exchangeRates, subagents = [], BACKEND_URL }: any) {
  const [viewMode, setViewMode] = useState<'overview' | 'budget' | 'partners'>('overview');
  const [partnerFiles, setPartnerFiles] = useState<any[]>([]);

  useEffect(() => {
    if (BACKEND_URL) {
      fetch(`${BACKEND_URL}/api/partners/files`)
        .then(res => res.json())
        .then(data => setPartnerFiles(data))
        .catch(err => console.warn('Could not load partner files:', err));
    }
  }, [BACKEND_URL]);

  const partnerStats = React.useMemo(() => {
    const stats: { [agentId: string]: { name: string; agency: string; bookingsCount: number; revenue: number } } = {};

    subagents.forEach((agent: any) => {
      stats[agent.name] = {
        name: agent.contactName,
        agency: agent.agencyName,
        bookingsCount: 0,
        revenue: 0
      };
    });

    bookings.forEach((booking: any) => {
      if (booking.partnerId) {
        const id = booking.partnerId;
        if (!stats[id]) {
          stats[id] = {
            name: 'External Partner',
            agency: `Partner ID: ${id}`,
            bookingsCount: 0,
            revenue: 0
          };
        }
        stats[id].bookingsCount += 1;
        stats[id].revenue += booking.totalPrice || 0;
      }
    });

    return Object.entries(stats).map(([id, info]) => ({
      id,
      ...info
    })).sort((a, b) => b.revenue - a.revenue);
  }, [bookings, subagents]);

  // Exchange Rates (Dynamic Live Spot rate or static budget fallback)
  const EXCHANGE_RATE = exchangeRates?.sarToPkr || 74.5;
  const USD_RATE = exchangeRates?.usdToPkr || 278.0;
  const USD_TO_SAR = exchangeRates?.usdToSar || 3.73;

  // Budget Constants
  const BUDGET_EXCHANGE_RATE = 74.5; // Static rate from budget sheet
  const BUDGET_TOTAL_REVENUE_SAR = 105600000;
  const BUDGET_TOTAL_REVENUE_PKR = BUDGET_TOTAL_REVENUE_SAR * BUDGET_EXCHANGE_RATE;
  const BUDGET_TARGET_PILGRIMS = 30000;
  const BUDGET_GROSS_PROFIT_SAR = 7050000;
  const BUDGET_NET_PROFIT_SAR = 3930157;
  const BUDGET_NET_PROFIT_PKR = BUDGET_NET_PROFIT_SAR * BUDGET_EXCHANGE_RATE;
  const BUDGET_EXPENSES_SAR = 2137303;

  // Monthly revenue targets in SAR
  const monthlyBudgets = [
    { label: 'Jun 2026', sar: 6600000, pkr: 6600000 * EXCHANGE_RATE, description: 'Muharram-48 kickoff' },
    { label: 'Jul 2026', sar: 6600000, pkr: 6600000 * EXCHANGE_RATE, description: 'Safar-48 intake' },
    { label: 'Aug 2026', sar: 14800000, pkr: 14800000 * EXCHANGE_RATE, description: 'Rabi Awal peak' },
    { label: 'Sep 2026', sar: 6600000, pkr: 6600000 * EXCHANGE_RATE, description: 'Rabi Thani-48' },
    { label: 'Oct 2026', sar: 6600000, pkr: 6600000 * EXCHANGE_RATE, description: 'Jamad Awal-48' },
    { label: 'Nov 2026', sar: 6600000, pkr: 6600000 * EXCHANGE_RATE, description: 'Jamad Thani-48' },
    { label: 'Dec 2026', sar: 10500000, pkr: 10500000 * EXCHANGE_RATE, description: 'Rajab-48 intake' },
    { label: 'Jan 2027', sar: 16650000, pkr: 16650000 * EXCHANGE_RATE, description: 'Sha\'aban-48 rush' },
    { label: 'Feb 2027', sar: 24050000, pkr: 24050000 * EXCHANGE_RATE, description: 'Ramadan-48 peak' },
    { label: 'Mar 2027', sar: 6600000, pkr: 6600000 * EXCHANGE_RATE, description: 'Shawal-48 wrap-up' },
    { label: 'Apr 2027', sar: 0, pkr: 0, description: 'Post-season review' },
    { label: 'May 2027', sar: 0, pkr: 0, description: 'Off-season planning' },
  ];

  // Actual Stats Calculation
  const actualSalesPKR = bookings.reduce((sum: number, b: any) => sum + (b.totalPrice || 0), 0);
  const actualSalesSAR = actualSalesPKR / EXCHANGE_RATE;
  const actualPilgrims = bookings.reduce((sum: number, b: any) => sum + (b.pilgrimsCount || 0), 0);

  // Group actual sales by month
  const actualSalesByMonthPKR = bookings.reduce((acc: any, b: any) => {
    const date = b.createdAt ? new Date(b.createdAt) : new Date();
    const monthName = date.toLocaleString('en-US', { month: 'short', year: 'numeric' }); // e.g. "Jun 2026"
    acc[monthName] = (acc[monthName] || 0) + (b.totalPrice || 0);
    return acc;
  }, {});

  // Milestones Timeline definitions
  const milestones = [
    {
      id: 1,
      phase: 'Phase 1',
      title: 'Infrastructure Setup & Capex',
      goal: 'Establish KSA & PK offices, downpayment for 8 staff/office cars, legal license guarantee & initial salaries.',
      targetValSar: 1230000,
      isCompleted: true,
      current: false,
      statusText: 'Completed',
      details: 'Downpayment for Creta, MG5, Changan CS35, and Staria office cars completed. Hardware/software procurement done.'
    },
    {
      id: 2,
      phase: 'Phase 2',
      title: 'Muharram-Safar Kickoff',
      goal: 'Achieve SAR 13.2M in cumulative bookings from early-season pilgrims.',
      targetValSar: 13200000,
      isCompleted: actualSalesSAR >= 13200000,
      current: actualSalesSAR < 13200000,
      statusText: actualSalesSAR >= 13200000 ? 'Completed' : 'Active Intake',
      details: 'Targeting 3,770 pilgrims starting departure June 15, 2026.'
    },
    {
      id: 3,
      phase: 'Phase 3',
      title: 'Rabi Awal Peak Peak Season',
      goal: 'Reach SAR 28M in cumulative bookings, capitalising on Rabi Awal peak interest.',
      targetValSar: 28000000,
      isCompleted: actualSalesSAR >= 28000000,
      current: actualSalesSAR >= 13200000 && actualSalesSAR < 28000000,
      statusText: actualSalesSAR >= 28000000 ? 'Completed' : (actualSalesSAR >= 13200000 ? 'Upcoming Goal' : 'Locked'),
      details: 'Peak intake period targeting an additional 4,228 pilgrims in August.'
    },
    {
      id: 4,
      phase: 'Phase 4',
      title: 'Mid-Season Operations Stability',
      goal: 'Reach SAR 47.8M cumulative revenue across Rabi Thani and Jamad cohorts.',
      targetValSar: 47800000,
      isCompleted: actualSalesSAR >= 47800000,
      current: actualSalesSAR >= 28000000 && actualSalesSAR < 47800000,
      statusText: actualSalesSAR >= 47800000 ? 'Completed' : (actualSalesSAR >= 28000000 ? 'Upcoming Goal' : 'Locked'),
      details: 'Stabilising operational overheads, including monthly car installments (SAR 10,650/mo).'
    },
    {
      id: 5,
      phase: 'Phase 5',
      title: 'Rajab-Sha\'aban Spring Rush',
      goal: 'Reach SAR 74.95M cumulative bookings during pre-Ramadan peak.',
      targetValSar: 74950000,
      isCompleted: actualSalesSAR >= 74950000,
      current: actualSalesSAR >= 47800000 && actualSalesSAR < 74950000,
      statusText: actualSalesSAR >= 74950000 ? 'Completed' : (actualSalesSAR >= 47800000 ? 'Upcoming Goal' : 'Locked'),
      details: 'Managing spring accommodations booking lists near the Harams.'
    },
    {
      id: 6,
      phase: 'Phase 6',
      title: 'Ramadan Grand Peak Goal',
      goal: 'Achieve full target of 30,000 pilgrims and SAR 105.6M overall seasonal revenue.',
      targetValSar: 105600000,
      isCompleted: actualSalesSAR >= 105600000,
      current: actualSalesSAR >= 74950000 && actualSalesSAR < 105600000,
      statusText: actualSalesSAR >= 105600000 ? 'Completed' : (actualSalesSAR >= 74950000 ? 'Upcoming Goal' : 'Locked'),
      details: 'Final cohort intake. Wrapping up operations before Shawal reviews.'
    }
  ];

  return (
    <section className="py-16 bg-[#05080a] flex-grow text-gray-100 animate-fadeIn">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Dashboard Title & Tabs */}
        <div className="bg-gradient-to-r from-[#0e1217] to-[#080b0f] border border-[#c5a059]/15 rounded-xl p-8 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2.5 text-xs text-[#c5a059] font-bold uppercase tracking-wider mb-2">
              <span>Staff Portal</span>
              <span><i className="fa-solid fa-chevron-right text-[10px]"></i></span>
              <span>BI Dashboard</span>
            </div>
            <h2 className="text-3xl font-serif text-white font-bold">Business Intelligence Display</h2>
            <p className="text-gray-400 text-sm mt-1">Real-time sales tracking, commission logs, booking distributions, and budget comparisons.</p>
          </div>

          <div className="bg-[#05080a] p-1.5 rounded-lg border border-gray-800 flex flex-wrap gap-2 w-full md:w-auto text-xs text-center justify-center">
            <button
              onClick={() => setViewMode('overview')}
              className={`px-5 py-2 rounded font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${viewMode === 'overview'
                ? 'bg-[#c5a059] text-[#05080a]'
                : 'text-gray-400 hover:text-white'
                }`}
            >
              <i className="fa-solid fa-chart-line"></i> BI Overview
            </button>
            <button
              onClick={() => setViewMode('budget')}
              className={`px-5 py-2 rounded font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${viewMode === 'budget'
                ? 'bg-[#c5a059] text-[#05080a]'
                : 'text-gray-400 hover:text-white'
                }`}
            >
              <i className="fa-solid fa-compass"></i> Budget & Milestones
            </button>
            <button
              onClick={() => setViewMode('partners')}
              className={`px-5 py-2 rounded font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${viewMode === 'partners'
                ? 'bg-[#c5a059] text-[#05080a]'
                : 'text-gray-400 hover:text-white'
                }`}
            >
              <i className="fa-solid fa-user-group"></i> Partner & JV Analytics
            </button>
          </div>
        </div>

        {viewMode === 'overview' ? (
          <>
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
              <div className="bg-[#0e1217] border border-[#c5a059]/15 p-6 rounded-xl shadow-lg relative overflow-hidden group">
                <div className="absolute -right-3 -bottom-3 text-7xl text-[#c5a059]/5"><i className="fa-solid fa-coins"></i></div>
                <div className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Sales Value</div>
                <div className="text-2xl font-black text-[#c5a059] mt-2">PKR {dashboardStats.totalSales.toLocaleString()}</div>
              </div>
              <div className="bg-[#0e1217] border border-[#c5a059]/15 p-6 rounded-xl shadow-lg relative overflow-hidden group">
                <div className="absolute -right-3 -bottom-3 text-7xl text-[#c5a059]/5"><i className="fa-solid fa-percent"></i></div>
                <div className="text-xs font-bold uppercase tracking-wider text-gray-400">Est. Commissions</div>
                <div className="text-2xl font-black text-green-400 mt-2">PKR {dashboardStats.totalCommissions.toLocaleString()}</div>
              </div>
              <div className="bg-[#0e1217] border border-[#c5a059]/15 p-6 rounded-xl shadow-lg relative overflow-hidden group">
                <div className="absolute -right-3 -bottom-3 text-7xl text-[#c5a059]/5"><i className="fa-solid fa-receipt"></i></div>
                <div className="text-xs font-bold uppercase tracking-wider text-gray-400">Bookings Logged</div>
                <div className="text-2xl font-black text-white mt-2">{dashboardStats.bookingsCount}</div>
              </div>
              <div className="bg-[#0e1217] border border-[#c5a059]/15 p-6 rounded-xl shadow-lg relative overflow-hidden group">
                <div className="absolute -right-3 -bottom-3 text-7xl text-[#c5a059]/5"><i className="fa-solid fa-envelope-open-text"></i></div>
                <div className="text-xs font-bold uppercase tracking-wider text-gray-400">Lead Inquiries</div>
                <div className="text-2xl font-black text-blue-400 mt-2">{dashboardStats.inquiriesCount}</div>
              </div>
              <div className="bg-[#0e1217] border border-[#c5a059]/15 p-6 rounded-xl shadow-lg relative overflow-hidden group">
                <div className="absolute -right-3 -bottom-3 text-7xl text-[#c5a059]/5"><i className="fa-solid fa-box-open"></i></div>
                <div className="text-xs font-bold uppercase tracking-wider text-gray-400">Tour Offerings</div>
                <div className="text-2xl font-black text-purple-400 mt-2">{dashboardStats.packagesCount}</div>
              </div>
            </div>

            {/* Charts and Booking logs tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* Chart 1: Sales by Departure City */}
              <div className="bg-[#0e1217] p-6 rounded-xl border border-gray-800">
                <h3 className="text-base font-bold text-white mb-6 flex items-center gap-2">
                  <i className="fa-solid fa-chart-simple text-[#c5a059]"></i> Sales Volume by Departure City
                </h3>
                <div className="flex flex-col gap-4">
                  {(() => {
                    const cities = ['Lahore', 'Islamabad', 'Faisalabad', 'Peshawar', 'Multan', 'Sialkot'];
                    const citySales = bookings.reduce((acc: any, b: any) => {
                      const cityName = b.packageName.includes('Lahore') ? 'Lahore' :
                        b.packageName.includes('Islamabad') ? 'Islamabad' :
                          b.packageName.includes('Faisalabad') ? 'Faisalabad' :
                            b.packageName.includes('Peshawar') ? 'Peshawar' :
                              b.packageName.includes('Multan') ? 'Multan' :
                                b.packageName.includes('Sialkot') ? 'Sialkot' : 'Other';
                      acc[cityName] = (acc[cityName] || 0) + (b.totalPrice || 0);
                      return acc;
                    }, {});

                    const maxSale = Math.max(...cities.map(c => citySales[c] || 0), 1);

                    return cities.map(city => {
                      const value = citySales[city] || 0;
                      const percentage = (value / maxSale) * 100;
                      return (
                        <div key={city} className="flex flex-col gap-1.5">
                          <div className="flex justify-between text-xs">
                            <span className="font-bold text-gray-300">{city}</span>
                            <span className="text-[#c5a059] font-black">PKR {value.toLocaleString()}</span>
                          </div>
                          <div className="w-full bg-gray-900 rounded-full h-3 overflow-hidden border border-gray-800">
                            <div
                              className="bg-gradient-to-r from-[#c5a059] to-[#e2c98a] h-full rounded-full transition-all duration-1000"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>

              {/* Chart 2: Rooming Preference */}
              <div className="bg-[#0e1217] p-6 rounded-xl border border-gray-800 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-white mb-6 flex items-center gap-2">
                    <i className="fa-solid fa-chart-pie text-[#c5a059]"></i> Rooming Option Preferences
                  </h3>
                  {(() => {
                    const dist = bookings.reduce((acc: any, b: any) => {
                      const rt = b.roomingType || 'sharing';
                      acc[rt] = (acc[rt] || 0) + 1;
                      return acc;
                    }, { sharing: 0, quad: 0, triple: 0, double: 0 });

                    const totalCount = bookings.length || 1;
                    const items = [
                      { type: 'sharing', label: 'Sharing', count: dist.sharing, color: '#c5a059' },
                      { type: 'quad', label: 'Quad Room', count: dist.quad, color: '#38bdf8' },
                      { type: 'triple', label: 'Triple Room', count: dist.triple, color: '#a855f7' },
                      { type: 'double', label: 'Double Room', count: dist.double, color: '#f43f5e' }
                    ];

                    return (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                        {items.map(item => {
                          const pct = ((item.count / totalCount) * 100).toFixed(0);
                          return (
                            <div key={item.type} className="bg-[#05080a] p-4 rounded-lg border border-gray-800 text-center flex flex-col items-center">
                              <div className="w-3.5 h-3.5 rounded-full mb-2" style={{ backgroundColor: item.color }}></div>
                              <span className="text-xs text-gray-400 font-semibold">{item.label}</span>
                              <span className="text-xl font-bold mt-1 text-white">{item.count}</span>
                              <span className="text-[10px] text-gray-500 font-bold">{pct}%</span>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
                <div className="text-center text-xs text-gray-500 border-t border-gray-800/60 pt-4 mt-6">
                  Based on active checkout database records.
                </div>
              </div>
            </div>

            {/* Live Sales Bookings Table */}
            <div className="bg-[#0e1217] p-6 rounded-xl border border-gray-800 mb-12 overflow-hidden">
              <h3 className="text-base font-bold text-white mb-6 flex items-center gap-2">
                <i className="fa-solid fa-list text-[#c5a059]"></i> Live Sales Booking Logs
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-gray-800 text-gray-400 uppercase font-extrabold tracking-wider">
                      <th className="py-3 px-4">Booking ID</th>
                      <th className="py-3 px-4">Contact</th>
                      <th className="py-3 px-4">Package</th>
                      <th className="py-3 px-4">Rooming</th>
                      <th className="py-3 px-4 text-center">Pilgrims</th>
                      <th className="py-3 px-4 text-right">Total Price</th>
                      <th className="py-3 px-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800 text-gray-300">
                    {bookings.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-gray-500">No active bookings registered yet.</td>
                      </tr>
                    ) : (
                      bookings.map((booking: any, bIdx: number) => (
                        <tr key={booking._id || bIdx} className="hover:bg-gray-900/40">
                          <td className="py-3.5 px-4 font-mono text-[#c5a059] font-bold">{booking._id ? booking._id.substring(18) : `B-${1000 + bIdx}`}</td>
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-white">{booking.contact.name}</div>
                            <div className="text-[10px] text-gray-500">{booking.contact.phone}</div>
                          </td>
                          <td className="py-3.5 px-4 font-semibold">{booking.packageName}</td>
                          <td className="py-3.5 px-4 capitalize">{booking.roomingType}</td>
                          <td className="py-3.5 px-4 text-center font-bold text-white">{booking.pilgrimsCount}</td>
                          <td className="py-3.5 px-4 text-right font-black text-[#c5a059]">PKR {booking.totalPrice.toLocaleString()}</td>
                          <td className="py-3.5 px-4 text-center">
                            <span className="px-2 py-0.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 font-bold uppercase tracking-wider text-[9px]">
                              {booking.status || 'Pending Payment'}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Inquiries table */}
            <div className="bg-[#0e1217] p-6 rounded-xl border border-gray-800 overflow-hidden">
              <h3 className="text-base font-bold text-white mb-6 flex items-center gap-2">
                <i className="fa-solid fa-envelope-open-text text-[#c5a059]"></i> Live Inquiries Received
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-gray-800 text-gray-400 uppercase font-extrabold tracking-wider">
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Inquirer Name</th>
                      <th className="py-3 px-4">Contact</th>
                      <th className="py-3 px-4">Service Interest</th>
                      <th className="py-3 px-4">Message</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800 text-gray-300">
                    {inquiries.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-gray-500">No customer inquiries logged yet.</td>
                      </tr>
                    ) : (
                      inquiries.map((inquiry: any, iIdx: number) => (
                        <tr key={inquiry._id || iIdx} className="hover:bg-gray-900/40">
                          <td className="py-3.5 px-4 text-gray-500 font-semibold">{inquiry.createdAt ? new Date(inquiry.createdAt).toLocaleDateString() : '06/04/2026'}</td>
                          <td className="py-3.5 px-4 font-bold text-white">{inquiry.name}</td>
                          <td className="py-3.5 px-4">
                            <div>{inquiry.phone}</div>
                            <div className="text-[10px] text-gray-500">{inquiry.email}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold uppercase tracking-wider text-[9px]">
                              {inquiry.service}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-gray-400 max-w-xs truncate" title={inquiry.message}>{inquiry.message}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : viewMode === 'budget' ? (
          /* BUDGET & MILESTONES VIEW */
          <div className="flex flex-col gap-8">

            {/* Exchange Rates Reference */}
            <div className="bg-[#0e1217] border border-[#c5a059]/15 p-4 rounded-xl flex flex-wrap gap-6 items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="text-[#c5a059] text-base"><i className="fa-solid fa-calculator"></i></span>
                <div>
                  <span className="font-bold text-white uppercase">
                    Currency Analytics Hub {exchangeRates?.isLive ? <span className="text-green-400 text-[9px] bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded ml-2 font-mono">Live Spot Rates Active</span> : <span className="text-yellow-400 text-[9px] bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 rounded ml-2 font-mono">Budget Defaults</span>}
                  </span>
                  <p className="text-gray-500 text-[10px] mt-0.5">Automated conversion of booking actuals (PKR) and budget estimates (SAR).</p>
                </div>
              </div>
              <div className="flex gap-4 font-mono text-gray-400">
                <span className="bg-[#05080a] px-3 py-1.5 rounded border border-gray-800">
                  1 SAR = <strong className="text-[#c5a059]">{EXCHANGE_RATE.toFixed(2)} PKR</strong>
                </span>
                <span className="bg-[#05080a] px-3 py-1.5 rounded border border-gray-800">
                  1 USD = <strong className="text-blue-400">{USD_RATE.toFixed(2)} PKR</strong>
                </span>
                <span className="bg-[#05080a] px-3 py-1.5 rounded border border-gray-800">
                  1 USD = <strong className="text-green-400">{USD_TO_SAR.toFixed(2)} SAR</strong>
                </span>
              </div>
            </div>

            {/* Three-Currency Target Comparison Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

              {/* Revenue card */}
              <div className="bg-[#0e1217] border border-[#c5a059]/15 p-6 rounded-xl shadow-lg relative overflow-hidden flex flex-col justify-between">
                <div className="absolute -right-3 -bottom-3 text-7xl text-[#c5a059]/5"><i className="fa-solid fa-coins"></i></div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Revenue Goal (Budget vs Actual)</span>
                  <div className="text-2xl font-black text-[#c5a059] mt-2">
                    PKR {actualSalesPKR.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
                  <div className="text-[10px] text-gray-400 font-mono mt-1 flex flex-col gap-0.5">
                    <span>SAR: {actualSalesSAR.toLocaleString(undefined, { maximumFractionDigits: 0 })} / {BUDGET_TOTAL_REVENUE_SAR.toLocaleString()}</span>
                    <span>USD: {(actualSalesPKR / USD_RATE).toLocaleString(undefined, { maximumFractionDigits: 0 })} / {(BUDGET_TOTAL_REVENUE_PKR / USD_RATE).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-1">
                    <span>Target Achievement</span>
                    <span className="text-[#c5a059]">{((actualSalesSAR / BUDGET_TOTAL_REVENUE_SAR) * 100).toFixed(2)}%</span>
                  </div>
                  <div className="w-full bg-gray-900 rounded-full h-2 overflow-hidden border border-gray-800">
                    <div
                      className="bg-gradient-to-r from-[#c5a059] to-[#e2c98a] h-full rounded-full transition-all duration-1000"
                      style={{ width: `${Math.min((actualSalesSAR / BUDGET_TOTAL_REVENUE_SAR) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Pilgrims Card */}
              <div className="bg-[#0e1217] border border-[#c5a059]/15 p-6 rounded-xl shadow-lg relative overflow-hidden flex flex-col justify-between">
                <div className="absolute -right-3 -bottom-3 text-7xl text-[#c5a059]/5"><i className="fa-solid fa-user-group"></i></div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Pilgrims Goal (Target vs Actual)</span>
                  <div className="text-2xl font-black text-white mt-2">
                    {actualPilgrims.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-gray-400 font-mono mt-1">
                    Target: <strong className="text-white">{BUDGET_TARGET_PILGRIMS.toLocaleString()}</strong> pilgrims from Pakistan.
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-1">
                    <span>Pilgrims Reached</span>
                    <span className="text-white">{((actualPilgrims / BUDGET_TARGET_PILGRIMS) * 100).toFixed(2)}%</span>
                  </div>
                  <div className="w-full bg-gray-900 rounded-full h-2 overflow-hidden border border-gray-800">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-1000"
                      style={{ width: `${Math.min((actualPilgrims / BUDGET_TARGET_PILGRIMS) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Profit Card */}
              <div className="bg-[#0e1217] border border-[#c5a059]/15 p-6 rounded-xl shadow-lg relative overflow-hidden flex flex-col justify-between">
                <div className="absolute -right-3 -bottom-3 text-7xl text-[#c5a059]/5"><i className="fa-solid fa-chart-line"></i></div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Gross Profit (Budget vs Actual)</span>
                  <div className="text-2xl font-black text-green-400 mt-2">
                    PKR {(actualSalesPKR * 0.0667).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
                  <div className="text-[10px] text-gray-400 font-mono mt-1 flex flex-col gap-0.5">
                    <span>SAR: {(actualSalesSAR * 0.0667).toLocaleString(undefined, { maximumFractionDigits: 0 })} / {BUDGET_GROSS_PROFIT_SAR.toLocaleString()}</span>
                    <span>USD: {((actualSalesPKR * 0.0667) / 278).toLocaleString(undefined, { maximumFractionDigits: 0 })} / {((BUDGET_GROSS_PROFIT_SAR * EXCHANGE_RATE) / 278).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                  <div className="mt-2 text-[9px] text-gray-500 font-mono">
                    Net Budget: PKR {BUDGET_NET_PROFIT_PKR.toLocaleString(undefined, { maximumFractionDigits: 0 })} | SAR {BUDGET_NET_PROFIT_SAR.toLocaleString()} | USD {(BUDGET_NET_PROFIT_PKR / 278).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-1">
                    <span>GP Margin</span>
                    <span className="text-green-400">6.67% (Pro-Rata)</span>
                  </div>
                  <div className="w-full bg-gray-900 rounded-full h-2 overflow-hidden border border-gray-800">
                    <div
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-full rounded-full transition-all duration-1000"
                      style={{ width: `${Math.min((actualSalesSAR / BUDGET_TOTAL_REVENUE_SAR) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Expenses & ZATCA Tax */}
              <div className="bg-[#0e1217] border border-[#c5a059]/15 p-6 rounded-xl shadow-lg relative overflow-hidden flex flex-col justify-between">
                <div className="absolute -right-3 -bottom-3 text-7xl text-[#c5a059]/5"><i className="fa-solid fa-file-invoice-dollar"></i></div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Admin Expenses (SAR, PKR, USD)</span>
                  <div className="text-sm font-bold text-white mt-3">
                    Budget: SAR {BUDGET_EXPENSES_SAR.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-gray-400 font-mono mt-1 flex flex-col gap-0.5">
                    <span>PKR: {(BUDGET_EXPENSES_SAR * EXCHANGE_RATE).toLocaleString(undefined, { maximumFractionDigits: 0 })} total services budget</span>
                    <span>USD: {(BUDGET_EXPENSES_SAR * EXCHANGE_RATE / 278).toLocaleString(undefined, { maximumFractionDigits: 0 })} operating overheads</span>
                  </div>
                </div>
                <div className="mt-4 text-[10px] text-[#c5a059] bg-[#c5a059]/5 border border-[#c5a059]/20 p-2 rounded">
                  Includes ZATCA Income Tax (20%): SAR 982.5k (PKR 73.2M | USD 263.3k)
                </div>
              </div>

            </div>

            {/* Milestone Progress Path */}
            <div className="bg-[#0e1217] p-6 rounded-xl border border-gray-800">
              <h3 className="text-base font-bold text-white mb-6 flex items-center gap-2">
                <i className="fa-solid fa-flag-checkered text-[#c5a059]"></i> Hijri 1448 Season Milestones Roadmap
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 relative">
                {milestones.map((m) => (
                  <div key={m.id} className={`p-4 rounded-lg border relative flex flex-col justify-between transition-all ${m.isCompleted
                    ? 'bg-green-500/5 border-green-500/20 text-gray-300'
                    : m.current
                      ? 'bg-[#c5a059]/10 border-[#c5a059] text-white'
                      : 'bg-[#05080a] border-gray-800 text-gray-500'
                    }`}>
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{m.phase}</span>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${m.isCompleted
                          ? 'bg-green-500/10 text-green-400'
                          : m.current
                            ? 'bg-[#c5a059]/20 text-[#c5a059]'
                            : 'bg-gray-800 text-gray-600'
                          }`}>
                          {m.statusText}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold mt-2.5 text-white">{m.title}</h4>
                      <p className="text-[10px] text-gray-400 mt-2 leading-relaxed">{m.goal}</p>
                    </div>

                    <div className="mt-4 border-t border-gray-800 pt-3 flex flex-col gap-1">
                      <span className="text-[10px] text-[#c5a059] font-mono font-bold">Goal Target:</span>
                      <span className="text-[11px] font-mono text-white font-extrabold">SAR {m.targetValSar.toLocaleString()}</span>
                      <span className="text-[9px] text-gray-400 font-mono">
                        PKR: PKR {(m.targetValSar * EXCHANGE_RATE).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </span>
                      <span className="text-[9px] text-gray-400 font-mono">
                        USD: USD {(m.targetValSar * EXCHANGE_RATE / USD_RATE).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Monthly Comparison Breakdown */}
            <div className="bg-[#0e1217] p-6 rounded-xl border border-gray-800 overflow-hidden">
              <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <i className="fa-solid fa-calendar-days text-[#c5a059]"></i> Monthly Target Analysis (USD, SAR, PKR)
              </h3>
              <p className="text-gray-400 text-xs mb-6">Compare budgeted sales volumes with current booking registers sorted by creation date.</p>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-800 text-gray-400 uppercase font-bold tracking-wider">
                      <th className="py-3 px-4">Fiscal Month</th>
                      <th className="py-3 px-4 text-center">Budget Target (SAR / PKR / USD)</th>
                      <th className="py-3 px-4 text-center">Actual Bookings (SAR / PKR / USD)</th>
                      <th className="py-3 px-4">Completion Progress</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800 text-gray-300">
                    {monthlyBudgets.map((mb, idx) => {
                      const actualPKR = actualSalesByMonthPKR[mb.label] || 0;
                      const actualSAR = actualPKR / EXCHANGE_RATE;
                      const actualUSD = actualPKR / USD_RATE;

                      const percentage = mb.sar > 0 ? Math.min((actualSAR / mb.sar) * 100, 100) : 0;

                      return (
                        <tr key={idx} className="hover:bg-gray-900/40">
                          <td className="py-4 px-4">
                            <div className="font-bold text-white">{mb.label}</div>
                            <div className="text-[10px] text-gray-500">{mb.description}</div>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <div className="font-semibold text-white">SAR {mb.sar.toLocaleString()}</div>
                            <div className="text-[10px] text-gray-400 font-mono mt-0.5">
                              PKR {mb.pkr.toLocaleString()} | USD {(mb.pkr / USD_RATE).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </div>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <div className="font-semibold text-[#c5a059]">SAR {actualSAR.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                            <div className="text-[10px] text-gray-400 font-mono mt-0.5">
                              PKR {actualPKR.toLocaleString()} | USD {actualUSD.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            {mb.sar > 0 ? (
                              <div className="flex items-center gap-3">
                                <div className="w-full bg-gray-900 rounded-full h-2 overflow-hidden border border-gray-800">
                                  <div
                                    className="bg-gradient-to-r from-[#c5a059] to-[#e2c98a] h-full rounded-full transition-all duration-1000"
                                    style={{ width: `${percentage}%` }}
                                  ></div>
                                </div>
                                <span className="font-bold font-mono text-[#c5a059] whitespace-nowrap">{percentage.toFixed(1)}%</span>
                              </div>
                            ) : (
                              <span className="text-gray-500 italic">No Target</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        ) : (
          /* PARTNERS & JV ANALYTICS VIEW */
          <div className="flex flex-col gap-8 animate-fadeIn">
            {/* Partner KPI Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-[#0e1217] border border-[#c5a059]/15 p-6 rounded-xl shadow-lg relative overflow-hidden group">
                <div className="absolute -right-3 -bottom-3 text-7xl text-[#c5a059]/5"><i className="fa-solid fa-users"></i></div>
                <div className="text-xs font-bold uppercase tracking-wider text-gray-400">Registered Sub-Agents</div>
                <div className="text-2xl font-black text-[#c5a059] mt-2">{subagents.length} Agents</div>
                <div className="text-[10px] text-gray-500 mt-1">Pending and approved commission partners</div>
              </div>

              <div className="bg-[#0e1217] border border-[#c5a059]/15 p-6 rounded-xl shadow-lg relative overflow-hidden group">
                <div className="absolute -right-3 -bottom-3 text-7xl text-[#c5a059]/5"><i className="fa-solid fa-file-contract"></i></div>
                <div className="text-xs font-bold uppercase tracking-wider text-gray-400">JV Contracts Directory</div>
                <div className="text-2xl font-black text-white mt-2">{partnerFiles.length} Agreements</div>
                <div className="text-[10px] text-gray-500 mt-1">Scanned PDF contracts from partners folder</div>
              </div>

              <div className="bg-[#0e1217] border border-[#c5a059]/15 p-6 rounded-xl shadow-lg relative overflow-hidden group">
                <div className="absolute -right-3 -bottom-3 text-7xl text-[#c5a059]/5"><i className="fa-solid fa-money-bill-trend-up"></i></div>
                <div className="text-xs font-bold uppercase tracking-wider text-gray-400">Partner Sales Share</div>
                <div className="text-2xl font-black text-green-400 mt-2">
                  PKR {partnerStats.reduce((sum: number, p: any) => sum + p.revenue, 0).toLocaleString()}
                </div>
                <div className="text-[10px] text-gray-550 mt-1 flex justify-between w-full">
                  <span>Bookings: {partnerStats.reduce((sum: number, p: any) => sum + p.bookingsCount, 0)}</span>
                  <span>Share: {((partnerStats.reduce((sum: number, p: any) => sum + p.revenue, 0) / (dashboardStats.totalSales || 1)) * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Scanned JV Contracts Directory Section */}
              <div className="bg-[#0e1217] p-6 rounded-xl border border-gray-800 lg:col-span-5 flex flex-col">
                <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                  <i className="fa-solid fa-file-pdf text-red-500"></i> Signed JV Contracts Directory
                </h3>
                <p className="text-gray-400 text-xs mb-6">These agreements are loaded dynamically from the `partners` folder. Click to view or download.</p>

                <div className="flex flex-col gap-3.5 max-h-[480px] overflow-y-auto pr-1">
                  {partnerFiles.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 border border-dashed border-gray-800 rounded-lg">
                      <i className="fa-solid fa-folder-open text-4xl text-gray-700 block mb-2"></i>
                      No signed contract PDFs detected.
                    </div>
                  ) : (
                    partnerFiles.map((file, idx) => (
                      <div key={idx} className="bg-[#05080a] border border-gray-800 hover:border-[#c5a059]/30 rounded-lg p-3.5 flex items-center justify-between gap-4 transition-all">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <span className="text-2xl text-red-450 flex-shrink-0"><i className="fa-solid fa-file-pdf"></i></span>
                          <div className="overflow-hidden">
                            <h4 className="text-xs font-bold text-white truncate" title={file.companyName}>{file.companyName}</h4>
                            <span className="text-[10px] text-gray-500 block truncate mt-0.5">{file.filename}</span>
                          </div>
                        </div>
                        <a
                          href={`${BACKEND_URL}${file.url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-[#c5a059]/10 hover:bg-[#c5a059] border border-[#c5a059]/30 hover:border-[#c5a059] text-[#c5a059] hover:text-[#05080a] text-[10px] font-bold rounded transition-all flex-shrink-0"
                        >
                          View Contract
                        </a>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Sub-Agent Performance Leaderboard Section */}
              <div className="bg-[#0e1217] p-6 rounded-xl border border-gray-800 lg:col-span-7">
                <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                  <i className="fa-solid fa-trophy text-yellow-500"></i> Partner & Sub-Agent Activity Tracking
                </h3>
                <p className="text-gray-400 text-xs mb-6">Real-time revenue attribution and commission logs generated per Sub-Agent ID.</p>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-800 text-gray-400 uppercase font-extrabold tracking-wider">
                        <th className="py-2.5 px-3">Agent ID / Name</th>
                        <th className="py-2.5 px-3">Agency Name</th>
                        <th className="py-2.5 px-3 text-center">Bookings</th>
                        <th className="py-2.5 px-3 text-right">Attributed Sales</th>
                        <th className="py-2.5 px-3 text-right">Commissions (5%)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800 text-gray-300">
                      {partnerStats.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-gray-500">No partner activity recorded.</td>
                        </tr>
                      ) : (
                        partnerStats.map((agent, aIdx) => (
                          <tr key={aIdx} className="hover:bg-gray-900/40">
                            <td className="py-3 px-3">
                              <div className="font-bold text-white">{agent.id}</div>
                              <div className="text-[10px] text-gray-500 mt-0.5">{agent.name}</div>
                            </td>
                            <td className="py-3 px-3 font-semibold text-gray-300">{agent.agency}</td>
                            <td className="py-3 px-3 text-center font-bold text-white">{agent.bookingsCount}</td>
                            <td className="py-3 px-3 text-right font-black text-[#c5a059]">PKR {agent.revenue.toLocaleString()}</td>
                            <td className="py-3 px-3 text-right font-bold text-green-400">PKR {(agent.revenue * 0.05).toLocaleString()}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Registered Sub-Agents General Directory */}
            <div className="bg-[#0e1217] p-6 rounded-xl border border-gray-800 overflow-hidden">
              <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <i className="fa-solid fa-address-book text-[#c5a059]"></i> Sub-Agent Partner General Directory
              </h3>
              <p className="text-gray-400 text-xs mb-6">Profiles of registered sub-agents and franchise partners registered via E-Portal.</p>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-gray-800 text-gray-400 uppercase font-extrabold tracking-wider">
                      <th className="py-2.5 px-3">Agent ID</th>
                      <th className="py-2.5 px-3">Agency Details</th>
                      <th className="py-2.5 px-3">Contact</th>
                      <th className="py-2.5 px-3 text-center">Exp.</th>
                      <th className="py-2.5 px-3 text-center">Consent</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800 text-gray-300">
                    {subagents.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-gray-500">No sub-agents registered in database.</td>
                      </tr>
                    ) : (
                      subagents.map((agent: any, sIdx: number) => (
                        <tr key={sIdx} className="hover:bg-gray-900/40">
                          <td className="py-3 px-3 font-mono text-[#c5a059] font-bold">{agent.name}</td>
                          <td className="py-3 px-3">
                            <div className="font-bold text-white">{agent.agencyName}</div>
                            <div className="text-[10px] text-gray-500 mt-0.5">{agent.address}</div>
                          </td>
                          <td className="py-3 px-3">
                            <div>{agent.contactName}</div>
                            <div className="text-[10px] text-gray-500 mt-0.5">{agent.email} | {agent.phone}</div>
                          </td>
                          <td className="py-3 px-3 text-center font-bold text-white">{agent.experience} Yrs</td>
                          <td className="py-3 px-3 text-center">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${agent.jvConsent ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                              }`}>
                              {agent.jvConsent ? 'JV Agreed' : 'No JV'}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span className={`px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-[9px] ${agent.status === 'Approved' ? 'bg-green-500/10 border border-green-500/20 text-green-400' :
                              agent.status === 'Suspended' ? 'bg-red-500/10 border border-red-500/20 text-red-400' :
                                'bg-yellow-500/10 border border-yellow-500/20 text-yellow-400'
                              }`}>
                              {agent.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* SALES PORTAL VIEW Component (Migrated from manage_packages.php) */
function SalesPortalView({ packages, subagents, bookings, teamMembers = [], BACKEND_URL, setSubagents, setPackages, setTeamMembers }: any) {
  const [activeTab, setActiveTab] = useState<'rates' | 'agents' | 'sales' | 'team'>('rates');
  const [searchTerm, setSearchTerm] = useState('');

  // Team CRUD states
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [memberForm, setMemberForm] = useState({
    name: '',
    role: '',
    designation: '',
    office: '',
    emails: '',
    phones: '',
    isActive: true
  });

  // Package CRUD states
  const [editingFullPkg, setEditingFullPkg] = useState<UmrahPackage | null>(null);
  const [isAddingPkg, setIsAddingPkg] = useState(false);
  const [pkgForm, setPkgForm] = useState({
    title: '',
    city: '',
    duration: '',
    description: '',
    makkahHotel: '',
    madinahHotel: '',
    features: '',
    image: '',
    price_sharing: 0,
    price_quad: 0,
    price_triple: 0,
    price_double: 0,
    price_single: 0,
    isActive: false
  });

  const openAddPkgModal = () => {
    setIsAddingPkg(true);
    setEditingFullPkg(null);
    setPkgForm({
      title: '',
      city: 'Islamabad',
      duration: '15 Days (7 Makkah - 8 Madinah)',
      description: 'Premium Umrah package with excellent hotel services.',
      makkahHotel: '',
      madinahHotel: '',
      features: 'Airline Flights Included, Umrah Visa & Insurance, Makkah & Madinah Hotels, Transport Included',
      image: '',
      price_sharing: 275000,
      price_quad: 285000,
      price_triple: 295000,
      price_double: 310000,
      price_single: 390000,
      isActive: false
    });
  };

  const openEditPkgModal = (pkg: UmrahPackage) => {
    setEditingFullPkg(pkg);
    setIsAddingPkg(false);
    setPkgForm({
      title: pkg.title,
      city: pkg.city,
      duration: pkg.duration,
      description: pkg.description || '',
      makkahHotel: pkg.hotels.makkah,
      madinahHotel: pkg.hotels.madinah,
      features: pkg.features ? pkg.features.join(', ') : '',
      image: pkg.image || '',
      price_sharing: pkg.price_sharing || 0,
      price_quad: pkg.price_quad || 0,
      price_triple: pkg.price_triple || 0,
      price_double: pkg.price_double || 0,
      price_single: pkg.price_single || 0,
      isActive: pkg.isActive || false
    });
  };

  const handlePkgSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: pkgForm.title,
      city: pkgForm.city,
      duration: pkgForm.duration,
      description: pkgForm.description,
      hotels: {
        makkah: pkgForm.makkahHotel,
        madinah: pkgForm.madinahHotel
      },
      features: pkgForm.features.split(',').map(s => s.trim()).filter(Boolean),
      image: pkgForm.image,
      price_sharing: pkgForm.price_sharing,
      price_quad: pkgForm.price_quad,
      price_triple: pkgForm.price_triple,
      price_double: pkgForm.price_double,
      price_single: pkgForm.price_single,
      isActive: pkgForm.isActive
    };

    try {
      if (editingFullPkg?._id) {
        // Edit package
        const res = await fetch(`${BACKEND_URL}/api/packages/${editingFullPkg._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setPackages((prev: UmrahPackage[]) => prev.map(p => p._id === editingFullPkg._id ? data.package : p));
          setEditingFullPkg(null);
        } else {
          alert(data.error || 'Failed to update package.');
        }
      } else {
        // Create new package
        const res = await fetch(`${BACKEND_URL}/api/packages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setPackages((prev: UmrahPackage[]) => [...prev, data.package]);
          setIsAddingPkg(false);
        } else {
          alert(data.error || 'Failed to create package.');
        }
      }
    } catch (err) {
      alert('Error updating packages database.');
    }
  };

  const handlePkgDelete = async (pkgId: string) => {
    if (!confirm('Are you sure you want to delete this Umrah package?')) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/packages/${pkgId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPackages((prev: UmrahPackage[]) => prev.filter(p => p._id !== pkgId));
      } else {
        alert(data.error || 'Failed to delete package.');
      }
    } catch (err) {
      alert('Error deleting package.');
    }
  };

  const handlePkgToggleActive = (pkg: UmrahPackage) => {
    if (!pkg._id) return;
    const newStatus = !pkg.isActive;
    fetch(`${BACKEND_URL}/api/packages/${pkg._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: newStatus })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setPackages((prev: UmrahPackage[]) => prev.map(p => p._id === pkg._id ? { ...p, isActive: newStatus } : p));
        }
      })
      .catch(err => console.error('Failed to toggle package status:', err));
  };

  const openAddMemberModal = () => {
    setIsAddingMember(true);
    setEditingMember(null);
    setMemberForm({
      name: '',
      role: '',
      designation: '',
      office: 'Lahore Office',
      emails: '',
      phones: '',
      isActive: true
    });
  };

  const openEditMemberModal = (member: TeamMember) => {
    setEditingMember(member);
    setIsAddingMember(false);
    setMemberForm({
      name: member.name,
      role: member.role,
      designation: member.designation,
      office: member.office,
      emails: member.emails.join(', '),
      phones: member.phones.join(', '),
      isActive: member.isActive !== false
    });
  };

  const handleMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: memberForm.name,
      role: memberForm.role,
      designation: memberForm.designation,
      office: memberForm.office,
      emails: memberForm.emails.split(',').map(s => s.trim()).filter(Boolean),
      phones: memberForm.phones.split(',').map(s => s.trim()).filter(Boolean),
      isActive: memberForm.isActive
    };

    try {
      if (editingMember?._id) {
        // Edit existing
        const res = await fetch(`${BACKEND_URL}/api/team/${editingMember._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setTeamMembers((prev: TeamMember[]) => prev.map(m => m._id === editingMember._id ? data.member : m));
          setEditingMember(null);
        } else {
          alert(data.error || 'Failed to update team member.');
        }
      } else {
        // Add new
        const res = await fetch(`${BACKEND_URL}/api/team`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setTeamMembers((prev: TeamMember[]) => [...prev, data.member]);
          setIsAddingMember(false);
        } else {
          alert(data.error || 'Failed to create team member.');
        }
      }
    } catch (err) {
      alert('Error updating team database.');
    }
  };

  const handleMemberDelete = async (memberId: string) => {
    if (!confirm('Are you sure you want to delete this team member?')) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/team/${memberId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTeamMembers((prev: TeamMember[]) => prev.filter(m => m._id !== memberId));
      } else {
        alert(data.error || 'Failed to delete team member.');
      }
    } catch (err) {
      alert('Error deleting team member.');
    }
  };

  const handleMemberToggleActive = (member: TeamMember) => {
    if (!member._id) return;
    const newStatus = member.isActive === false ? true : false;
    fetch(`${BACKEND_URL}/api/team/${member._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: newStatus })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setTeamMembers((prev: TeamMember[]) => prev.map((m: any) => m._id === member._id ? { ...m, isActive: newStatus } : m));
        }
      })
      .catch(err => console.error('Failed to toggle team member status:', err));
  };

  // Rate edit modal states
  const [editingPkg, setEditingPkg] = useState<UmrahPackage | null>(null);
  const [rateForm, setRateForm] = useState({
    price_sharing: 0,
    price_quad: 0,
    price_triple: 0,
    price_double: 0,
    price_single: 0
  });
  const [isSyncing, setIsSyncing] = useState(false);

  const handleStatusUpdate = async (agentId: string, status: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/subagents/${agentId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setSubagents((prev: SubAgent[]) => prev.map(a => a.name === agentId ? { ...a, status } : a));
      } else {
        alert(data.error || 'Failed to update status.');
      }
    } catch (err) {
      alert('Error updating agent status.');
    }
  };

  const openRateModal = (pkg: UmrahPackage) => {
    setEditingPkg(pkg);
    setRateForm({
      price_sharing: pkg.price_sharing || 0,
      price_quad: pkg.price_quad || 0,
      price_triple: pkg.price_triple || 0,
      price_double: pkg.price_double || 0,
      price_single: pkg.price_single || 0
    });
  };

  const handleRateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPkg) return;
    setIsSyncing(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/packages/${editingPkg._id || editingPkg.title}/rates`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rateForm)
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setPackages((prev: UmrahPackage[]) => prev.map(p => (p._id === editingPkg._id || p.title === editingPkg.title) ? { ...p, ...rateForm, price: `PKR ${rateForm.price_sharing.toLocaleString()}` } : p));
        setEditingPkg(null);
      } else {
        alert(data.error || 'Failed to sync rates.');
      }
    } catch (err) {
      alert('Error connecting to backend server.');
    } finally {
      setIsSyncing(false);
    }
  };

  // Stats Calculations
  const approvedAgentsCount = subagents.filter((a: SubAgent) => a.status === 'Approved').length;
  const totalBillings = bookings.reduce((sum: number, b: any) => sum + (b.totalPrice || 0), 0);
  const totalCommissions = totalBillings * 0.05;

  return (
    <section className="py-16 bg-[#05080a] flex-grow text-gray-100 animate-fadeIn">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="bg-gradient-to-r from-[#0e1217] to-[#080b0f] border border-[#c5a059]/15 rounded-xl p-8 mb-12">
          <div className="flex items-center gap-2.5 text-xs text-[#c5a059] font-bold uppercase tracking-wider mb-2">
            <span>Staff Portal</span>
            <span><i className="fa-solid fa-chevron-right text-[10px]"></i></span>
            <span>Sales Portal Dashboard</span>
          </div>
          <h2 className="text-3xl font-serif text-white font-bold">Sales & Partner Administration</h2>
          <p className="text-gray-400 text-sm mt-1">Manage package rates, approve sub-agents, and track sales commissions.</p>
        </div>

        {/* Tabs Row */}
        <div className="flex gap-4 border-b border-gray-800 pb-3 mb-8">
          <button
            onClick={() => { setActiveTab('rates'); setSearchTerm(''); }}
            className={`px-5 py-2.5 font-bold text-xs uppercase tracking-wider rounded border transition-all ${activeTab === 'rates' ? 'bg-[#c5a059] text-[#05080a]' : 'bg-transparent text-gray-400 border-transparent hover:text-white'
              }`}
          >
            <i className="fa-solid fa-tags mr-2"></i> Package Pricing
          </button>
          <button
            onClick={() => { setActiveTab('agents'); setSearchTerm(''); }}
            className={`px-5 py-2.5 font-bold text-xs uppercase tracking-wider rounded border transition-all ${activeTab === 'agents' ? 'bg-[#c5a059] text-[#05080a]' : 'bg-transparent text-gray-400 border-transparent hover:text-white'
              }`}
          >
            <i className="fa-solid fa-users mr-2"></i> Sub-Agents List
          </button>
          <button
            onClick={() => { setActiveTab('sales'); setSearchTerm(''); }}
            className={`px-5 py-2.5 font-bold text-xs uppercase tracking-wider rounded border transition-all ${activeTab === 'sales' ? 'bg-[#c5a059] text-[#05080a]' : 'bg-transparent text-gray-400 border-transparent hover:text-white'
              }`}
          >
            <i className="fa-solid fa-chart-line mr-2"></i> Sales & Commissions
          </button>
          <button
            onClick={() => { setActiveTab('team'); setSearchTerm(''); }}
            className={`px-5 py-2.5 font-bold text-xs uppercase tracking-wider rounded border transition-all ${activeTab === 'team' ? 'bg-[#c5a059] text-[#05080a]' : 'bg-transparent text-gray-400 border-transparent hover:text-white'
              }`}
          >
            <i className="fa-solid fa-user-group mr-2"></i> Team Directory
          </button>
        </div>

        {/* Tab Search */}
        <div className="relative max-w-sm mb-6">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
            <i className="fa-solid fa-magnifying-glass text-xs"></i>
          </span>
          <input
            type="text"
            placeholder="Search active tab..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0e1217] border border-gray-800 focus:border-[#c5a059] text-white pl-9 pr-4 py-2.5 rounded text-xs outline-none transition-all placeholder:text-gray-600"
          />
        </div>

        {/* TAB 1: PRICING */}
        {activeTab === 'rates' && (
          <div className="flex flex-col gap-4">
            {/* Reseed Action Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#0e1217] border border-gray-800 rounded-xl p-4">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <i className="fa-solid fa-database text-[#c5a059]"></i>
                  Package Database Control
                </h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  Currently showing {packages.length} packages.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={openAddPkgModal}
                  className="px-4 py-2 bg-green-600 border border-green-500 hover:bg-green-700 text-white rounded font-bold text-xs transition-all flex items-center gap-2 whitespace-nowrap"
                >
                  <i className="fa-solid fa-plus"></i> Add New Package
                </button>
              </div>
            </div>

            <div className="bg-[#0e1217] border border-gray-800 rounded-xl overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#05080a] border-b border-gray-800 text-gray-400 uppercase font-bold">
                    <tr>
                      <th className="py-3.5 px-4">Package Name</th>
                      <th className="py-3.5 px-4">Sharing</th>
                      <th className="py-3.5 px-4">Quad</th>
                      <th className="py-3.5 px-4">Triple</th>
                      <th className="py-3.5 px-4">Double</th>
                      <th className="py-3.5 px-4">Single</th>
                      <th className="py-3.5 px-4 text-center">Status</th>
                      <th className="py-3.5 px-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800 text-gray-300">
                    {packages
                      .filter((p: any) => p.title.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map((pkg: any, idx: number) => (
                        <tr key={pkg._id || idx} className="hover:bg-gray-900/40">
                          <td className="py-4 px-4 font-bold text-white">
                            {pkg.title}
                            <div className="text-[10px] text-gray-500 font-mono mt-0.5">{pkg.city} | {pkg.duration}</div>
                          </td>
                          <td className="py-4 px-4 font-semibold text-[#c5a059]">{pkg.price_sharing ? `PKR ${pkg.price_sharing.toLocaleString()}` : 'N/A'}</td>
                          <td className="py-4 px-4">{pkg.price_quad ? `PKR ${pkg.price_quad.toLocaleString()}` : 'N/A'}</td>
                          <td className="py-4 px-4">{pkg.price_triple ? `PKR ${pkg.price_triple.toLocaleString()}` : 'N/A'}</td>
                          <td className="py-4 px-4">{pkg.price_double ? `PKR ${pkg.price_double.toLocaleString()}` : 'N/A'}</td>
                          <td className="py-4 px-4">{pkg.price_single ? `PKR ${pkg.price_single.toLocaleString()}` : 'N/A'}</td>
                          <td className="py-4 px-4 text-center">
                            <button
                              onClick={() => handlePkgToggleActive(pkg)}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-all ${pkg.isActive
                                ? 'bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20'
                                : 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20'
                                }`}
                            >
                              {pkg.isActive ? 'Active' : 'Inactive'}
                            </button>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => openRateModal(pkg)}
                                className="px-2.5 py-1 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 rounded font-bold hover:bg-yellow-500 hover:text-[#05080a] transition-all"
                                title="Edit Rates Only"
                              >
                                Rates
                              </button>
                              <button
                                onClick={() => openEditPkgModal(pkg)}
                                className="p-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white rounded transition-all"
                                title="Edit Package Details"
                              >
                                <i className="fa-solid fa-pen text-xs"></i>
                              </button>
                              {pkg._id && (
                                <button
                                  onClick={() => handlePkgDelete(pkg._id)}
                                  className="p-1.5 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded transition-all"
                                  title="Delete Package"
                                >
                                  <i className="fa-solid fa-trash-can text-xs"></i>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SUB-AGENTS */}
        {activeTab === 'agents' && (
          <div className="bg-[#0e1217] border border-gray-800 rounded-xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#05080a] border-b border-gray-800 text-gray-400 uppercase font-bold">
                  <tr>
                    <th className="py-3.5 px-4">Agency Details</th>
                    <th className="py-3.5 px-4">Contact Person</th>
                    <th className="py-3.5 px-4">Location</th>
                    <th className="py-3.5 px-4">Experience</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800 text-gray-300">
                  {subagents.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-gray-500">No partner registrations registered.</td>
                    </tr>
                  ) : (
                    subagents
                      .filter((s: SubAgent) => s.agencyName.toLowerCase().includes(searchTerm.toLowerCase()) || s.contactName.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map((agent: SubAgent, idx: number) => (
                        <tr key={agent.name || idx} className="hover:bg-gray-900/40">
                          <td className="py-4 px-4">
                            <div className="font-bold text-white">{agent.agencyName}</div>
                            <div className="text-[10px] text-gray-500 font-mono mt-0.5">{agent.name}</div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="font-semibold">{agent.contactName}</div>
                            <div className="text-[10px] text-gray-500 flex flex-wrap items-center gap-1.5 mt-0.5">
                              <span>{agent.email} &bull; {agent.phone}</span>
                              {agent.jvConsent && (
                                <a
                                  href={`${BACKEND_URL}/uploaded-files/JV Partners/General JV Contract Template.pdf`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[#c5a059] hover:underline font-bold inline-flex items-center gap-0.5 ml-1"
                                  title="View/Download JV Contract"
                                >
                                  [<i className="fa-solid fa-file-pdf"></i> Signed JV]
                                </a>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-4">{agent.address}</td>
                          <td className="py-4 px-4 font-semibold">{agent.experience} Years</td>
                          <td className="py-4 px-4">
                            <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] uppercase border ${agent.status === 'Approved' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                              agent.status === 'Suspended' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                                'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
                              }`}>
                              {agent.status}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right flex gap-2 justify-end">
                            {agent.status !== 'Approved' && (
                              <button
                                onClick={() => handleStatusUpdate(agent.name, 'Approved')}
                                className="px-2.5 py-1 bg-green-500/10 border border-green-500/25 text-green-400 rounded hover:bg-green-500 hover:text-white transition-all font-semibold"
                              >
                                Approve
                              </button>
                            )}
                            {agent.status !== 'Suspended' && (
                              <button
                                onClick={() => handleStatusUpdate(agent.name, 'Suspended')}
                                className="px-2.5 py-1 bg-red-500/10 border border-red-500/25 text-red-400 rounded hover:bg-red-500 hover:text-white transition-all font-semibold"
                              >
                                Suspend
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: SALES & COMMISSIONS */}
        {activeTab === 'sales' && (
          <div className="flex flex-col gap-8">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
              <div className="bg-[#0e1217] border border-gray-800 p-6 rounded-xl text-center">
                <div className="text-xs text-gray-400 uppercase font-bold tracking-wider">Active Partners</div>
                <div className="text-3xl font-black text-white mt-2">{approvedAgentsCount}</div>
              </div>
              <div className="bg-[#0e1217] border border-gray-800 p-6 rounded-xl text-center">
                <div className="text-xs text-gray-400 uppercase font-bold tracking-wider">B2B Bookings</div>
                <div className="text-3xl font-black text-[#c5a059] mt-2">{bookings.length}</div>
              </div>
              <div className="bg-[#0e1217] border border-gray-800 p-6 rounded-xl text-center">
                <div className="text-xs text-gray-400 uppercase font-bold tracking-wider">Company Billings</div>
                <div className="text-3xl font-black text-green-400 mt-2">PKR {totalBillings.toLocaleString()}</div>
              </div>
              <div className="bg-[#0e1217] border border-gray-800 p-6 rounded-xl text-center">
                <div className="text-xs text-gray-400 uppercase font-bold tracking-wider">Est. Commissions</div>
                <div className="text-3xl font-black text-blue-400 mt-2">PKR {totalCommissions.toLocaleString()}</div>
              </div>
            </div>


            <div className="bg-[#0e1217] border border-gray-800 rounded-xl overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#05080a] border-b border-gray-800 text-gray-400 uppercase font-bold">
                    <tr>
                      <th className="py-3.5 px-4">Booking Ref</th>
                      <th className="py-3.5 px-4">Customer</th>
                      <th className="py-3.5 px-4">Package</th>
                      <th className="py-3.5 px-4 text-right">Base Cost</th>
                      <th className="py-3.5 px-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800 text-gray-300">
                    {bookings.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-gray-500">No bookings logged.</td>
                      </tr>
                    ) : (
                      bookings
                        .filter((b: any) => b.packageName.toLowerCase().includes(searchTerm.toLowerCase()) || b.contact.name.toLowerCase().includes(searchTerm.toLowerCase()))
                        .map((b: any, idx: number) => (
                          <tr key={b._id || idx} className="hover:bg-gray-900/40">
                            <td className="py-4 px-4 font-mono text-[#c5a059] font-bold">{b._id ? b._id.substring(18) : `B-${idx}`}</td>
                            <td className="py-4 px-4">
                              <div className="font-bold text-white">{b.contact.name}</div>
                              <div className="text-[10px] text-gray-500">Passport: {b.pilgrims[0]?.passportNumber || 'N/A'}</div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="font-semibold text-white">{b.packageName} ({b.roomingType})</div>
                              <div className="text-[10px] mt-0.5">
                                {b.isCustomized ? (
                                  <span className="text-yellow-400 font-bold bg-yellow-500/10 border border-yellow-500/20 px-1.5 py-0.5 rounded text-[9px]">Customized</span>
                                ) : (
                                  <span className="text-gray-400 bg-gray-800/60 border border-gray-700 px-1.5 py-0.5 rounded text-[9px]">Complete</span>
                                )}
                              </div>
                            </td>
                            <td className="py-4 px-4 text-right font-black text-white">PKR {b.totalPrice.toLocaleString()}</td>
                            <td className="py-4 px-4 text-center">
                              <span className="px-2 py-0.5 rounded bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 font-bold text-[9px]">
                                {b.status || 'Pending Payment'}
                              </span>
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: TEAM DIRECTORY */}
        {activeTab === 'team' && (
          <div className="flex flex-col gap-6 animate-fadeIn">
            <div className="flex justify-between items-center bg-[#0e1217] border border-gray-800 rounded-xl p-4">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <i className="fa-solid fa-user-group text-[#c5a059]"></i>
                  Team Member Administration
                </h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  View, add, update, and manage the official team members displayed on the landing page directory.
                </p>
              </div>
              <button
                onClick={openAddMemberModal}
                className="px-4 py-2 bg-[#c5a059] text-[#05080a] text-xs font-bold rounded hover:bg-[#a6823c] transition-all flex items-center gap-2"
              >
                <i className="fa-solid fa-plus"></i> Add Team Member
              </button>
            </div>

            <div className="bg-[#0e1217] border border-gray-800 rounded-xl overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#05080a] border-b border-gray-800 text-gray-400 uppercase font-bold">
                    <tr>
                      <th className="py-3.5 px-4">Member Name</th>
                      <th className="py-3.5 px-4">Role & Designation</th>
                      <th className="py-3.5 px-4">Office</th>
                      <th className="py-3.5 px-4">Contact Details</th>
                      <th className="py-3.5 px-4 text-center">Status</th>
                      <th className="py-3.5 px-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800 text-gray-300">
                    {(teamMembers.length > 0 ? teamMembers : fallbackTeam).length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-gray-500">No team members loaded.</td>
                      </tr>
                    ) : (
                      (teamMembers.length > 0 ? teamMembers : fallbackTeam)
                        .filter((m: any) => m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.designation.toLowerCase().includes(searchTerm.toLowerCase()))
                        .map((m: any, idx: number) => (
                          <tr key={m._id || idx} className="hover:bg-gray-900/40">
                            <td className="py-4 px-4 font-bold text-white text-sm">
                              {m.name}
                              <div className="text-[10px] text-gray-500 font-mono mt-0.5">{m._id || 'Static Fallback'}</div>
                            </td>
                            <td className="py-4 px-4">
                              <span className="px-2 py-0.5 rounded bg-[#c5a059]/10 border border-[#c5a059]/20 text-[#c5a059] font-bold text-[9px] uppercase tracking-wide">
                                {m.role}
                              </span>
                              <div className="text-[11px] font-semibold mt-1 text-gray-300">{m.designation}</div>
                            </td>
                            <td className="py-4 px-4 text-gray-400 font-medium">
                              <i className="fa-solid fa-location-dot text-[#c5a059] mr-1"></i> {m.office}
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex flex-col gap-1">
                                {m.emails && m.emails.map((email: string, eIdx: number) => (
                                  <div key={eIdx} className="flex items-center gap-1.5 text-gray-400">
                                    <i className="fa-solid fa-envelope text-[#c5a059]/70 text-[10px]"></i>
                                    <span>{email}</span>
                                  </div>
                                ))}
                                {m.phones && m.phones.map((phone: string, pIdx: number) => (
                                  <div key={pIdx} className="flex items-center gap-1.5 text-gray-400 mt-0.5">
                                    <i className="fa-solid fa-phone text-[#c5a059]/70 text-[10px]"></i>
                                    <span>{phone}</span>
                                  </div>
                                ))}
                              </div>
                            </td>
                            <td className="py-4 px-4 text-center">
                              <button
                                onClick={() => handleMemberToggleActive(m)}
                                disabled={!m._id}
                                className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-all ${m.isActive !== false
                                  ? 'bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20'
                                  : 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20'
                                  } ${!m._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                              >
                                {m.isActive !== false ? 'Active' : 'Inactive'}
                              </button>
                            </td>
                            <td className="py-4 px-4 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => openEditMemberModal(m)}
                                  className="p-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white rounded transition-all"
                                  title="Edit Member"
                                >
                                  <i className="fa-solid fa-pen text-xs"></i>
                                </button>
                                {m._id && (
                                  <button
                                    onClick={() => handleMemberDelete(m._id)}
                                    className="p-1.5 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded transition-all"
                                    title="Delete Member"
                                  >
                                    <i className="fa-solid fa-trash-can text-xs"></i>
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* RATE EDIT MODAL */}
      {editingPkg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0e1217] w-full max-w-md rounded-xl border border-[#c5a059]/20 shadow-2xl overflow-hidden animate-fadeIn">
            <div className="bg-[#05080a] py-4 px-6 border-b border-[#c5a059]/15 flex justify-between items-center">
              <div>
                <span className="text-xs text-[#c5a059] font-bold uppercase tracking-widest">Pricing Console</span>
                <h3 className="text-base font-bold text-white mt-0.5">Update Package Rates</h3>
              </div>
              <button onClick={() => setEditingPkg(null)} className="text-gray-400 hover:text-white text-xl">&times;</button>
            </div>

            <form onSubmit={handleRateSubmit} className="p-6 flex flex-col gap-4">
              <div className="bg-[#05080a] p-3 rounded border border-gray-800 text-xs text-gray-400 mb-2">
                <div>Modifying rates for:</div>
                <strong className="text-white text-sm">{editingPkg.title}</strong>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase text-[#c5a059] tracking-wider">Sharing Price</label>
                  <input
                    type="number"
                    value={rateForm.price_sharing}
                    onChange={(e) => setRateForm(prev => ({ ...prev, price_sharing: parseInt(e.target.value) }))}
                    className="bg-[#05080a] border border-gray-800 focus:border-[#c5a059] text-white px-3 py-2 rounded text-xs outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase text-[#c5a059] tracking-wider">Quad Price</label>
                  <input
                    type="number"
                    value={rateForm.price_quad}
                    onChange={(e) => setRateForm(prev => ({ ...prev, price_quad: parseInt(e.target.value) }))}
                    className="bg-[#05080a] border border-gray-800 focus:border-[#c5a059] text-white px-3 py-2 rounded text-xs outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase text-[#c5a059] tracking-wider">Triple Price</label>
                  <input
                    type="number"
                    value={rateForm.price_triple}
                    onChange={(e) => setRateForm(prev => ({ ...prev, price_triple: parseInt(e.target.value) }))}
                    className="bg-[#05080a] border border-gray-800 focus:border-[#c5a059] text-white px-3 py-2 rounded text-xs outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase text-[#c5a059] tracking-wider">Double Price</label>
                  <input
                    type="number"
                    value={rateForm.price_double}
                    onChange={(e) => setRateForm(prev => ({ ...prev, price_double: parseInt(e.target.value) }))}
                    className="bg-[#05080a] border border-gray-800 focus:border-[#c5a059] text-white px-3 py-2 rounded text-xs outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase text-[#c5a059] tracking-wider">Single Price</label>
                <input
                  type="number"
                  value={rateForm.price_single}
                  onChange={(e) => setRateForm(prev => ({ ...prev, price_single: parseInt(e.target.value) }))}
                  className="bg-[#05080a] border border-gray-800 focus:border-[#c5a059] text-white px-3 py-2 rounded text-xs outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSyncing}
                className="w-full py-3 bg-[#c5a059] text-[#05080a] font-bold rounded mt-4"
              >
                {isSyncing ? 'Syncing...' : 'Save Real-time Sync'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TEAM MEMBER ADD/EDIT MODAL */}
      {(isAddingMember || editingMember) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-[#0e1217] w-full max-w-md rounded-xl border border-[#c5a059]/25 shadow-2xl overflow-hidden">
            <div className="bg-[#05080a] py-4 px-6 border-b border-[#c5a059]/20 flex justify-between items-center">
              <div>
                <span className="text-xs text-[#c5a059] font-bold uppercase tracking-widest">Team Management</span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  {editingMember ? 'Update Team Member' : 'Add New Team Member'}
                </h3>
              </div>
              <button
                onClick={() => { setIsAddingMember(false); setEditingMember(null); }}
                className="text-gray-400 hover:text-white text-xl"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleMemberSubmit} className="p-6 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase text-[#c5a059] tracking-wider">Full Name</label>
                <input
                  type="text"
                  required
                  value={memberForm.name}
                  onChange={(e) => setMemberForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Chauhdry Muhammad Aslam"
                  className="bg-[#05080a] border border-gray-800 focus:border-[#c5a059] text-white px-3 py-2 rounded text-xs outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase text-[#c5a059] tracking-wider">Role Tag</label>
                  <input
                    type="text"
                    required
                    value={memberForm.role}
                    onChange={(e) => setMemberForm(prev => ({ ...prev, role: e.target.value }))}
                    placeholder="e.g. Team Head"
                    className="bg-[#05080a] border border-gray-800 focus:border-[#c5a059] text-white px-3 py-2 rounded text-xs outline-none transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase text-[#c5a059] tracking-wider">Designation</label>
                  <input
                    type="text"
                    required
                    value={memberForm.designation}
                    onChange={(e) => setMemberForm(prev => ({ ...prev, designation: e.target.value }))}
                    placeholder="e.g. CEO"
                    className="bg-[#05080a] border border-gray-800 focus:border-[#c5a059] text-white px-3 py-2 rounded text-xs outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase text-[#c5a059] tracking-wider">Office Location</label>
                <input
                  type="text"
                  required
                  value={memberForm.office}
                  onChange={(e) => setMemberForm(prev => ({ ...prev, office: e.target.value }))}
                  placeholder="e.g. Lahore Office"
                  className="bg-[#05080a] border border-gray-800 focus:border-[#c5a059] text-white px-3 py-2 rounded text-xs outline-none transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase text-[#c5a059] tracking-wider">Emails (comma separated)</label>
                <input
                  type="text"
                  value={memberForm.emails}
                  onChange={(e) => setMemberForm(prev => ({ ...prev, emails: e.target.value }))}
                  placeholder=" hlaique@yahoo.com/hijartulharamtravels@gmail.com, support@itt.sa"
                  className="bg-[#05080a] border border-gray-800 focus:border-[#c5a059] text-white px-3 py-2 rounded text-xs outline-none transition-all placeholder:text-gray-700"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase text-[#c5a059] tracking-wider">Phones (comma separated)</label>
                <input
                  type="text"
                  value={memberForm.phones}
                  onChange={(e) => setMemberForm(prev => ({ ...prev, phones: e.target.value }))}
                  placeholder="+92 300-0860633, +966 50-086-0633"
                  className="bg-[#05080a] border border-gray-800 focus:border-[#c5a059] text-white px-3 py-2 rounded text-xs outline-none transition-all placeholder:text-gray-700"
                />
              </div>

              <div className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  id="member-active-checkbox"
                  checked={memberForm.isActive}
                  onChange={(e) => setMemberForm(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="rounded border-gray-800 bg-[#05080a] text-[#c5a059] focus:ring-0 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="member-active-checkbox" className="text-xs font-bold text-gray-300 cursor-pointer">
                  Show on Public Homepage (Active Status)
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#c5a059] text-[#05080a] font-bold rounded mt-4 hover:bg-[#a6823c] transition-all text-xs uppercase tracking-wider"
              >
                {editingMember ? 'Update Member Info' : 'Add Team Member'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* PACKAGE ADD/EDIT MODAL */}
      {(isAddingPkg || editingFullPkg) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-[#0e1217] w-full max-w-lg rounded-xl border border-[#c5a059]/25 shadow-2xl overflow-hidden my-8">
            <div className="bg-[#05080a] py-4 px-6 border-b border-[#c5a059]/20 flex justify-between items-center">
              <div>
                <span className="text-xs text-[#c5a059] font-bold uppercase tracking-widest">Package Console</span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  {editingFullPkg ? 'Update Package Details' : 'Create New Umrah Package'}
                </h3>
              </div>
              <button
                onClick={() => { setIsAddingPkg(false); setEditingFullPkg(null); }}
                className="text-gray-400 hover:text-white text-xl"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handlePkgSubmit} className="p-6 flex flex-col gap-4 max-h-[75vh] overflow-y-auto">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase text-[#c5a059] tracking-wider">Package Title</label>
                <input
                  type="text"
                  required
                  value={pkgForm.title}
                  onChange={(e) => setPkgForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. 15 Days Star Umrah Package"
                  className="bg-[#05080a] border border-gray-800 focus:border-[#c5a059] text-white px-3 py-2 rounded text-xs outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase text-[#c5a059] tracking-wider">Departure City</label>
                  <select
                    value={pkgForm.city}
                    onChange={(e) => setPkgForm(prev => ({ ...prev, city: e.target.value }))}
                    className="bg-[#05080a] border border-gray-800 focus:border-[#c5a059] text-white px-3 py-2 rounded text-xs outline-none transition-all cursor-pointer"
                  >
                    {['Islamabad', 'Karachi', 'Lahore', 'Sialkot', 'Peshawar', 'Multan', 'Faisalabad'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase text-[#c5a059] tracking-wider">Duration Description</label>
                  <input
                    type="text"
                    required
                    value={pkgForm.duration}
                    onChange={(e) => setPkgForm(prev => ({ ...prev, duration: e.target.value }))}
                    placeholder="e.g. 15 Days (7 Makkah - 8 Madinah)"
                    className="bg-[#05080a] border border-gray-800 focus:border-[#c5a059] text-white px-3 py-2 rounded text-xs outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase text-[#c5a059] tracking-wider">Makkah Hotel</label>
                  <input
                    type="text"
                    required
                    value={pkgForm.makkahHotel}
                    onChange={(e) => setPkgForm(prev => ({ ...prev, makkahHotel: e.target.value }))}
                    placeholder="e.g. Swissôtel Makkah"
                    className="bg-[#05080a] border border-gray-800 focus:border-[#c5a059] text-white px-3 py-2 rounded text-xs outline-none transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase text-[#c5a059] tracking-wider">Madinah Hotel</label>
                  <input
                    type="text"
                    required
                    value={pkgForm.madinahHotel}
                    onChange={(e) => setPkgForm(prev => ({ ...prev, madinahHotel: e.target.value }))}
                    placeholder="e.g. Pullman Zamzam Madinah"
                    className="bg-[#05080a] border border-gray-800 focus:border-[#c5a059] text-white px-3 py-2 rounded text-xs outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase text-[#c5a059] tracking-wider">Package Inclusions (comma-separated)</label>
                <textarea
                  value={pkgForm.features}
                  onChange={(e) => setPkgForm(prev => ({ ...prev, features: e.target.value }))}
                  placeholder="Airline Flights Included, Umrah Visa & Insurance, Makkah & Madinah Hotels"
                  rows={2}
                  className="bg-[#05080a] border border-gray-800 focus:border-[#c5a059] text-white px-3 py-2 rounded text-xs outline-none transition-all placeholder:text-gray-700"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase text-[#c5a059] tracking-wider">Description</label>
                <textarea
                  value={pkgForm.description}
                  onChange={(e) => setPkgForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Details about flights, proximity, features, etc..."
                  rows={2}
                  className="bg-[#05080a] border border-gray-800 focus:border-[#c5a059] text-white px-3 py-2 rounded text-xs outline-none transition-all placeholder:text-gray-700"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase text-[#c5a059] tracking-wider">Package Image URL (Optional)</label>
                <input
                  type="text"
                  value={pkgForm.image}
                  onChange={(e) => setPkgForm(prev => ({ ...prev, image: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                  className="bg-[#05080a] border border-gray-800 focus:border-[#c5a059] text-white px-3 py-2 rounded text-xs outline-none transition-all placeholder:text-gray-700"
                />
              </div>

              {/* Prices Section */}
              <div className="border-t border-gray-800 pt-3">
                <span className="text-[10px] font-bold uppercase text-[#c5a059] tracking-wider block mb-3">Rooming Pricing (PKR Base)</span>
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-bold uppercase text-gray-400">Sharing Price</label>
                    <input
                      type="number"
                      required
                      value={pkgForm.price_sharing}
                      onChange={(e) => setPkgForm(prev => ({ ...prev, price_sharing: parseInt(e.target.value) || 0 }))}
                      className="bg-[#05080a] border border-gray-800 focus:border-[#c5a059] text-white px-2 py-1.5 rounded text-xs outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-bold uppercase text-gray-400">Quad Price</label>
                    <input
                      type="number"
                      required
                      value={pkgForm.price_quad}
                      onChange={(e) => setPkgForm(prev => ({ ...prev, price_quad: parseInt(e.target.value) || 0 }))}
                      className="bg-[#05080a] border border-gray-800 focus:border-[#c5a059] text-white px-2 py-1.5 rounded text-xs outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-bold uppercase text-gray-400">Triple Price</label>
                    <input
                      type="number"
                      required
                      value={pkgForm.price_triple}
                      onChange={(e) => setPkgForm(prev => ({ ...prev, price_triple: parseInt(e.target.value) || 0 }))}
                      className="bg-[#05080a] border border-gray-800 focus:border-[#c5a059] text-white px-2 py-1.5 rounded text-xs outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-bold uppercase text-gray-400">Double Price</label>
                    <input
                      type="number"
                      required
                      value={pkgForm.price_double}
                      onChange={(e) => setPkgForm(prev => ({ ...prev, price_double: parseInt(e.target.value) || 0 }))}
                      className="bg-[#05080a] border border-gray-800 focus:border-[#c5a059] text-white px-3 py-1.5 rounded text-xs outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-bold uppercase text-gray-400">Single Price</label>
                    <input
                      type="number"
                      required
                      value={pkgForm.price_single}
                      onChange={(e) => setPkgForm(prev => ({ ...prev, price_single: parseInt(e.target.value) || 0 }))}
                      className="bg-[#05080a] border border-gray-800 focus:border-[#c5a059] text-white px-3 py-1.5 rounded text-xs outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-800">
                <input
                  type="checkbox"
                  id="pkg-active-checkbox"
                  checked={pkgForm.isActive}
                  onChange={(e) => setPkgForm(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="rounded border-gray-800 bg-[#05080a] text-[#c5a059] focus:ring-0 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="pkg-active-checkbox" className="text-xs font-bold text-gray-300 cursor-pointer">
                  Activate Package (Show on Public Portal)
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#c5a059] text-[#05080a] font-bold rounded mt-4 hover:bg-[#a6823c] transition-all text-xs uppercase tracking-wider"
              >
                {editingFullPkg ? 'Update Package Details' : 'Create Package'}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
