<?php 
require_once 'includes/config.php'; 

$alert_msg = "";
// Process the Lead Form submission
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['submit_lead'])) {
    $lead_payload = [
        "first_name" => $_POST['full_name'],
        "email_id"   => $_POST['email'],
        "description" => "Interested in: " . $_POST['interest'] . ". Message: " . $_POST['message'],
        "source"      => "Insight Travel PHP Portal"
    ];

    $result = post_to_erpnext('Lead', $lead_payload);

    if ($result['code'] == 200) {
        $alert_msg = "<div class='alert success'>Thank you! Our consultants in Madinah will contact you shortly.</div>";
    } else {
        $error_details = is_array($result['data']) ? json_encode($result['data']) : $result['data'];
        $alert_msg = "<div class='alert error'>Submission error: " . htmlspecialchars($error_details) . "</div>";
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Insight Travel & Tours | Madinah Al-Munawarah</title>
    <link rel="stylesheet" href="css/style.css?v=2">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
</head>
<body>
    <?php include 'includes/navbar.php'; ?>
   
    <section id="home" class="hero">
        <div class="hero-overlay"></div>
        <div class="hero-content">
            <h1>Sacred Journeys <br><span>Worldly Wonders</span></h1>
            <p>From the heart of Madinah to the iconic landmarks of the globe.</p>
            <div class="hero-btns">
                <a href="#packages" class="btn">View Packages</a>
                <a href="#services" class="btn btn-outline">Our Services</a>
            </div>
        </div>
    </section>

    <section id="services" class="services">
        <div class="container">
            <h2 class="section-title">Premium Travel Solutions</h2>
            <div class="service-grid">
                <div class="service-card">
                    <i class="fa-solid fa-kaaba"></i>
                    <h3>Hajj & Umrah</h3>
                    <p>Full-service pilgrimage packages with high-end transport and hotels near the Haram.</p>
                </div>
                <div class="service-card">
                    <i class="fa-solid fa-hotel"></i>
                    <h3>Accommodation</h3>
                    <p>Exclusive booking at 5-star properties in Makkah, Madinah, and global cities.</p>
                </div>
                <div class="service-card">
                    <i class="fa-solid fa-ticket"></i>
                    <h3>Ticketing</h3>
                    <p>Seamless flight arrangements with major carriers at competitive rates.</p>
                </div>
                <div class="service-card">
                    <i class="fa-solid fa-van-shuttle"></i>
                    <h3>Transportation</h3>
                    <p>Luxury VIP fleet for Ziyarat and long-distance travel across Saudi Arabia.</p>
                </div>
            </div>
        </div>
    </section>

    <section id="spiritual" class="spiritual">
        <div class="container">
            <h2 class="section-title">Spiritual Journeys</h2>
            <div class="package-grid">
                <div class="package-item">
                    <img src="https://images.unsplash.com/photo-1693590614566-1d3ea9ef32f7?auto=format&fit=crop&w=600" alt="Petra Jordan">
                    <div class="package-info">
                        <h3>The Center of the Soul</h3>
                        <p>Makkah is not just a destination on a map; it is the gravitational pull of the believer’s heart. When the eyes first fall upon the Kaaba, the noise of the world falls silent, and the soul finally hears the echo of its own beginning.</p>
                    </div>
                </div>
                <div class="package-item">
                    <img src="https://plus.unsplash.com/premium_photo-1697730274057-19338e84db8e?auto=format&fit=crop&w=600" alt="Great Wall China">
                    <div class="package-info">
                        <h3>The House of Equality</h3>
                        <p>In the shadows of the Black Stone, there are no kings and no beggars—only souls draped in white, circling the House of the One. It is here we learn that the only true rank in existence is the sincerity of our prostration..</p>
                    </div>
                </div>
                <div class="package-item">
                    <img src="https://images.unsplash.com/photo-1511652019870-fbd8713560bf?auto=format&fit=crop&w=600" alt="Colosseum Rome">
                    <div class="package-info">
                        <h3>The Infinite Return</h3>
                        <p>o perform Tawaf is to realize that life is a circle that begins and ends with God. Every step around the Kaaba is a shedding of the ego, until nothing remains but the servant and the Master in a state of perfect peace.</p>
                    </div>
                </div>
                <div class="package-item">
                    <img src="https://images.unsplash.com/photo-1602733458155-647c07d32ef6??auto=format&fit=crop&w=600" alt="Colosseum Rome">
                    <div class="package-info">
                        <h3>The City of Light</h3>
                        <p>f Makkah is the majesty of Divine Law, Madinah is the beauty of Divine Mercy. To enter the City of the Prophet is to move from the scorching heat of worldly struggle into the cool, fragrant shade of unconditional love.</p>
                    </div>
                </div>
                <div class="package-item">
                    <img src="https://images.unsplash.com/photo-1729931421786-7bbd6c7d78f6??auto=format&fit=crop&w=600" alt="Colosseum Rome">
                    <div class="package-info">
                        <h3>The Fragrance of Presence</h3>
                        <p>There is a stillness in the air of Madinah that cannot be found elsewhere. It is the scent of a thousand salutations and the weight of a Presence that reassures every broken heart: 'You are home, and you are welcome here.'</p>
                    </div>
                </div>
                <div class="package-item">
                    <img src="https://images.unsplash.com/photo-1667454496584-9838026037af?auto=format&fit=crop&w=600" alt="Colosseum Rome">
                    <div class="package-info">
                        <h3>The Garden of Paradise</h3>
                        <p>Walking through the gates of Al-Masjid an-Nabawi is like stepping out of time. Between the Rawdah and the Minbar lies a garden of Paradise, where the spirit breathes the air of the heavens while the feet still touch the earth.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section id="wonders" class="packages">
        <div class="container">
            <h2 class="section-title">International Wonders</h2>
            <div class="package-grid">
                <div class="package-item">
                    <img src="https://images.unsplash.com/photo-1615811648503-479d06197ff3?auto=format&fit=crop&w=600" alt="Petra Jordan">
                    <div class="package-info">
                        <h3>Petra, (Jordan)</h3>
                        <p>Discover the ancient "Rose City" carved into sandstone.</p>
                    </div>
                </div>
                <div class="package-item">
                    <img src="https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=600" alt="Great Wall China">
                    <div class="package-info">
                        <h3>Great Wall, (China)</h3>
                        <p>Walk the historic fortifications of the Ming Dynasty.</p>
                    </div>
                </div>
                <div class="package-item">
                    <img src="https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600" alt="Colosseum Rome">
                    <div class="package-info">
                        <h3>The Colosseum, (Rome)</h3>
                        <p>Experience the architectural marvel of ancient Italy.</p>
                    </div>
                </div>
                <div class="package-item">
                    <img src="https://images.unsplash.com/photo-1509273954142-d24fb1bb212d?auto=format&fit=crop&w=600" alt="Colosseum Rome">
                    <div class="package-info">
                        <h3>Machu Picchu Trek (Peru)</h3>
                        <p>Unveil the mysteries of the Incan Empire in the Peruvian Andes..</p>
                    </div>
                </div>
                <div class="package-item">
                    <img src="https://images.unsplash.com/photo-1647220499997-ae2a94540ed6?auto=format&fit=crop&w=600" alt="Colosseum Rome">
                    <div class="package-info">
                        <h3>Chichén Itzá, (Mexico)</h3>
                        <p>Experience the Chichén Itzá (Mexico): A large Maya pyramid city..</p>
                    </div>
                </div>
                <div class="package-item">
                    <img src="https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=600" alt="Colosseum Rome">
                    <div class="package-info">
                        <h3>The Taj Mahal, (India)</h3>
                        <p>Experience the white marble mausoleum commissioned in 1632 by Shah Jahan.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- <section id="careers" class="careers">
        <div class="container">
            <h2 class="section-title">Join Insight Travel</h2>
            <div class="form-container">
                <iframe src="https://erp.iicc.sa/submit-cv" title="ERPNext Job Form"></iframe>
            </div>
        </div>
    <!-- Dynamic Umrah Packages Section -->
    <section id="packages" class="packages-section">
        <div class="container">
            <h2 class="section-title">Featured Umrah Packages<br><span>Live Offerings from Meezab Group</span></h2>
            <div class="packages-grid" id="dynamic-packages-container">
                <div class="package-loading-card">
                    <i class="fa-solid fa-circle-notch fa-spin"></i>
                    <p>Fetching latest Umrah packages...</p>
                </div>
            </div>
        </div>
    </section>

    <!-- OUR TEAM SECTION -->
    <section id="team" class="team-section">
        <div class="container">
            <h2 class="section-title">Our Team<br><span>Leadership at Lahore Office</span></h2>
            <div class="team-grid">
                <!-- Team Member 1 -->
                <div class="team-card">
                    <div class="team-card-content">
                        <span class="team-badge-title">Team Head</span>
                        <h3>Mr. Hafiz Laique Shahid</h3>
                        <p class="team-role">CEO</p>
                        <p class="team-office"><i class="fa-solid fa-location-dot"></i> Lahore, Pakistan Office</p>
                        <div class="team-contact-info">
                            <div class="team-contact-item">
                                <i class="fa-solid fa-envelope"></i>
                                <div>
                                    <a href="mailto:hlaique@yahoo.com">hlaique@yahoo.com</a>
                                    <br>
                                    <a href="mailto:hijartulharamtravels@gmail.com">hijartulharamtravels@gmail.com</a>
                                </div>
                            </div>
                            <div class="team-contact-item">
                                <i class="fa-solid fa-phone"></i>
                                <div>
                                    <a href="tel:+923018490804">+92 301-8490804</a>
                                    <br>
                                    <a href="tel:+966552945129">+966 55-294-5129</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Team Member 2 -->
                <div class="team-card">
                    <div class="team-card-content">
                        <span class="team-badge-title">Executive Director</span>
                        <h3>Ahmad Hasan Marjan</h3>
                        <p class="team-role">Executive Director</p>
                        <p class="team-office"><i class="fa-solid fa-location-dot"></i> Lahore, Pakistan Office</p>
                        <div class="team-contact-info">
                            <div class="team-contact-item">
                                <i class="fa-solid fa-envelope"></i>
                                <div>
                                    <a href="mailto:m@itt.sa">m@itt.sa</a>
                                </div>
                            </div>
                            <div class="team-contact-item">
                                <i class="fa-solid fa-phone"></i>
                                <div>
                                    <a href="tel:+966500860633">+966 50-086-0633</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section id="contact" class="contact-section">
    <div class="container">
        <h2 class="section-title">Plan Your Journey</h2>
        <div class="contact-wrapper">
            
            <div class="contact-info">
                <h3>Get In Touch</h3>
                <p><i class="fa-solid fa-location-dot"></i> Al-Madinah Al-Munawarah, Saudi Arabia</p>
                <!-- <p><i class="fa-solid fa-envelope"></i> info@itt.sa</p>
                <p><i class="fa-solid fa-phone"></i> +966 50 086 1820</p> -->
                <!-- <div class="social-icons">
                    <a href="#"><i class="fa-brands fa-whatsapp"></i></a>
                    <a href="#"><i class="fa-brands fa-instagram"></i></a>
                    <a href="#"><i class="fa-brands fa-linkedin"></i></a>
                </div> -->
            </div>

            <?php echo $alert_msg; ?>

            <form id="itt-contact-form" class="contact-form" method="POST" action="">
                <div class="form-group">
                    <input type="text" name="full_name" placeholder="Full Name" required>
                </div>
                <div class="form-group">
                    <input type="email" name="email" placeholder="Email Address" required>
                </div>
                <div class="form-group">
                    <select name="interest" required>
                        <option value="" disabled selected>Interested in...</option>
                        <option value="Hajj">Hajj Package</option>
                        <option value="Umrah">Umrah Package</option>
                        <option value="Tourism">World Tourism (7 Wonders)</option>
                        <option value="Ticketing">Flight Ticketing</option>
                    </select>
                </div>
                <div class="form-group">
                    <textarea name="message" rows="5" placeholder="Your Message / Specific Requirements" required></textarea>
                </div>
                <button type="submit" name="submit_lead" class="btn btn-submit">Submit Inquiry</button>
            </form>
        </div>
    </div>
</section>

      <script src="js/script.js?v=2"></script>
</body>
</html>
<?php include 'includes/footer.php'; ?>