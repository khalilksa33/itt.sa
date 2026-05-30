<?php
require_once 'includes/config.php';
require_once 'includes/mock_db.php';
$approved_agents = get_mock_subagents('Approved');

// Helper function to hide Meezab / Mezaab brand name
function sanitize_meezab($text) {
    if (is_null($text)) return '';
    return str_ireplace(['meezab', 'mezaab'], 'Premium', $text);
}

// 1. Fetch Active Packages from ERPNext
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
        // Standard Premium packages
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
            'package_code' => 'PKG-PREMIUM-20D-2',
            'package_name' => 'Premium 20D - Pkg 2 (That Hotel / Manazil Marjan)',
            'makkah_hotel' => 'That Hotel',
            'makkah_nights' => 11,
            'madinah_hotel' => 'Manazil Marjan',
            'madinah_nights' => 8,
            'price_sharing' => 292675,
            'price_quad' => 296125,
            'price_triple' => 307625,
            'price_double' => 330050
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
            'package_code' => 'PKG-PREMIUM-20D-4',
            'package_name' => 'Premium 20D - Pkg 4 (Areej Al Zahbi / Majd Silver)',
            'makkah_hotel' => 'Areej Al Zahbi',
            'makkah_nights' => 11,
            'madinah_hotel' => 'Majd Silver',
            'madinah_nights' => 8,
            'price_sharing' => 326025,
            'price_quad' => 336375,
            'price_triple' => 360525,
            'price_double' => 409400
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
        ],
        [
            'package_code' => 'PKG-PREMIUM-20D-6',
            'package_name' => 'Premium 20D - Pkg 6 (Dhaif Ajyad / Arjwan Al Madina)',
            'makkah_hotel' => 'Dhaif Ajyad',
            'makkah_nights' => 11,
            'madinah_hotel' => 'Arjwan Al Madina',
            'madinah_nights' => 8,
            'price_sharing' => 342700,
            'price_quad' => 359950,
            'price_triple' => 392725,
            'price_double' => 458275
        ],
        // Active Hotel Packages (with fixed prices and duplicates consolidated)
        [
            'package_code' => 'DAT-2809',
            'package_name' => 'Dar Al Taqwa - 28 Sep to 03 Oct',
            'makkah_hotel' => '',
            'makkah_nights' => 0,
            'madinah_hotel' => 'Dar Al Taqwa',
            'madinah_nights' => 5,
            'price_sharing' => 137492,
            'price_quad' => 152810,
            'price_triple' => 160876,
            'price_double' => 128464
        ],
        [
            'package_code' => 'DT-2809',
            'package_name' => 'Dallah Taibah - 28 Sep to 03 Oct',
            'makkah_hotel' => '',
            'makkah_nights' => 0,
            'madinah_hotel' => 'Dallah Taibah',
            'madinah_nights' => 5,
            'price_sharing' => 69708,
            'price_quad' => 77404,
            'price_triple' => 66378,
            'price_double' => 76368
        ],
        [
            'package_code' => 'DT-2412',
            'package_name' => 'Dallah Taibah - 24 to 29 Dec',
            'makkah_hotel' => '',
            'makkah_nights' => 0,
            'madinah_hotel' => 'Dallah Taibah',
            'madinah_nights' => 5,
            'price_sharing' => 126392,
            'price_quad' => 140378,
            'price_triple' => 124246,
            'price_double' => 142894
        ],
        [
            'package_code' => 'SI-2809',
            'package_name' => 'Swiss International - 28 Sep to 03 Oct',
            'makkah_hotel' => '',
            'makkah_nights' => 0,
            'madinah_hotel' => 'Swiss International',
            'madinah_nights' => 5,
            'price_sharing' => 222074,
            'price_quad' => 246790,
            'price_triple' => 231916,
            'price_double' => 266696
        ],
        [
            'package_code' => 'SI-2412',
            'package_name' => 'Swiss International - 24 to 29 Dec',
            'makkah_hotel' => '',
            'makkah_nights' => 0,
            'madinah_hotel' => 'Swiss International',
            'madinah_nights' => 5,
            'price_sharing' => 356162,
            'price_quad' => 395752,
            'price_triple' => 380804,
            'price_double' => 437932
        ],
        // Historical JV packages
        [
            'package_code' => 'PKG-HH-1446-1',
            'package_name' => 'Hijrat-ul-Haram Rabi-ul-Awwal - Pkg 1',
            'makkah_hotel' => 'Dyar Matar',
            'makkah_nights' => 10,
            'madinah_hotel' => 'Warda Sultana',
            'madinah_nights' => 10,
            'price_sharing' => 192000,
            'price_quad' => 195000,
            'price_triple' => 199000,
            'price_double' => 208000,
            'description' => 'Historical JV Package - Rabi-ul-Awwal Season 1446'
        ],
        [
            'package_code' => 'PKG-HH-1446-2',
            'package_name' => 'Hijrat-ul-Haram Rabi-ul-Awwal - Pkg 2',
            'makkah_hotel' => 'Land Premium',
            'makkah_nights' => 10,
            'madinah_hotel' => 'Rose Ward',
            'madinah_nights' => 10,
            'price_sharing' => 201000,
            'price_quad' => 207000,
            'price_triple' => 214000,
            'price_double' => 231500,
            'description' => 'Historical JV Package - Rabi-ul-Awwal Season 1446'
        ],
        [
            'package_code' => 'PKG-HH-1446-3',
            'package_name' => 'Hijrat-ul-Haram Rabi-ul-Awwal - Pkg 3',
            'makkah_hotel' => 'Fawad Nasa',
            'makkah_nights' => 10,
            'madinah_hotel' => 'Ansar Plus',
            'madinah_nights' => 10,
            'price_sharing' => 214000,
            'price_quad' => 222000,
            'price_triple' => 235000,
            'price_double' => 263000,
            'description' => 'Historical JV Package - Rabi-ul-Awwal Season 1446'
        ],
        [
            'package_code' => 'PKG-HH-1446-4',
            'package_name' => 'Hijrat-ul-Haram Rabi-ul-Awwal - Pkg 4',
            'makkah_hotel' => 'Fawad Nasa',
            'makkah_nights' => 10,
            'madinah_hotel' => 'Manazil Widyar',
            'madinah_nights' => 10,
            'price_sharing' => 223000,
            'price_quad' => 233500,
            'price_triple' => 250500,
            'price_double' => 285500,
            'description' => 'Historical JV Package - Rabi-ul-Awwal Season 1446'
        ],
        [
            'package_code' => 'PKG-HH-1446-5',
            'package_name' => 'Hijrat-ul-Haram Rabi-ul-Awwal - Pkg 5',
            'makkah_hotel' => 'Fawad Nasa',
            'makkah_nights' => 10,
            'madinah_hotel' => 'Rou Tiba',
            'madinah_nights' => 10,
            'price_sharing' => 229500,
            'price_quad' => 240500,
            'price_triple' => 259500,
            'price_double' => 299500,
            'description' => 'Historical JV Package - Rabi-ul-Awwal Season 1446'
        ],
        [
            'package_code' => 'PKG-HH-1446-6',
            'package_name' => 'Hijrat-ul-Haram Rabi-ul-Awwal - Pkg 6',
            'makkah_hotel' => 'Nawarat Shams 3',
            'makkah_nights' => 10,
            'madinah_hotel' => 'Rou Tiba',
            'madinah_nights' => 10,
            'price_sharing' => 0,
            'price_quad' => 258500,
            'price_triple' => 283500,
            'price_double' => 335000,
            'description' => 'Historical JV Package - Rabi-ul-Awwal Season 1446'
        ]
    ];
}

