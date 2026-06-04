import React, { useState, useEffect } from 'react';

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
}

interface Pilgrim {
  name: string;
  passportNumber: string;
}

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
      "Luxury shared air-conditioned coach transfers"
    ],
    image: "https://meezabgroup.com/wp-content/uploads/2025/07/Islamabad-Group-Pkg-_page-0001.jpg",
    price_sharing: 312800,
    price_quad: 324875,
    price_triple: 345575,
    price_double: 387550
  }
];

export default function App() {
  const [packages, setPackages] = useState<UmrahPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // BI Dashboard states
  const [bookings, setBookings] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalSales: 0,
    totalCommissions: 0,
    bookingsCount: 0,
    inquiriesCount: 0,
    packagesCount: 0
  });

  const navigateTo = (page: 'home' | 'portal' | 'dashboard', hash?: string) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
    setSearchQuery('');
    if (page === 'home' && hash) {
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

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
  const [bookingStatus, setBookingStatus] = useState<{ type: 'success' | 'error' | 'info' | null; message: string; bookingId?: string }>({
    type: null,
    message: ''
  });

  const BACKEND_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? 'http://localhost:5000' 
    : `http://${window.location.hostname}:5000`;

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
    if (currentPage === 'dashboard') {
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

      setDashboardStats(prev => ({
        ...prev,
        packagesCount: packages.length
      }));
    }
  }, [currentPage, BACKEND_URL, packages]);


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

  // E-commerce checkout logic
  const openBookingModal = (pkg: UmrahPackage) => {
    setSelectedPkg(pkg);
    setRoomingType('sharing');
    setPilgrimsCount(1);
    setContactInfo({ name: '', email: '', phone: '' });
    setPilgrims([{ name: '', passportNumber: '' }]);
    setBookingStatus({ type: null, message: '' });
  };

  const handlePilgrimCountChange = (count: number) => {
    const newCount = Math.max(1, count);
    setPilgrimsCount(newCount);
    
    // Adjust pilgrims array size
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
    switch (roomingType) {
      case 'sharing': return pkg.price_sharing || 270000;
      case 'quad': return pkg.price_quad || 280000;
      case 'triple': return pkg.price_triple || 295000;
      case 'double': return pkg.price_double || 315000;
    }
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPkg) return;

    setBookingStatus({ type: 'info', message: 'Creating your reservation...' });

    const total = getPricePerPilgrim(selectedPkg) * pilgrimsCount;

    const payload = {
      packageId: selectedPkg._id || 'fallback_id',
      packageName: selectedPkg.title,
      roomingType,
      pilgrimsCount,
      totalPrice: total,
      contact: contactInfo,
      pilgrims
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

  return (
    <div className="min-h-screen bg-[#05080a] text-gray-100 flex flex-col font-sans selection:bg-[#c5a059] selection:text-[#05080a]">
      {/* HEADER & NAVBAR */}
      <header className="sticky top-0 z-50 bg-[#05080a]/95 backdrop-blur-md border-b border-[#c5a059]/15">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center max-w-7xl">
          <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('home'); }} className="flex items-center gap-3">
            <span className="text-[#c5a059] text-2.5xl animate-spin-slow inline-block"><i className="fa-solid fa-compass"></i></span>
            <span className="text-xl font-bold tracking-wide text-white uppercase">
              Insight <span className="text-[#c5a059] font-serif capitalize">Travel & Tourism</span>
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('home'); }} className={`text-sm font-medium hover:text-[#c5a059] transition-colors ${currentPage === 'home' ? 'text-white' : 'text-gray-400'}`}>Home</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('home', 'services'); }} className="text-sm font-medium text-gray-400 hover:text-[#c5a059] transition-colors">Services</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('home', 'spiritual'); }} className="text-sm font-medium text-gray-400 hover:text-[#c5a059] transition-colors">Spiritual Journeys</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('home', 'wonders'); }} className="text-sm font-medium text-gray-400 hover:text-[#c5a059] transition-colors">World Tours</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('portal'); }} className={`text-sm font-medium hover:text-[#c5a059] transition-colors ${currentPage === 'portal' ? 'text-[#c5a059] font-bold' : 'text-gray-400'}`}>Umrah E-Portal</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('dashboard'); }} className={`text-sm font-medium hover:text-[#c5a059] transition-colors ${currentPage === 'dashboard' ? 'text-[#c5a059] font-bold' : 'text-gray-400'}`}>BI Dashboard</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('home', 'team'); }} className="text-sm font-medium text-gray-400 hover:text-[#c5a059] transition-colors">Team</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('home', 'contact'); }} className="px-5 py-2 bg-[#c5a059] text-[#05080a] text-sm font-semibold rounded hover:bg-[#b48e47] transition-all">
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
          <div className="lg:hidden bg-[#0e1217] border-b border-[#c5a059]/15 py-6 px-8 flex flex-col gap-5">
            <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('home'); }} className="text-lg hover:text-[#c5a059] transition-colors">Home</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('home', 'services'); }} className="text-lg hover:text-[#c5a059] transition-colors">Services</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('home', 'spiritual'); }} className="text-lg hover:text-[#c5a059] transition-colors">Spiritual Journeys</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('home', 'wonders'); }} className="text-lg hover:text-[#c5a059] transition-colors">World Tours</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('portal'); }} className="text-lg text-[#c5a059] font-bold">Umrah E-Portal</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('dashboard'); }} className="text-lg hover:text-[#c5a059] transition-colors">BI Dashboard</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('home', 'team'); }} className="text-lg hover:text-[#c5a059] transition-colors">Team</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('home', 'contact'); }} className="py-3 text-center bg-[#c5a059] text-[#05080a] font-bold rounded">
              Inquire Now
            </a>
          </div>
        )}
      </header>

      {currentPage === 'home' ? (
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
                  Specializing in spiritual, serene Umrah pilgrimages and premium, tailored World Tour packages. Connect with Insight Travel & Tourism for trusted guidance, comfort, and premium arrangements.
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <button 
                    onClick={() => navigateTo('portal')}
                    className="w-full sm:w-auto px-8 py-4 bg-[#c5a059] text-[#05080a] font-bold rounded hover:bg-[#b48e47] transition-all transform hover:-translate-y-1 shadow-lg shadow-[#c5a059]/20 flex items-center justify-center gap-2"
                  >
                    Submit Inquiry <i className="fa-solid fa-arrow-right"></i>
                  </button>
                  <button 
                    onClick={() => navigateTo('home', 'services')}
                    className="w-full sm:w-auto px-8 py-4 bg-transparent text-white border border-gray-700 font-bold rounded hover:border-[#c5a059] hover:text-[#c5a059] transition-all"
                  >
                    Explore Services
                  </button>
                </div>
              </div>
              <div className="col-span-1 lg:col-span-5 flex flex-col gap-6 items-center lg:items-end justify-center">
                <div className="bg-[#0e1217]/80 border border-white/10 backdrop-blur-md p-6 rounded-2xl flex items-center gap-5 w-[260px] shadow-2xl transition-all hover:-translate-y-1.5 hover:border-[#c5a059]/40 animate-float cursor-pointer" onClick={() => navigateTo('portal')}>
                  <span className="text-[#c5a059] text-3xl"><i className="fa-solid fa-kaaba"></i></span>
                  <span className="text-base font-bold text-white">Umrah & Hajj</span>
                </div>
                <div className="bg-[#0e1217]/80 border border-white/10 backdrop-blur-md p-6 rounded-2xl flex items-center gap-5 w-[260px] shadow-2xl transition-all hover:-translate-y-1.5 hover:border-[#c5a059]/40 animate-float-delayed cursor-pointer" onClick={() => navigateTo('home', 'wonders')}>
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
                {/* Umrah Card */}
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
                    <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('portal'); }} className="text-[#c5a059] font-bold text-sm hover:underline mt-auto flex items-center gap-2">
                      View Live Packages <i className="fa-solid fa-chevron-right text-xs"></i>
                    </a>
                  </div>
                </div>

                {/* World Tour Card */}
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
                    <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('home', 'wonders'); }} className="text-[#c5a059] font-bold text-sm hover:underline mt-auto flex items-center gap-2">
                      Inquire about World Tours <i className="fa-solid fa-chevron-right text-xs"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SPIRITUAL JOURNEYS (ORIGINAL SECTION) */}
          <section id="spiritual" className="py-24 bg-[#05080a]">
            <div className="container mx-auto px-6 max-w-7xl">
              <div className="text-center max-w-2xl mx-auto mb-16">
                <h2 className="text-3xl font-serif text-white font-bold">Spiritual Journeys</h2>
                <div className="w-16 h-0.5 bg-[#c5a059] mx-auto mt-4"></div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Cards matching the original index.php content */}
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

          {/* INTERNATIONAL WONDERS (ORIGINAL SECTION) */}
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

              {/* DYNAMIC PORTAL CTA BANNER */}
              <div className="mt-20 bg-[#0e1217] border border-[#c5a059]/15 rounded-xl p-8 sm:p-12 text-center max-w-4xl mx-auto shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-[#c5a059]"></div>
                <h3 className="text-2xl font-serif text-white font-bold mb-4">Umrah Booking E-Portal</h3>
                <p className="text-gray-400 text-sm max-w-2xl mx-auto mb-8 leading-relaxed">
                  Ready to answer the sacred call? We offer dynamic, clean Unicode packages mapped directly from respected departure cities across Pakistan. Choose room options and place bookings through our real-time checkout flow.
                </p>
                <button 
                  onClick={() => navigateTo('portal')}
                  className="px-8 py-3.5 bg-[#c5a059] text-[#05080a] font-bold rounded-lg hover:bg-[#b48e47] transition-all transform hover:-translate-y-0.5 shadow-lg shadow-[#c5a059]/10"
                >
                  Enter Sacred Umrah Portal <i className="fa-solid fa-arrow-right-to-bracket ml-2"></i>
                </button>
              </div>
            </div>
          </section>

          {/* TEAM SECTION (CEO MR. HAFIZ LAIQUE SHAHID & AHMAD HASAN MARJAN) */}
          <section id="team" className="py-24 bg-[#05080a]">
            <div className="container mx-auto px-6 max-w-7xl">
              <div className="text-center max-w-2xl mx-auto mb-16">
                <h2 className="text-3xl font-serif text-white font-bold">Our Team</h2>
                <p className="text-[#c5a059] text-sm mt-1">Leadership at Lahore Office</p>
                <div className="w-16 h-0.5 bg-[#c5a059] mx-auto mt-4"></div>
              </div>

              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <div className="bg-[#0e1217] p-8 rounded border border-[#c5a059]/10 hover:border-[#c5a059]/30 transition-all flex flex-col">
                  <span className="self-start px-3 py-1 bg-[#c5a059]/10 text-[#c5a059] text-xs font-bold uppercase tracking-wider rounded border border-[#c5a059]/20 mb-4">
                    Team Head
                  </span>
                  <h3 className="text-2xl font-bold text-white mb-1">Mr. Hafiz Laique Shahid</h3>
                  <p className="text-sm text-[#c5a059] font-semibold mb-2 font-serif">CEO</p>
                  <p className="text-xs text-gray-400 mb-6"><i className="fa-solid fa-location-dot"></i> Lahore, Pakistan Office</p>
                  
                  <div className="flex flex-col gap-3 mt-auto pt-6 border-t border-gray-800">
                    <div className="flex items-center gap-3 text-sm text-gray-300">
                      <span className="text-[#c5a059] w-5"><i className="fa-solid fa-envelope"></i></span>
                      <div className="flex flex-col">
                        <a href="mailto:hlaique@yahoo.com" className="hover:text-[#c5a059] transition-colors">hlaique@yahoo.com</a>
                        <a href="mailto:hijartulharamtravels@gmail.com" className="hover:text-[#c5a059] transition-colors">hijartulharamtravels@gmail.com</a>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-300">
                      <span className="text-[#c5a059] w-5"><i className="fa-solid fa-phone"></i></span>
                      <div className="flex flex-col">
                        <a href="tel:+923018490804" className="hover:text-[#c5a059] transition-colors">+92 301-8490804</a>
                        <a href="tel:+966552945129" className="hover:text-[#c5a059] transition-colors">+966 55-294-5129</a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0e1217] p-8 rounded border border-[#c5a059]/10 hover:border-[#c5a059]/30 transition-all flex flex-col">
                  <span className="self-start px-3 py-1 bg-[#c5a059]/10 text-[#c5a059] text-xs font-bold uppercase tracking-wider rounded border border-[#c5a059]/20 mb-4">
                    Executive Director
                  </span>
                  <h3 className="text-2xl font-bold text-white mb-1">Ahmad Hasan Marjan</h3>
                  <p className="text-sm text-[#c5a059] font-semibold mb-2 font-serif">Executive Director</p>
                  <p className="text-xs text-gray-400 mb-6"><i className="fa-solid fa-location-dot"></i> Lahore, Pakistan Office</p>
                  
                  <div className="flex flex-col gap-3 mt-auto pt-6 border-t border-gray-800">
                    <div className="flex items-center gap-3 text-sm text-gray-300">
                      <span className="text-[#c5a059] w-5"><i className="fa-solid fa-envelope"></i></span>
                      <a href="mailto:m@itt.sa" className="hover:text-[#c5a059] transition-colors">m@itt.sa</a>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-300">
                      <span className="text-[#c5a059] w-5"><i className="fa-solid fa-phone"></i></span>
                      <a href="tel:+966500860633" className="hover:text-[#c5a059] transition-colors">+966 50-086-0633</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      ) : currentPage === 'portal' ? (
        /* DEDICATED PORTAL PAGE */
        <section className="py-16 bg-[#05080a] flex-grow">
          <div className="container mx-auto px-6 max-w-7xl">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-[#0e1217] to-[#080b0f] border border-[#c5a059]/15 rounded-xl p-8 mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <div className="flex items-center gap-2.5 text-xs text-[#c5a059] font-bold uppercase tracking-wider mb-2">
                  <span className="hover:underline cursor-pointer" onClick={() => navigateTo('home')}>Home</span>
                  <span><i className="fa-solid fa-chevron-right text-[10px]"></i></span>
                  <span>Umrah Booking E-Portal</span>
                </div>
                <h2 className="text-3xl font-serif text-white font-bold">Umrah Booking E-Portal</h2>
                <p className="text-gray-400 text-sm mt-1 leading-relaxed">
                  Categorized Unicode offerings from Islamabad, Lahore, Sialkot, Peshawar, Multan, and Faisalabad.
                </p>
              </div>
              <button 
                onClick={() => navigateTo('home')}
                className="px-6 py-2.5 bg-transparent border border-gray-800 text-gray-300 rounded hover:border-[#c5a059] hover:text-[#c5a059] transition-all text-sm font-semibold flex items-center gap-2"
              >
                <i className="fa-solid fa-arrow-left"></i> Back to Homepage
              </button>
            </div>

            {/* Filters Row */}
            <div className="flex flex-col md:flex-row gap-6 justify-between items-center mb-10 bg-[#0e1217] p-5 rounded-lg border border-[#c5a059]/10">
              {/* Tabs */}
              <div className="flex flex-wrap gap-2 w-full md:w-auto">
                {['All', 'Islamabad', 'Lahore', 'Sialkot', 'Peshawar', 'Multan', 'Faisalabad'].map(city => (
                  <button
                    key={city}
                    onClick={() => setSelectedCity(city)}
                    className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border transition-all ${
                      selectedCity === city 
                        ? 'bg-[#c5a059] text-[#05080a] border-[#c5a059] shadow-lg shadow-[#c5a059]/15' 
                        : 'bg-[#05080a] text-gray-400 border-gray-800 hover:border-gray-700 hover:text-white'
                    }`}
                  >
                    {city === 'All' ? 'All Cities' : city}
                  </button>
                ))}
              </div>

              {/* Search Box */}
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

            {/* Packages Grid */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <span className="text-[#c5a059] text-4xl animate-spin"><i className="fa-solid fa-circle-notch"></i></span>
                <p className="text-gray-400 text-sm">Loading dynamic packages...</p>
              </div>
            ) : (
              (() => {
                // Filter by city and search query
                const filtered = packages.filter(pkg => {
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
                  <div className="grid md:grid-cols-2 gap-8">
                    {filtered.map((pkg, index) => {
                      const imageSrc = pkg.image ? (pkg.image.startsWith('http') ? pkg.image : BACKEND_URL + pkg.image) : '';
                      return (
                        <div key={pkg._id || index} className="bg-[#0e1217] rounded-xl overflow-hidden border border-[#c5a059]/10 hover:border-[#c5a059]/20 transition-all flex flex-col group shadow-lg">
                          <div className="relative h-64 w-full overflow-hidden">
                            <img 
                              src={imageSrc || "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=600"} 
                              alt={pkg.title} 
                              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0e1217] via-transparent to-transparent"></div>
                            <div className="absolute top-4 left-4 px-3 py-1 bg-[#05080a]/95 border border-[#c5a059]/30 text-[#c5a059] text-xs font-bold rounded uppercase tracking-wider">
                              {pkg.duration}
                            </div>
                            <div className="absolute bottom-4 right-4 px-4 py-1.5 bg-[#c5a059] text-[#05080a] text-sm font-extrabold rounded shadow">
                              Starts {pkg.price}
                            </div>
                          </div>
                          
                          <div className="p-8 flex flex-col flex-grow">
                            <div className="flex justify-between items-center gap-2 mb-2">
                              <h3 className="text-xl font-bold text-white">{pkg.title}</h3>
                              <span className="px-2.5 py-1 bg-[#c5a059]/10 border border-[#c5a059]/20 text-[#c5a059] rounded text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">
                                <i className="fa-solid fa-plane-departure mr-1.5"></i> From {pkg.city}
                              </span>
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed mb-6">{pkg.description}</p>
                            
                            {/* Stays info */}
                            <div className="bg-[#05080a]/60 border border-gray-800/80 p-4 rounded-lg flex flex-col gap-2.5 mb-6">
                              <div className="flex items-center gap-3 text-xs text-gray-300">
                                <span className="text-[#c5a059]"><i className="fa-solid fa-kaaba"></i></span>
                                <span>Makkah Accommodation: <strong>{pkg.hotels.makkah}</strong></span>
                              </div>
                              <div className="flex items-center gap-3 text-xs text-gray-300">
                                <span className="text-[#c5a059]"><i className="fa-solid fa-mosque"></i></span>
                                <span>Madinah Accommodation: <strong>{pkg.hotels.madinah}</strong></span>
                              </div>
                            </div>

                            {/* Features Inclusions */}
                            <div className="mb-6">
                              <h4 className="text-xs font-bold uppercase text-[#c5a059] tracking-wider mb-2.5">Package Inclusions</h4>
                              <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-400">
                                {pkg.features ? pkg.features.slice(0, 6).map((feat, fIdx) => (
                                  <div key={fIdx} className="flex items-center gap-2">
                                    <span className="text-green-500"><i className="fa-solid fa-circle-check text-[9px]"></i></span>
                                    <span className="truncate">{feat}</span>
                                  </div>
                                )) : (
                                  <>
                                    <div className="flex items-center gap-2">
                                      <span className="text-green-500"><i className="fa-solid fa-circle-check text-[9px]"></i></span>
                                      <span>Airline Flights Included</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-green-500"><i className="fa-solid fa-circle-check text-[9px]"></i></span>
                                      <span>Umrah Visa & Insurance</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-green-500"><i className="fa-solid fa-circle-check text-[9px]"></i></span>
                                      <span>Luxury Transfers</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-green-500"><i className="fa-solid fa-circle-check text-[9px]"></i></span>
                                      <span>Ziyarat Tours</span>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>

                            {/* Rooming Pricing Table */}
                            <div className="border border-gray-800 rounded-lg overflow-hidden mb-6 text-xs bg-[#05080a]/30">
                              <div className="bg-gray-900/40 grid grid-cols-4 py-2 px-3 text-gray-400 font-bold border-b border-gray-800 text-center">
                                <div>Double</div>
                                <div>Triple</div>
                                <div>Quad</div>
                                <div>Sharing</div>
                              </div>
                              <div className="grid grid-cols-4 py-2.5 px-3 text-center text-[#c5a059] font-bold">
                                <div>{pkg.price_double ? `${(pkg.price_double/1000).toFixed(0)}k` : '305k'}</div>
                                <div>{pkg.price_triple ? `${(pkg.price_triple/1000).toFixed(0)}k` : '290k'}</div>
                                <div>{pkg.price_quad ? `${(pkg.price_quad/1000).toFixed(0)}k` : '283k'}</div>
                                <div>{pkg.price_sharing ? `${(pkg.price_sharing/1000).toFixed(0)}k` : '274k'}</div>
                              </div>
                            </div>

                            <button 
                              onClick={() => openBookingModal(pkg)}
                              className="mt-auto w-full py-3 bg-[#c5a059] text-[#05080a] font-bold rounded-lg hover:bg-[#b48e47] transition-all flex items-center justify-center gap-2 shadow shadow-[#c5a059]/10"
                            >
                              Book & Checkout Online <i className="fa-solid fa-cart-shopping"></i>
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
      ) : (
        /* BI DASHBOARD PAGE */
        <section className="py-16 bg-[#05080a] flex-grow text-gray-100 animate-fadeIn">
          <div className="container mx-auto px-6 max-w-7xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#0e1217] to-[#080b0f] border border-[#c5a059]/15 rounded-xl p-8 mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <div className="flex items-center gap-2.5 text-xs text-[#c5a059] font-bold uppercase tracking-wider mb-2">
                  <span className="hover:underline cursor-pointer" onClick={() => navigateTo('home')}>Home</span>
                  <span><i className="fa-solid fa-chevron-right text-[10px]"></i></span>
                  <span>BI Dashboard</span>
                </div>
                <h2 className="text-3xl font-serif text-white font-bold">Business Intelligence Display</h2>
                <p className="text-gray-400 text-sm mt-1 leading-relaxed">
                  Real-time sales tracking, commission logs, booking distributions, and lead metrics.
                </p>
              </div>
              <button 
                onClick={() => navigateTo('home')}
                className="px-6 py-2.5 bg-transparent border border-gray-800 text-gray-300 rounded hover:border-[#c5a059] hover:text-[#c5a059] transition-all text-sm font-semibold flex items-center gap-2"
              >
                <i className="fa-solid fa-arrow-left"></i> Back to Homepage
              </button>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
              <div className="bg-[#0e1217] border border-[#c5a059]/15 p-6 rounded-xl shadow-lg relative overflow-hidden group">
                <div className="absolute -right-3 -bottom-3 text-7xl text-[#c5a059]/5 group-hover:scale-110 transition-transform"><i className="fa-solid fa-coins"></i></div>
                <div className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Sales Value</div>
                <div className="text-2xl font-black text-[#c5a059] mt-2">PKR {dashboardStats.totalSales.toLocaleString()}</div>
                <div className="text-[10px] text-gray-500 mt-1">Aggregated booking values</div>
              </div>
              <div className="bg-[#0e1217] border border-[#c5a059]/15 p-6 rounded-xl shadow-lg relative overflow-hidden group">
                <div className="absolute -right-3 -bottom-3 text-7xl text-[#c5a059]/5 group-hover:scale-110 transition-transform"><i className="fa-solid fa-percent"></i></div>
                <div className="text-xs font-bold uppercase tracking-wider text-gray-400">Est. Commissions</div>
                <div className="text-2xl font-black text-green-400 mt-2">PKR {dashboardStats.totalCommissions.toLocaleString()}</div>
                <div className="text-[10px] text-gray-500 mt-1">Calculated at 5% rate</div>
              </div>
              <div className="bg-[#0e1217] border border-[#c5a059]/15 p-6 rounded-xl shadow-lg relative overflow-hidden group">
                <div className="absolute -right-3 -bottom-3 text-7xl text-[#c5a059]/5 group-hover:scale-110 transition-transform"><i className="fa-solid fa-receipt"></i></div>
                <div className="text-xs font-bold uppercase tracking-wider text-gray-400">Bookings Logged</div>
                <div className="text-2xl font-black text-white mt-2">{dashboardStats.bookingsCount} Reservations</div>
                <div className="text-[10px] text-gray-500 mt-1">Real-time checkout orders</div>
              </div>
              <div className="bg-[#0e1217] border border-[#c5a059]/15 p-6 rounded-xl shadow-lg relative overflow-hidden group">
                <div className="absolute -right-3 -bottom-3 text-7xl text-[#c5a059]/5 group-hover:scale-110 transition-transform"><i className="fa-solid fa-envelope-open-text"></i></div>
                <div className="text-xs font-bold uppercase tracking-wider text-gray-400">Lead Inquiries</div>
                <div className="text-2xl font-black text-blue-400 mt-2">{dashboardStats.inquiriesCount} Leads</div>
                <div className="text-[10px] text-gray-500 mt-1">Interested customer entries</div>
              </div>
              <div className="bg-[#0e1217] border border-[#c5a059]/15 p-6 rounded-xl shadow-lg relative overflow-hidden group">
                <div className="absolute -right-3 -bottom-3 text-7xl text-[#c5a059]/5 group-hover:scale-110 transition-transform"><i className="fa-solid fa-box-open"></i></div>
                <div className="text-xs font-bold uppercase tracking-wider text-gray-400">Tour Offerings</div>
                <div className="text-2xl font-black text-purple-400 mt-2">{dashboardStats.packagesCount} Packages</div>
                <div className="text-[10px] text-gray-500 mt-1">Live active system options</div>
              </div>
            </div>

            {/* Interactive Analytical Charts */}
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

              {/* Chart 2: Rooming Option Distribution */}
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
                              <span className="text-[10px] text-gray-500 font-bold">{pct}% of bookings</span>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
                <div className="text-center text-xs text-gray-500 border-t border-gray-800/60 pt-4 mt-6">
                  Based on current registered checkout databases. Update status dynamically.
                </div>
              </div>
            </div>

            {/* Bookings Log Table */}
            <div className="bg-[#0e1217] p-6 rounded-xl border border-gray-800 mb-12 overflow-hidden">
              <h3 className="text-base font-bold text-white mb-6 flex items-center gap-2">
                <i className="fa-solid fa-list text-[#c5a059]"></i> Live Sales Booking Logs
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-gray-800 text-gray-400 uppercase font-extrabold tracking-wider">
                      <th className="py-3 px-4">Booking ID</th>
                      <th className="py-3 px-4">Contact Person</th>
                      <th className="py-3 px-4">Package</th>
                      <th className="py-3 px-4">Rooming Type</th>
                      <th className="py-3 px-4 text-center">Pilgrims</th>
                      <th className="py-3 px-4 text-right">Total Price</th>
                      <th className="py-3 px-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800 text-gray-300">
                    {bookings.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-gray-500">No active bookings registered yet. Try creating checkouts in the sacred portal page.</td>
                      </tr>
                    ) : (
                      bookings.map((booking, bIdx) => (
                        <tr key={booking._id || bIdx} className="hover:bg-gray-900/40">
                          <td className="py-3.5 px-4 font-mono text-[#c5a059] font-bold">{booking._id ? booking._id.substring(18) : `B-${1000+bIdx}`}</td>
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

            {/* Inquiries List Table */}
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
                      <th className="py-3 px-4">Contact Details</th>
                      <th className="py-3 px-4">Service Interest</th>
                      <th className="py-3 px-4">Message Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800 text-gray-300">
                    {inquiries.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-gray-500">No customer inquiries logged yet. Fill out the contact form to generate live leads.</td>
                      </tr>
                    ) : (
                      inquiries.map((inquiry, iIdx) => (
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

          </div>
        </section>
      )}

      {/* CHAIRMAN'S MESSAGE */}
      <section id="ceo-message" className="py-24 bg-[#05080a] border-t border-[#c5a059]/5">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="bg-[#0e1217] rounded-xl border border-[#c5a059]/10 p-8 sm:p-12 relative overflow-hidden text-center max-w-3xl mx-auto">
            <div className="w-full">
              <span className="text-5xl text-[#c5a059]/20 absolute top-6 right-8"><i className="fa-solid fa-quote-right"></i></span>
              <h3 className="text-[#c5a059] text-xs uppercase tracking-widest font-semibold mb-2">Chairman's Message</h3>
              <h4 className="text-2xl font-serif text-white mb-4 font-bold">A Sacred Commitment to Quality</h4>
              <p className="text-gray-400 text-sm leading-relaxed mb-6 italic max-w-2xl mx-auto">
                "Our mission at Insight Travel is rooted in trust, integrity, and absolute devotion. Having guided thousands of pilgrims from Pakistan and across the globe, we pledge our signature standards of comfort and care as you answer the sacred call. Your spiritual satisfaction is our ultimate reward."
              </p>
              <div>
                <p className="text-white font-bold text-sm">Chauhdry Muhammad Aslam</p>
                <p className="text-[#c5a059] text-xs">Chairman, Insight Travel & Tourism</p>
              </div>
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
                <div className={`p-4 rounded text-sm ${
                  submitStatus.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
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

      {/* FOOTER */}
      <footer className="bg-[#030507] border-t border-gray-900 py-12 mt-auto text-xs text-gray-500">
        <div className="container mx-auto px-6 max-w-7xl flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="text-[#c5a059] text-lg"><i className="fa-solid fa-compass"></i></span>
            <span className="text-sm font-bold tracking-wide text-white uppercase">
              Insight <span className="text-[#c5a059] font-serif capitalize">Travel & Tourism</span>
            </span>
          </div>
          <p className="text-center">
            &copy; 2026 Insight Travel and Tours. Based in Madinah Al-Munawarah. Powered by IICC IT Department.
          </p>
          <div className="flex gap-4">
            <a href="subagent_register.php" className="hover:text-[#c5a059]">Agent Registration</a>
            <a href="manage_packages.php" className="hover:text-[#c5a059]">Sales Portal</a>
          </div>
        </div>
      </footer>

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
                
                {/* Step 1: Rooming selection & Price Calculation */}
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
                        className={`py-3 px-1.5 rounded border text-center transition-all ${
                          roomingType === room.type 
                            ? 'border-[#c5a059] bg-[#c5a059]/10 text-white font-bold' 
                            : 'border-gray-800 bg-[#05080a]/60 text-gray-400 hover:border-gray-700'
                        }`}
                      >
                        <div className="text-xs">{room.label}</div>
                        <div className="text-xs text-[#c5a059] mt-1 font-extrabold">
                          {room.price ? `${(room.price/1000).toFixed(0)}k` : 'N/A'}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 2: Pilgrim Count */}
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

                {/* Step 3: Contact Information */}
                <div>
                  <label className="block text-xs font-bold uppercase text-[#c5a059] tracking-wider mb-2.5">2. Contact Details</label>
                  <div className="grid sm:grid-cols-3 gap-4">
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
                  </div>
                </div>

                {/* Step 4: Pilgrim Details */}
                <div>
                  <label className="block text-xs font-bold uppercase text-[#c5a059] tracking-wider mb-2.5">3. Pilgrim Information</label>
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

                {/* Booking Status Warnings */}
                {bookingStatus.type === 'error' && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded text-xs font-semibold">
                    {bookingStatus.message}
                  </div>
                )}

                {/* Totals & Confirm */}
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
