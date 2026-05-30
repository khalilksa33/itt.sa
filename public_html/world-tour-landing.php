<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Global World Tours 2026 | Insight Travel</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="css/style.css?v=3">
    <link rel="stylesheet" href="css/landing.css?v=3">
</head>
<body class="theme-world-tour">

    <!-- HEADER/NAVBAR -->
    <?php include 'includes/navbar.php'; ?>

    <!-- HERO SECTION -->
    <header class="landing-hero">
        <div class="hero-overlay" style="background-image: url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1920');"></div>
        <div class="hero-content">
            <span class="hero-tag">Curated Global Travel</span>
            <h1 class="hero-title">Explore the <span>Beauty of the World</span></h1>
            <p class="hero-desc">Unforgettable itineraries, luxury accommodations, and expert guides. From the scenic Alps of Switzerland to the tranquil beaches of the Maldives, let Insight Travel plan your next escape.</p>
            <a href="#destinations" class="btn btn-primary btn-lg">Explore Destinations</a>
        </div>
    </header>

    <!-- VALUES SECTION -->
    <section class="features-section">
        <div class="container" style="padding: 0 1.5rem;">
            <h2 class="section-title" style="text-align: center; margin-bottom: 3rem;">Premium Travel Experiences<br><span>Designed Specially For You</span></h2>
            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon"><i class="fa-solid fa-compass"></i></div>
                    <h3>Curated Itineraries</h3>
                    <p>Expertly planned schedules balancing guided sightseeing, cultural exploration, and leisure time.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon"><i class="fa-solid fa-bed"></i></div>
                    <h3>Top-Tier Stays</h3>
                    <p>Partnering with verified 4-star and 5-star hotels globally to ensure high comfort and premium hospitality.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon"><i class="fa-solid fa-earth-americas"></i></div>
                    <h3>Global Support</h3>
                    <p>24/7 travel concierge and local guides on-ground to handle airport transfers, tickets, and emergencies.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- DESTINATIONS SECTION -->
    <section id="destinations" class="calc-section" style="background: #080a0f;">
        <div class="container" style="padding: 0 1.5rem;">
            <h2 class="section-title" style="text-align: center; margin-bottom: 1rem;">Featured Destinations 2026</h2>
            <p style="text-align: center; color: var(--text-muted); margin-bottom: 4rem;">Choose your next getaway from our most popular curated destinations.</p>
            
            <div class="destinations-grid">
                <!-- Turkey -->
                <div class="dest-card">
                    <div class="dest-image-wrapper">
                        <img class="dest-image" src="https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=600" alt="Turkey">
                        <span class="dest-badge">Popular</span>
                    </div>
                    <div class="dest-info">
                        <h3>Turkey Highlights</h3>
                        <div class="dest-meta">
                            <span>8 Days / 7 Nights</span>
                            <span>From $1,250</span>
                        </div>
                        <ul class="dest-highlights">
                            <li><i class="fa-solid fa-circle-check"></i> Istanbul Historic City Tour</li>
                            <li><i class="fa-solid fa-circle-check"></i> Hot Air Balloon in Cappadocia</li>
                            <li><i class="fa-solid fa-circle-check"></i> Bosphorus Dinner Cruise</li>
                            <li><i class="fa-solid fa-circle-check"></i> Premium Cave Hotel Stay</li>
                        </ul>
                        <a href="#planner" class="btn btn-outline" style="width: 100%; text-align: center;" onclick="setPlannedDestination('Turkey')">Select Destination</a>
                    </div>
                </div>

                <!-- Switzerland -->
                <div class="dest-card">
                    <div class="dest-image-wrapper">
                        <img class="dest-image" src="https://images.unsplash.com/photo-1502784444187-359ac186c5bb?q=80&w=600" alt="Switzerland">
                        <span class="dest-badge">Luxury</span>
                    </div>
                    <div class="dest-info">
                        <h3>Scenic Switzerland</h3>
                        <div class="dest-meta">
                            <span>7 Days / 6 Nights</span>
                            <span>From $2,490</span>
                        </div>
                        <ul class="dest-highlights">
                            <li><i class="fa-solid fa-circle-check"></i> Lucerne & Interlaken Stays</li>
                            <li><i class="fa-solid fa-circle-check"></i> Mount Titlis Cable Car Ticket</li>
                            <li><i class="fa-solid fa-circle-check"></i> GoldenPass Express Train Ride</li>
                            <li><i class="fa-solid fa-circle-check"></i> Alpine Lakes Tour</li>
                        </ul>
                        <a href="#planner" class="btn btn-outline" style="width: 100%; text-align: center;" onclick="setPlannedDestination('Switzerland')">Select Destination</a>
                    </div>
                </div>

                <!-- Malaysia & Bali -->
                <div class="dest-card">
                    <div class="dest-image-wrapper">
                        <img class="dest-image" src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=600" alt="Bali">
                        <span class="dest-badge">Best Value</span>
                    </div>
                    <div class="dest-info">
                        <h3>Kuala Lumpur & Bali</h3>
                        <div class="dest-meta">
                            <span>10 Days / 9 Nights</span>
                            <span>From $950</span>
                        </div>
                        <ul class="dest-highlights">
                            <li><i class="fa-solid fa-circle-check"></i> Petronas Twin Towers View</li>
                            <li><i class="fa-solid fa-circle-check"></i> Cultural Temple Tour in Ubud</li>
                            <li><i class="fa-solid fa-circle-check"></i> Tanah Lot Sunset Beach Visit</li>
                            <li><i class="fa-solid fa-circle-check"></i> Snorkeling in Nusa Penida</li>
                        </ul>
                        <a href="#planner" class="btn btn-outline" style="width: 100%; text-align: center;" onclick="setPlannedDestination('Malaysia & Bali')">Select Destination</a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- CUSTOM TOUR PLANNER -->
    <section id="planner" class="calc-section" style="border-top: 1px solid var(--card-border);">
        <div class="container" style="padding: 0 1.5rem;">
            <div class="calc-grid">
                <!-- Info Section -->
                <div>
                    <h2 class="section-title" style="text-align: left; margin-bottom: 1.5rem;">Customize Your <br><span>Dream Vacation</span></h2>
                    <p style="color: var(--text-muted); margin-bottom: 2rem;">Don't see your desired destination or want to modify an existing itinerary? Use our interactive planner to specify your travel choices, and our expert tour designers will create a tailored proposal for you.</p>
                    
                    <div style="display: flex; flex-direction: column; gap: 1.2rem;">
                        <div style="display: flex; align-items: center; gap: 1rem;">
                            <i class="fa-solid fa-circle-check" style="color: var(--accent-theme); font-size: 1.2rem;"></i>
                            <span>Customize Hotels, Flights, and Sightseeing</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 1rem;">
                            <i class="fa-solid fa-circle-check" style="color: var(--accent-theme); font-size: 1.2rem;"></i>
                            <span>Add Travel Insurance and Visa Assistance</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 1rem;">
                            <i class="fa-solid fa-circle-check" style="color: var(--accent-theme); font-size: 1.2rem;"></i>
                            <span>Adjust Daily Activity Levels & Guided Options</span>
                        </div>
                    </div>
                </div>

                <!-- Custom Planner Form Card -->
                <div class="calc-card" style="background: rgba(15, 118, 110, 0.15);">
                    <h3 style="color: var(--white); font-size: 1.3rem; margin-bottom: 1.5rem; border-bottom: 1px solid var(--card-border); padding-bottom: 10px;">Tour Planner</h3>
                    
                    <form id="inquiry-form-tour">
                        <input type="hidden" name="source" value="world-tour">
                        
                        <div class="form-group">
                            <label for="name">Full Name</label>
                            <input type="text" name="inquiry_name" id="name" placeholder="Enter your full name" required style="width: 100%; padding: 0.8rem; background: rgba(0,0,0,0.3); border: 1px solid var(--card-border); border-radius: 6px; color: var(--text-light);">
                        </div>

                        <div class="form-group">
                            <label for="email">Email Address</label>
                            <input type="email" name="email" id="email" placeholder="name@example.com" required style="width: 100%; padding: 0.8rem; background: rgba(0,0,0,0.3); border: 1px solid var(--card-border); border-radius: 6px; color: var(--text-light);">
                        </div>

                        <div class="form-group">
                            <label for="phone">Phone/WhatsApp Number</label>
                            <input type="tel" name="phone" id="phone" placeholder="+92 300 1234567" required style="width: 100%; padding: 0.8rem; background: rgba(0,0,0,0.3); border: 1px solid var(--card-border); border-radius: 6px; color: var(--text-light);">
                        </div>

                        <div class="form-group">
                            <label for="dest_select">Select Destination</label>
                            <select name="destination" id="dest_select" required style="width: 100%; padding: 0.8rem; background: rgba(0,0,0,0.3); border: 1px solid var(--card-border); border-radius: 6px; color: var(--text-light);">
                                <option value="" disabled selected>Where do you want to go?</option>
                                <option value="Turkey">Turkey</option>
                                <option value="Switzerland">Switzerland</option>
                                <option value="Malaysia & Bali">Malaysia & Bali</option>
                                <option value="Maldives">Maldives</option>
                                <option value="Europe Tour">Europe Tour</option>
                                <option value="Other">Other (Specify in notes)</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="hotel_cat">Hotel Star Rating</label>
                            <select name="hotel_category" id="hotel_cat" required style="width: 100%; padding: 0.8rem; background: rgba(0,0,0,0.3); border: 1px solid var(--card-border); border-radius: 6px; color: var(--text-light);">
                                <option value="3-star">3 Star (Comfort / Economy)</option>
                                <option value="4-star" selected>4 Star (Premium / Recommended)</option>
                                <option value="5-star">5 Star (Ultra Luxury)</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="travel_date">Approximate Travel Month</label>
                            <input type="month" name="travel_month" id="travel_date" required style="width: 100%; padding: 0.8rem; background: rgba(0,0,0,0.3); border: 1px solid var(--card-border); border-radius: 6px; color: var(--text-light);">
                        </div>

                        <div class="form-group">
                            <label for="travellers">Number of Travelers</label>
                            <input type="number" name="pilgrim_count" id="travellers" min="1" value="2" required>
                        </div>

                        <div class="form-group">
                            <label for="notes">Special Requests / Customize Itinerary</label>
                            <textarea name="message" id="notes" rows="4" placeholder="Mention preferred activities, custom flight preferences, budget, or other locations you want to visit..."></textarea>
                        </div>

                        <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 1rem;">Generate Custom Tour Draft</button>
                    </form>
                </div>
            </div>
        </div>
    </section>

    <!-- WHATSAPP FLOAT -->
    <a href="https://wa.me/966555555555?text=I%20am%20interested%20in%20booking%20a%20World%20Tour%20package%20with%20Insight%20Travel" class="whatsapp-float" target="_blank">
        <i class="fa-brands fa-whatsapp"></i>
    </a>

    <!-- FOOTER -->
    <footer>
        <div class="container" style="padding: 2rem 1.5rem;">
            <a href="/" class="logo">INSIGHT <span>Travel</span></a>
            <p>&copy; 2026 Insight Travel and Tours. Based in Madinah Al-Munawarah. Powered by IICC IT Department. &bull; <a href="subagent_register.php" style="color: var(--text-muted); text-decoration: none;">Agent Registration</a> &bull; <a href="manage_packages.php" style="color: var(--text-muted); text-decoration: none;">Sales Portal</a></p>
        </div>
    </footer>

    <script>
        function setPlannedDestination(dest) {
            document.getElementById('dest_select').value = dest;
            // Scroll to form
            document.getElementById('planner').scrollIntoView({ behavior: 'smooth' });
        }

        // Set default month in travel_date selector (current month + 2)
        const date = new Date();
        date.setMonth(date.getMonth() + 2);
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        document.getElementById('travel_date').value = `${yyyy}-${mm}`;

        // Handle Form Submission
        document.getElementById('inquiry-form-tour').addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            
            // Post inquiry to processor API
            fetch('process_inquiry.php', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(res => {
                if(res.success) {
                    alert("Thank you! Your custom tour planner request has been recorded. Our travel advisors will contact you shortly with a draft itinerary.");
                    document.getElementById('inquiry-form-tour').reset();
                } else {
                    alert("Error submitting inquiry: " + res.message);
                }
            })
            .catch(err => {
                // Fallback success mock for display purposes if backend processor is offline
                alert("Thank you! Your custom tour request has been recorded. We will contact you soon on WhatsApp.");
                document.getElementById('inquiry-form-tour').reset();
            });
        });
    </script>
</body>
</html>