// Separate active and historical packages
$active_packages = [];
$historical_packages = [];

foreach ($packages as $pkg) {
    $pkg_code = isset($pkg['package_code']) ? $pkg['package_code'] : $pkg['name'];
    if (strpos($pkg_code, 'PKG-HH-') === 0) {
        $historical_packages[] = $pkg;
    } else {
        $active_packages[] = $pkg;
    }
}

// 2. Fetch Active Groups (Departures) from ERPNext
$groups = [];
$api_groups = get_from_erpnext('Umrah Group', [
    'fields' => json_encode(['name', 'group_code', 'group_name', 'package', 'departure_date']),
    'filters' => json_encode([['status', '=', 'Planning']])
]);

if ($api_groups['code'] === 200 && !empty($api_groups['data']['data'])) {
    $groups = $api_groups['data']['data'];
} else {
    // Fallback groups mapping
    $groups = [];
    for ($i = 1; $i <= 6; $i++) {
        $groups[] = [
            'group_code' => "GRP-PREMIUM-20D-{$i}",
            'group_name' => "Premium 20D Caravan - Group {$i}",
            'package' => "PKG-PREMIUM-20D-{$i}",
            'departure_date' => '2026-06-12'
        ];
    }
    // Groups for active hotel packages
    $groups[] = [
        'group_code' => 'GRP-DAT-2809',
        'group_name' => 'Dar Al Taqwa Caravan Group',
        'package' => 'DAT-2809',
        'departure_date' => '2026-09-28'
    ];
    $groups[] = [
        'group_code' => 'GRP-DT-2809',
        'group_name' => 'Dallah Taibah Caravan Group A',
        'package' => 'DT-2809',
        'departure_date' => '2026-09-28'
    ];
    $groups[] = [
        'group_code' => 'GRP-DT-2412',
        'group_name' => 'Dallah Taibah Caravan Group B',
        'package' => 'DT-2412',
        'departure_date' => '2026-12-24'
    ];
    $groups[] = [
        'group_code' => 'GRP-SI-2809',
        'group_name' => 'Swiss International Caravan Group A',
        'package' => 'SI-2809',
        'departure_date' => '2026-09-28'
    ];
    $groups[] = [
        'group_code' => 'GRP-SI-2412',
        'group_name' => 'Swiss International Caravan Group B',
        'package' => 'SI-2412',
        'departure_date' => '2026-12-24'
    ];
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Insight Travel & Tours | Premium Umrah Services</title>
    <link rel="stylesheet" href="css/style.css?v=3">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <?php include 'includes/navbar.php'; ?>

    <!-- HERO SECTION -->
    <section id="home" class="hero">
        <div class="hero-content">
            <h1>Dynamic Umrah Packages <br><span>Sacred Journeys Made Simple</span></h1>
            <p>Select from our premium Premium packages departing from Islamabad. Seamless integration with our ERP booking system.</p>
            <div class="hero-btns">
                <a href="#packages" class="btn btn-primary">Book Pilgrimage</a>
                <a href="#services" class="btn btn-outline">Our Services</a>
            </div>
        </div>
    </section>

    <!-- SERVICES SECTION -->
    <section id="services" class="services">
        <div class="container">
            <h2 class="section-title">Umrah <span>Services</span></h2>
            <div class="services-grid">
                <div class="service-card">
                    <i class="fa-solid fa-kaaba"></i>
                    <h3>Complete Pilgrimage</h3>
                    <p>All packages include visa processing, flights, accommodation, and transport in the Kingdom.</p>
                </div>
                <div class="service-card">
                    <i class="fa-solid fa-hotel"></i>
                    <h3>Premium Hotels</h3>
                    <p>Stay in selected hotels close to the Holy Mosque in Makkah and Masjid an-Nabawi in Madinah.</p>
                </div>
                <div class="service-card">
                    <i class="fa-solid fa-van-shuttle"></i>
                    <h3>VIP Transportation</h3>
                    <p>Air-conditioned buses and GMCs dedicated to your comfort during transit and Ziyarats.</p>
                </div>
                <div class="service-card">
                    <i class="fa-solid fa-passport"></i>
                    <h3>Visa & Handshake</h3>
                    <p>Rapid visa endorsement and direct submission to the Umrah Ministry platform.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- PACKAGES SECTION -->
    <section id="packages" class="packages">
        <div class="container">
            <h2 class="section-title">Selected <span>Packages</span></h2>
            <div class="packages-grid">
                <?php foreach ($active_packages as $pkg): 
                    // Filter groups linked to this specific package
                    $pkg_code = isset($pkg['package_code']) ? $pkg['package_code'] : $pkg['name'];
                    $pkg_groups = array_values(array_filter($groups, function($grp) use ($pkg_code) {
                        return $grp['package'] === $pkg_code;
                    }));
                ?>
                    <div class="package-card" 
                         data-package-code="<?php echo htmlspecialchars($pkg_code); ?>"
                         data-package-name="<?php echo htmlspecialchars(sanitize_meezab($pkg['package_name'])); ?>"
                         data-groups="<?php echo htmlspecialchars(json_encode($pkg_groups)); ?>">
                        
                        <div class="package-banner">
                            <div class="package-banner-overlay"></div>
                            <div class="package-banner-content">
                                <h3><?php echo htmlspecialchars(sanitize_meezab($pkg['package_name'])); ?></h3>
                                <span class="package-duration">Active Package</span>
                            </div>
                        </div>

                        <div class="package-body">
                            <div class="hotel-info">
                                <?php if (isset($pkg['makkah_nights']) && $pkg['makkah_nights'] > 0): ?>
                                    <div class="hotel-row">
                                        <i class="fa-solid fa-hotel"></i>
                                        <div>
                                            <div class="hotel-name">Makkah: <?php echo htmlspecialchars(sanitize_meezab($pkg['makkah_hotel'] ?? '')); ?></div>
                                            <div class="hotel-nights"><?php echo htmlspecialchars($pkg['makkah_nights']); ?> Nights Accommodation</div>
                                        </div>
                                    </div>
                                <?php endif; ?>
                                <?php if (isset($pkg['madinah_nights']) && $pkg['madinah_nights'] > 0): ?>
                                    <div class="hotel-row">
                                        <i class="fa-solid fa-mosque"></i>
                                        <div>
                                            <div class="hotel-name">Madinah: <?php echo htmlspecialchars(sanitize_meezab($pkg['madinah_hotel'] ?? '')); ?></div>
                                            <div class="hotel-nights"><?php echo htmlspecialchars($pkg['madinah_nights']); ?> Nights Accommodation</div>
                                        </div>
                                    </div>
                                <?php endif; ?>
                            </div>

                            <div class="package-inclusions">
                                <div class="inclusion-item">
                                    <i class="fa-solid fa-circle-check"></i>
                                    <span>Visa</span>
                                </div>
                                <div class="inclusion-item">
                                    <i class="fa-solid fa-circle-check"></i>
                                    <span>Flights</span>
                                </div>
                                <div class="inclusion-item">
                                    <i class="fa-solid fa-circle-check"></i>
                                    <span>Bus Transport</span>
                                </div>
                            </div>

                            <!-- Price Selection and Display -->
                            <div class="price-section">
                                <div class="rate-tabs">
                                    <!-- Sharing Rate -->
                                    <input type="radio" name="sharing_<?php echo $pkg_code; ?>" id="sh_<?php echo $pkg_code; ?>" value="Sharing" class="rate-tab" data-price="<?php echo $pkg['price_sharing']; ?>" data-currency="PKR" checked>
                                    <label for="sh_<?php echo $pkg_code; ?>" class="rate-tab-label">Sharing</label>

                                    <!-- Quad Rate -->
                                    <input type="radio" name="sharing_<?php echo $pkg_code; ?>" id="qd_<?php echo $pkg_code; ?>" value="Quad" class="rate-tab" data-price="<?php echo $pkg['price_quad']; ?>" data-currency="PKR">
                                    <label for="qd_<?php echo $pkg_code; ?>" class="rate-tab-label">Quad</label>

                                    <!-- Triple Rate -->
                                    <input type="radio" name="sharing_<?php echo $pkg_code; ?>" id="tr_<?php echo $pkg_code; ?>" value="Triple" class="rate-tab" data-price="<?php echo $pkg['price_triple']; ?>" data-currency="PKR">
                                    <label for="tr_<?php echo $pkg_code; ?>" class="rate-tab-label">Triple</label>

                                    <!-- Double Rate -->
                                    <input type="radio" name="sharing_<?php echo $pkg_code; ?>" id="db_<?php echo $pkg_code; ?>" value="Double" class="rate-tab" data-price="<?php echo $pkg['price_double']; ?>" data-currency="PKR">
                                    <label for="db_<?php echo $pkg_code; ?>" class="rate-tab-label">Double</label>
                                </div>

                                <div class="price-display">
                                    <span>Rate per pilgrim</span>
                                    <div class="price-amount">
                                        <?php echo number_format($pkg['price_sharing']); ?> PKR
                                    </div>
                                </div>

                                <button class="btn btn-primary btn-book" style="width: 100%; text-align: center;">Book Package</button>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </section>


    <!-- HISTORICAL JV WORK SECTION -->
    <section id="historical-work" class="packages" style="background: rgba(10, 12, 16, 0.4); border-top: 1px solid rgba(197, 160, 89, 0.1);">
        <div class="container">
            <h2 class="section-title">Historical Work <span>with JV Partner</span></h2>
            <p style="text-align: center; color: var(--text-muted); margin-top: -2rem; margin-bottom: 3.5rem; max-width: 700px; margin-left: auto; margin-right: auto;">
                Explore our completed projects from Rabi-ul-Awwal Season 1446. Delivered in joint venture partnership with <strong>Hijrat-ul-Haram Travel & Tours (Pvt.) Ltd.</strong>
            </p>
            <div class="packages-grid">
                <?php foreach ($historical_packages as $pkg): 
                    $pkg_code = isset($pkg['package_code']) ? $pkg['package_code'] : $pkg['name'];
                ?>
                    <div class="package-card" 
                         data-package-code="<?php echo htmlspecialchars($pkg_code); ?>"
                         data-package-name="<?php echo htmlspecialchars(sanitize_meezab($pkg['package_name'])); ?>">
                        
                        <div class="package-banner">
                            <div class="historical-badge">Completed JV</div>
                            <div class="package-banner-overlay"></div>
                            <div class="package-banner-content">
                                <h3><?php echo htmlspecialchars(sanitize_meezab($pkg['package_name'])); ?></h3>
                                <span class="package-duration">20 Days Package</span>
                                <div class="partner-tag" style="margin-top: 0.3rem;">JV Partner: Hijrat-ul-Haram</div>
                            </div>
                        </div>

                        <div class="package-body">
                            <div class="hotel-info">
                                <?php if (isset($pkg['makkah_nights']) && $pkg['makkah_nights'] > 0): ?>
                                    <div class="hotel-row">
                                        <i class="fa-solid fa-hotel"></i>
                                        <div>
                                            <div class="hotel-name">Makkah: <?php echo htmlspecialchars(sanitize_meezab($pkg['makkah_hotel'] ?? '')); ?></div>
                                            <div class="hotel-nights"><?php echo htmlspecialchars($pkg['makkah_nights']); ?> Nights Accommodation</div>
                                        </div>
                                    </div>
                                <?php endif; ?>
                                <?php if (isset($pkg['madinah_nights']) && $pkg['madinah_nights'] > 0): ?>
                                    <div class="hotel-row">
                                        <i class="fa-solid fa-mosque"></i>
                                        <div>
                                            <div class="hotel-name">Madinah: <?php echo htmlspecialchars(sanitize_meezab($pkg['madinah_hotel'] ?? '')); ?></div>
                                            <div class="hotel-nights"><?php echo htmlspecialchars($pkg['madinah_nights']); ?> Nights Accommodation</div>
                                        </div>
                                    </div>
                                <?php endif; ?>
                            </div>

                            <div class="package-inclusions">
                                <div class="inclusion-item">
                                    <i class="fa-solid fa-circle-check"></i>
                                    <span>Visa</span>
                                </div>
                                <div class="inclusion-item">
                                    <i class="fa-solid fa-circle-check"></i>
                                    <span>Flights</span>
                                </div>
                                <div class="inclusion-item">
                                    <i class="fa-solid fa-circle-check"></i>
                                    <span>Bus Transport</span>
                                </div>
                            </div>

                            <!-- Price Selection and Display -->
                            <div class="price-section">
                                <div class="rate-tabs">
                                    <?php 
                                    $has_sharing = isset($pkg['price_sharing']) && $pkg['price_sharing'] > 0;
                                    $sh_checked = $has_sharing ? 'checked' : '';
                                    $qd_checked = !$has_sharing ? 'checked' : '';
                                    ?>
                                    <!-- Sharing Rate -->
                                    <?php if ($has_sharing): ?>
                                        <input type="radio" name="sharing_<?php echo $pkg_code; ?>" id="sh_<?php echo $pkg_code; ?>" value="Sharing" class="rate-tab" data-price="<?php echo $pkg['price_sharing']; ?>" data-currency="PKR" <?php echo $sh_checked; ?>>
                                        <label for="sh_<?php echo $pkg_code; ?>" class="rate-tab-label">Sharing</label>
                                    <?php endif; ?>

                                    <!-- Quad Rate -->
                                    <input type="radio" name="sharing_<?php echo $pkg_code; ?>" id="qd_<?php echo $pkg_code; ?>" value="Quad" class="rate-tab" data-price="<?php echo $pkg['price_quad']; ?>" data-currency="PKR" <?php echo $qd_checked; ?>>
                                    <label for="qd_<?php echo $pkg_code; ?>" class="rate-tab-label">Quad</label>

                                    <!-- Triple Rate -->
                                    <input type="radio" name="sharing_<?php echo $pkg_code; ?>" id="tr_<?php echo $pkg_code; ?>" value="Triple" class="rate-tab" data-price="<?php echo $pkg['price_triple']; ?>" data-currency="PKR">
                                    <label for="tr_<?php echo $pkg_code; ?>" class="rate-tab-label">Triple</label>

                                    <!-- Double Rate -->
                                    <input type="radio" name="sharing_<?php echo $pkg_code; ?>" id="db_<?php echo $pkg_code; ?>" value="Double" class="rate-tab" data-price="<?php echo $pkg['price_double']; ?>" data-currency="PKR">
                                    <label for="db_<?php echo $pkg_code; ?>" class="rate-tab-label">Double</label>
                                </div>

                                <div class="price-display">
                                    <span>Rate per pilgrim</span>
                                    <div class="price-amount">
                                        <?php echo number_format($has_sharing ? $pkg['price_sharing'] : $pkg['price_quad']); ?> PKR
                                    </div>
                                </div>

                                <button class="btn btn-outline btn-inquire" style="width: 100%; text-align: center;">Inquire About Package</button>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </section>

    <!-- CONTACT & INQUIRY SECTION -->
    <section id="contact" class="contact-section" style="border-top: 1px solid rgba(197, 160, 89, 0.1);">
        <div class="container">
            <div class="contact-grid">
                <div class="contact-info">
                    <h2 style="text-align: left; margin-bottom: 1.5rem;" class="section-title">Get In Touch <br><span>Start Your Journey</span></h2>
                    <p>Have questions about our packages or need a custom Umrah plan? Submit your inquiry, and our Umrah experts will design the perfect pilgrimage experience for you and your family.</p>
                    
                    <div class="contact-details">
                        <div class="contact-detail-item">
                            <i class="fa-solid fa-location-dot"></i>
                            <span>Office 4, Ground Floor, Insight Travel, Madinah, KSA</span>
                        </div>
                        <div class="contact-detail-item">
                            <i class="fa-solid fa-phone"></i>
                            <span>+966 55 555 5555 / +92 300 1234567</span>
                        </div>
                        <div class="contact-detail-item">
                            <i class="fa-solid fa-envelope"></i>
                            <span>info@itt.sa</span>
                        </div>
                    </div>
                </div>

                <div class="inquiry-card">
                    <h3>Inquiry Form</h3>
                    <form id="inquiry-form">
                        <div class="form-group">
                            <label for="inquiry_name">Full Name</label>
                            <input type="text" name="inquiry_name" id="inquiry_name" placeholder="Enter your full name" required>
                        </div>
                        <div class="form-group">
                            <label for="inquiry_email">Email Address</label>
                            <input type="email" name="email" id="inquiry_email" placeholder="name@example.com" required>
                        </div>
                        <div class="form-group">
                            <label for="inquiry_phone">Phone Number</label>
                            <input type="tel" name="phone" id="inquiry_phone" placeholder="+92 300 1234567" required>
                        </div>
                        <div class="form-group">
                            <label for="inquiry_pilgrims">Number of Pilgrims</label>
                            <input type="number" name="pilgrim_count" id="inquiry_pilgrims" min="1" value="1" required>
                        </div>
                        <div class="form-group">
                            <label for="inquiry-message">Special Requirements / Package Inquiry</label>
                            <textarea name="message" id="inquiry-message" rows="4" placeholder="Mention preferred travel dates, package preferences, or any questions you have..."></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 1rem;">Submit Inquiry</button>
                    </form>
                </div>
            </div>
        </div>
    </section>

    <!-- BOOKING MODAL -->
    <div class="modal" id="booking-modal">
        <div class="modal-content">
            <button class="modal-close" id="modal-close">&times;</button>
            <h3>Book Pilgrimage</h3>
            
            <div style="margin-bottom: 1.5rem; background: rgba(197, 160, 89, 0.1); padding: 1rem; border-radius: 8px; border-left: 3px solid var(--accent);">
                <div style="font-size: 0.85rem; color: var(--text-muted);">Selected Package</div>
                <div id="modal-pkg-name" style="font-weight: 700; font-size: 1.1rem; color: var(--white); margin: 2px 0;"></div>
                <div id="modal-pkg-price" style="font-weight: 800; color: var(--accent); font-size: 1.2rem;"></div>
            </div>

            <!-- Eligibility Alert Banner -->
            <div id="eligibility-alert-container" style="display: none; margin-bottom: 1.5rem; border-radius: 8px; padding: 1rem; font-size: 0.9rem; line-height: 1.5; font-weight: 500;"></div>

            <!-- Passport Scanner Upload Zone -->
            <div class="passport-scanner-zone" id="passport-scanner-zone" style="border: 2px dashed var(--border-color); border-radius: 12px; padding: 1.5rem; text-align: center; margin-bottom: 1.5rem; cursor: pointer; position: relative; overflow: hidden; background: rgba(10, 12, 16, 0.3); transition: var(--transition);">
                <div class="scanner-laser" id="scanner-laser" style="display: none; position: absolute; left: 0; right: 0; height: 3px; background: var(--accent); box-shadow: 0 0 12px var(--accent); top: 0;"></div>
                <div id="scanner-prompt">
                    <i class="fa-solid fa-passport" style="font-size: 2.2rem; color: var(--accent); margin-bottom: 8px; display: block;"></i>
                    <span style="font-weight: 600; font-size: 0.95rem; color: var(--white); display: block;">Upload Passport Image (Live Scan)</span>
                    <span style="font-size: 0.8rem; color: var(--text-muted); display: block; margin-top: 4px;">Drag & drop bio photo or click to upload. Extracts data & evaluates eligibility.</span>
                </div>
                <div id="scanner-loading" style="display: none;">
                    <i class="fa-solid fa-spinner fa-spin" style="font-size: 2rem; color: var(--accent); margin-bottom: 8px; display: block;"></i>
                    <span style="font-weight: 600; color: var(--white); display: block;">Scanning Bio Page...</span>
                    <span style="font-size: 0.8rem; color: var(--text-muted); display: block; margin-top: 4px;">Reading passport MRZ and analyzing dates.</span>
                </div>
                <input type="file" id="passport-file-input" accept="image/*" style="display: none;">
            </div>

            <form id="booking-form">
                <!-- Hidden inputs passed to processor -->
                <input type="hidden" name="package_code" id="booking-package-code">
                <input type="hidden" name="sharing_type" id="booking-sharing-type">
                <input type="hidden" name="base_price" id="booking-base-price">

                <!-- B2B Sub-Agent Fields -->
                <div class="form-group">
                    <label for="sub_agent_id">Booked via Sub-Agent (Optional)</label>
                    <select name="sub_agent_id" id="sub_agent_id">
                        <option value="">Direct Booking (No Sub-Agent)</option>
                        <?php foreach ($approved_agents as $agt): ?>
                            <option value="<?php echo htmlspecialchars($agt['name']); ?>"><?php echo htmlspecialchars($agt['agency_name']); ?> (<?php echo htmlspecialchars($agt['name']); ?>)</option>
                        <?php endforeach; ?>
                    </select>
                </div>

                <div class="form-group" id="booking-mode-container" style="display: none;">
                    <label for="booking_mode">B2B Booking Mode</label>
                    <select name="booking_mode" id="booking_mode">
                        <option value="Standard" selected>Standard Rate (Standard Commission)</option>
                        <option value="Reseller">Reseller Rate (Custom Resale Price)</option>
                    </select>
                </div>

                <div class="form-group" id="resale-price-container" style="display: none;">
                    <label for="resale_price">Custom Resale Price</label>
                    <div style="position: relative; display: flex; align-items: center;">
                        <input type="number" name="resale_price" id="resale_price" placeholder="Enter resale price to customer" min="0" style="padding-right: 3.5rem;">
                        <span class="currency-addon" style="position: absolute; right: 1rem; color: var(--text-muted); font-size: 0.9rem; font-weight: 600; pointer-events: none;">PKR</span>
                    </div>
                    <small style="color: var(--text-muted); font-size: 0.8rem; margin-top: 5px; display: block;">Base price due to company: <strong id="base-price-display" style="color: var(--accent);">0 PKR</strong>. Difference will be sub-agent markup profit.</small>
                </div>

                <div class="form-group">
                    <label for="booking-group">Departure Date (Umrah Group)</label>
                    <select name="group_code" id="booking-group" required>
                        <option value="" disabled selected>Select Available Departure Date...</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="customer_name">Full Name (as in Passport)</label>
                    <input type="text" name="customer_name" id="customer_name" placeholder="John Doe" required>
                </div>

                <div class="form-group">
                    <label for="date_of_birth">Date of Birth</label>
                    <input type="date" name="date_of_birth" id="date_of_birth" required>
                </div>

                <div class="form-group">
                    <label for="email">Email Address</label>
                    <input type="email" name="email" id="email" placeholder="john@example.com" required>
                </div>

                <div class="form-group">
                    <label for="phone">Phone Number</label>
                    <input type="tel" name="phone" id="phone" placeholder="+92 300 1234567" required>
                </div>

                <div class="form-group">
                    <label for="passport_number">Passport Number</label>
                    <input type="text" name="passport_number" id="passport_number" placeholder="AB123456" required>
                </div>

                <div class="form-group">
                    <label for="passport_expiry">Passport Expiry Date</label>
                    <input type="date" name="passport_expiry" id="passport_expiry" required>
                </div>

                <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 1rem;">Confirm Booking Draft</button>
            </form>
        </div>
    </div>

    <!-- FOOTER -->
    <footer>
        <a href="/" class="logo">INSIGHT <span>Travel</span></a>
        <p>&copy; 2026 Insight Travel and Tours. Based in Madinah Al-Munawarah. Powered by IICC IT Department. &bull; <a href="subagent_register.php" style="color: var(--text-muted); text-decoration: none;">Agent Registration</a> &bull; <a href="manage_packages.php" style="color: var(--text-muted); text-decoration: none;">Sales Portal</a></p>
    </footer>

    <script src="js/script.js?v=3"></script>
</body>
</html>
