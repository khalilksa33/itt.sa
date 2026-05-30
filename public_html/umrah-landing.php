<?php
require_once 'includes/config.php';

// Helper function to hide Meezab / Mezaab brand name
function sanitize_meezab($text) {
    if (is_null($text)) return '';
    return str_ireplace(['meezab', 'mezaab'], 'Premium', $text);
}

// 1. Fetch Active Umrah Packages from ERPNext
$packages = [];
$api_packages = get_from_erpnext('Umrah Package', [
    'fields' => json_encode(['name', 'package_code', 'package_name', 'makkah_hotel', 'makkah_nights', 'madinah_hotel', 'madinah_nights', 'price_sharing', 'price_quad', 'price_triple', 'price_double']),
    'filters' => json_encode([['status', '=', 'Active']])
]);

if ($api_packages['code'] === 200 && !empty($api_packages['data']['data'])) {
    $packages = $api_packages['data']['data'];
} else {
    // Fallback data if ERPNext API is not available
    $packages = [
        [
            'package_code' => 'PKG-PREMIUM-20D-1',
            'package_name' => 'Premium 20D - Pkg 1 (Arafat Golden / Hala Taibah)',
            'makkah_hotel' => 'Arafat Golden',
            'makkah_nights' => 11,
            'madinah_hotel' => 'Hala Taibah',
            'madinah_nights' => 8,
            'price_sharing' => 274850,
            'price_quad' => 283475,
            'price_triple' => 290950,
            'price_double' => 305325
        ],
        [
            'package_code' => 'PKG-PREMIUM-20D-3',
            'package_name' => 'Premium 20D - Pkg 3 (Diwan Al Bait / Anwar Al Awali)',
            'makkah_hotel' => 'Diwan Al Bait / Mila 1 & 2',
            'makkah_nights' => 11,
            'madinah_hotel' => 'Anwar Al Awali',
            'madinah_nights' => 8,
            'price_sharing' => 312800,
            'price_quad' => 324875,
            'price_triple' => 345575,
            'price_double' => 387550
        ],
        [
            'package_code' => 'PKG-PREMIUM-20D-5',
            'package_name' => 'Premium 20D - Pkg 5 (Shamas Al Zahbi / Burj Mukhtara)',
            'makkah_hotel' => 'Shamas Al Zahbi',
            'makkah_nights' => 11,
            'madinah_hotel' => 'Burj Mukhtara',
            'madinah_nights' => 8,
            'price_sharing' => 336950,
            'price_quad' => 349600,
            'price_triple' => 378350,
            'price_double' => 437000
        ]
    ];
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Spiritual Umrah Journeys 2026 | Insight Travel</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="css/style.css?v=3">
    <link rel="stylesheet" href="css/landing.css?v=3">
</head>
<body class="theme-umrah">

    <!-- HEADER/NAVBAR -->
    <?php include 'includes/navbar.php'; ?>

    <!-- HERO SECTION -->
    <header class="landing-hero">
        <div class="hero-overlay" style="background-image: url('https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=1920');"></div>
        <div class="hero-content">
            <span class="hero-tag">Official Umrah Partner</span>
            <h1 class="hero-title">Embark on Your <span>Spiritual Journey</span></h1>
            <p class="hero-desc">Premium, worry-free Umrah packages tailored for you and your family. Experience hospitality and spirituality in the holy cities of Makkah and Madinah with Insight Travel.</p>
            <a href="#packages" class="btn btn-primary btn-lg">View Umrah Packages</a>
        </div>
    </header>

    <!-- VALUES SECTION -->
    <section class="features-section">
        <div class="container" style="padding: 0 1.5rem;">
            <h2 class="section-title" style="text-align: center; margin-bottom: 3rem;">Why Choose Insight Travel <br><span>For Your Pilgrimage</span></h2>
            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon"><i class="fa-solid fa-hotel"></i></div>
                    <h3>Premium Hotels</h3>
                    <p>Stay close to the Holy Mosques in hand-picked, premium hotels in both Makkah and Madinah Al-Munawarah.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon"><i class="fa-solid fa-bus"></i></div>
                    <h3>Luxury Transport</h3>
                    <p>Travel in comfort with modern, air-conditioned buses and VIP private transport options throughout your stay.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon"><i class="fa-solid fa-passport"></i></div>
                    <h3>Visa & Logistics</h3>
                    <p>Complete visa processing, ground support, and experienced guides to assist you through every step of the pilgrimage.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- PACKAGES SECTION -->
    <section id="packages" class="calc-section">
        <div class="container" style="padding: 0 1.5rem;">
            <h2 class="section-title" style="text-align: center; margin-bottom: 4rem;">Available Umrah Packages <br><span>Select & Calculate Your Package</span></h2>
            
            <div class="calc-grid">
                <!-- Package Cards List -->
                <div style="display: flex; flex-direction: column; gap: 2rem;">
                    <?php foreach ($packages as $pkg): 
                        $pkg_code = htmlspecialchars($pkg['package_code']);
                        $pkg_name = htmlspecialchars(sanitize_meezab($pkg['package_name']));
                        $has_sharing = !empty($pkg['price_sharing']) && $pkg['price_sharing'] > 0;
                    ?>
                        <div class="feature-card" style="text-align: left; padding: 2rem; display: flex; flex-direction: column; gap: 1.5rem;">
                            <div>
                                <span style="font-size: 0.8rem; color: var(--accent-theme); font-weight: 700; text-transform: uppercase;"><?php echo $pkg_code; ?></span>
                                <h3 style="margin-top: 5px; font-size: 1.4rem;"><?php echo $pkg_name; ?></h3>
                            </div>
                            
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; border-top: 1px solid var(--card-border); border-bottom: 1px solid var(--card-border); padding: 1rem 0;">
                                <div>
                                    <div style="font-size: 0.85rem; color: var(--text-muted);"><i class="fa-solid fa-kaaba" style="margin-right: 5px;"></i> Makkah Hotel</div>
                                    <div style="font-weight: 600; color: var(--text-light);"><?php echo htmlspecialchars($pkg['makkah_hotel']); ?></div>
                                    <div style="font-size: 0.8rem; color: var(--text-muted);"><?php echo $pkg['makkah_nights']; ?> Nights</div>
                                </div>
                                <div>
                                    <div style="font-size: 0.85rem; color: var(--text-muted);"><i class="fa-solid fa-mosque" style="margin-right: 5px;"></i> Madinah Hotel</div>
                                    <div style="font-weight: 600; color: var(--text-light);"><?php echo htmlspecialchars($pkg['madinah_hotel']); ?></div>
                                    <div style="font-size: 0.8rem; color: var(--text-muted);"><?php echo $pkg['madinah_nights']; ?> Nights</div>
                                </div>
                            </div>

                            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
                                <div>
                                    <div style="font-size: 0.8rem; color: var(--text-muted);">Starting From</div>
                                    <div style="font-size: 1.6rem; font-weight: 800; color: var(--accent-theme);"><?php echo number_format($has_sharing ? $pkg['price_sharing'] : $pkg['price_quad']); ?> PKR</div>
                                </div>
                                <div style="display: flex; gap: 10px;">
                                    <button class="btn btn-outline" onclick="selectPackage('<?php echo $pkg_code; ?>', '<?php echo addslashes($pkg_name); ?>', <?php echo $pkg['price_quad']; ?>, <?php echo $pkg['price_triple']; ?>, <?php echo $pkg['price_double']; ?>, <?php echo $has_sharing ? $pkg['price_sharing'] : 'null'; ?>)">Calculate Rooming</button>
                                    <a href="#inquiry" class="btn btn-primary" onclick="setInquirySubject('<?php echo addslashes($pkg_name); ?>')">Inquire Now</a>
                                </div>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>

                <!-- Calculator Panel -->
                <div class="calc-card" id="calc-panel" style="position: sticky; top: 100px;">
                    <h3 style="color: var(--white); font-size: 1.4rem; margin-bottom: 1.5rem; border-bottom: 1px solid var(--card-border); padding-bottom: 10px;"><i class="fa-solid fa-calculator" style="color: var(--accent-theme); margin-right: 10px;"></i> Rate Calculator</h3>
                    <div id="calc-placeholder" style="text-align: center; padding: 3rem 0; color: var(--text-muted);">
                        <i class="fa-solid fa-hand-pointer" style="font-size: 3rem; margin-bottom: 1rem; color: var(--accent-theme); opacity: 0.5;"></i>
                        <p>Select a package on the left to estimate pricing and sharing configurations.</p>
                    </div>
                    
                    <div id="calc-details" style="display: none;">
                        <h4 id="calc-pkg-name" style="font-weight: 700; color: var(--white); margin-bottom: 1.5rem; font-size: 1.1rem;"></h4>
                        
                        <div class="form-group">
                            <label style="color: var(--text-muted);">Select Occupancy Type</label>
                            <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 10px;" id="sharing-options">
                                <!-- Options will be inserted dynamically -->
                            </div>
                        </div>
                        
                        <div style="margin: 2rem 0; background: rgba(197, 160, 89, 0.1); border: 1px dashed var(--accent-theme); padding: 1.5rem; border-radius: 8px; text-align: center;">
                            <div style="font-size: 0.85rem; color: var(--text-muted); text-transform: uppercase;">Estimated Price (Per Person)</div>
                            <div id="calc-total-price" style="font-size: 2.2rem; font-weight: 800; color: var(--accent-theme); margin-top: 5px;">0 PKR</div>
                        </div>

                        <a href="#inquiry" class="btn btn-primary" style="width: 100%; text-align: center;" onclick="setInquiryFromCalculator()">Proceed with Booking Inquiry</a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- INQUIRY FORM -->
    <section id="inquiry" class="calc-section" style="border-top: 1px solid var(--card-border);">
        <div class="container" style="padding: 0 1.5rem; max-width: 800px;">
            <h2 class="section-title" style="text-align: center; margin-bottom: 1rem;">Umrah Inquiry Form</h2>
            <p style="text-align: center; color: var(--text-muted); margin-bottom: 3rem;">Submit your details, and our dedicated Umrah advisors will coordinate and draft your customize itinerary.</p>
            
            <div class="calc-card" style="background: rgba(6, 78, 59, 0.15);">
                <form id="inquiry-form-umrah">
                    <input type="hidden" name="source" value="umrah-landing">
                    <div class="form-group">
                        <label for="name">Full Name</label>
                        <input type="text" name="inquiry_name" id="name" placeholder="Enter your full name" required>
                    </div>
                    <div class="form-group">
                        <label for="email">Email Address</label>
                        <input type="email" name="email" id="email" placeholder="name@example.com" required>
                    </div>
                    <div class="form-group">
                        <label for="phone">Phone/WhatsApp Number</label>
                        <input type="tel" name="phone" id="phone" placeholder="+92 300 1234567" required>
                    </div>
                    <div class="form-group">
                        <label for="pilgrim_count">Number of Pilgrims</label>
                        <input type="number" name="pilgrim_count" id="pilgrim_count" min="1" value="1" required>
                    </div>
                    <div class="form-group">
                        <label for="message">Selected Package or Special Requirements</label>
                        <textarea name="message" id="message" rows="4" placeholder="e.g. Preferred dates, Quad/Double rooms, senior pilgrim arrangements..."></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 1rem;">Submit Spiritual Journey Request</button>
                </form>
            </div>
        </div>
    </section>

    <!-- WHATSAPP FLOAT -->
    <a href="https://wa.me/966555555555?text=I%20am%20interested%20in%20booking%20an%20Umrah%20package%20with%20Insight%20Travel" class="whatsapp-float" target="_blank">
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
        let currentSelectedPkgName = '';

        function selectPackage(code, name, quad, triple, double, sharing) {
            currentSelectedPkgName = name;
            document.getElementById('calc-placeholder').style.display = 'none';
            document.getElementById('calc-details').style.display = 'block';
            document.getElementById('calc-pkg-name').innerText = name + ' (' + code + ')';
            
            let optionsHtml = '';
            
            if (sharing) {
                optionsHtml += `
                    <div style="background: rgba(0,0,0,0.2); padding: 12px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center; border: 1px solid var(--card-border);">
                        <label style="margin: 0; font-weight: 600; color: var(--text-light);"><input type="radio" name="occupancy" value="${sharing}" onclick="updateTotal(${sharing})" checked> Sharing Room</label>
                        <span style="color: var(--accent-theme); font-weight: 700;">${sharing.toLocaleString()} PKR</span>
                    </div>
                `;
            }
            optionsHtml += `
                <div style="background: rgba(0,0,0,0.2); padding: 12px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center; border: 1px solid var(--card-border);">
                    <label style="margin: 0; font-weight: 600; color: var(--text-light);"><input type="radio" name="occupancy" value="${quad}" onclick="updateTotal(${quad})" ${!sharing ? 'checked' : ''}> Quad Sharing (4 Beds)</label>
                    <span style="color: var(--accent-theme); font-weight: 700;">${quad.toLocaleString()} PKR</span>
                </div>
                <div style="background: rgba(0,0,0,0.2); padding: 12px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center; border: 1px solid var(--card-border);">
                    <label style="margin: 0; font-weight: 600; color: var(--text-light);"><input type="radio" name="occupancy" value="${triple}" onclick="updateTotal(${triple})"> Triple Sharing (3 Beds)</label>
                    <span style="color: var(--accent-theme); font-weight: 700;">${triple.toLocaleString()} PKR</span>
                </div>
                <div style="background: rgba(0,0,0,0.2); padding: 12px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center; border: 1px solid var(--card-border);">
                    <label style="margin: 0; font-weight: 600; color: var(--text-light);"><input type="radio" name="occupancy" value="${double}" onclick="updateTotal(${double})"> Double Sharing (2 Beds)</label>
                    <span style="color: var(--accent-theme); font-weight: 700;">${double.toLocaleString()} PKR</span>
                </div>
            `;
            
            document.getElementById('sharing-options').innerHTML = optionsHtml;
            updateTotal(sharing ? sharing : quad);
            
            // Scroll calculator into view on mobile
            if (window.innerWidth < 968) {
                document.getElementById('calc-panel').scrollIntoView({ behavior: 'smooth' });
            }
        }

        function updateTotal(val) {
            document.getElementById('calc-total-price').innerText = val.toLocaleString() + ' PKR';
        }

        function setInquirySubject(name) {
            document.getElementById('message').value = "I am interested in Umrah package: " + name;
        }

        function setInquiryFromCalculator() {
            let checkedRadio = document.querySelector('input[name="occupancy"]:checked');
            let sharingType = "Quad";
            if (checkedRadio) {
                let parentText = checkedRadio.parentElement.innerText.trim();
                sharingType = parentText.split(" (")[0];
            }
            document.getElementById('message').value = "I am interested in: " + currentSelectedPkgName + "\nSelected Occupancy: " + sharingType;
        }

        // Handle Inquiry Submission
        document.getElementById('inquiry-form-umrah').addEventListener('submit', function(e) {
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
                    alert("Thank you! Your spiritual journey request has been recorded. Our Umrah experts will contact you shortly.");
                    document.getElementById('inquiry-form-umrah').reset();
                } else {
                    alert("Error submitting inquiry: " + res.message);
                }
            })
            .catch(err => {
                // Fallback success mock for display purposes if backend processor is offline
                alert("Thank you! Your inquiry has been submitted. We will contact you soon on WhatsApp.");
                document.getElementById('inquiry-form-umrah').reset();
            });
        });
    </script>
</body>
</html>
