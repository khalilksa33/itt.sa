<?php
session_start();
require_once 'includes/config.php';
require_once 'includes/mock_db.php';

// Handle Logout
if (isset($_GET['action']) && $_GET['action'] == 'logout') {
    unset($_SESSION['sales_logged_in']);
    session_destroy();
    header('Location: manage_packages.php');
    exit;
}

// Handle Login Form Submission
$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['password'])) {
    $password = $_POST['password'];
    if ($password === SALES_PORTAL_PASSWORD) {
        $_SESSION['sales_logged_in'] = true;
        header('Location: manage_packages.php');
        exit;
    } else {
        $error = 'Invalid portal password. Please try again.';
    }
}

// Helper to hide Meezab/Mezaab
function sanitize_meezab($text) {
    if (is_null($text)) return '';
    return str_ireplace(['meezab', 'mezaab'], 'Premium', $text);
}

// Show login page if not logged in
if (!isset($_SESSION['sales_logged_in']) || $_SESSION['sales_logged_in'] !== true):
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sales Portal Login | Insight Travel</title>
    <link rel="stylesheet" href="css/style.css?v=5">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="login-wrapper">
    <div class="login-card">
        <a href="/" class="logo">INSIGHT <span>Travel</span></a>
        <h3>Sales Portal Access</h3>
        
        <?php if ($error): ?>
            <div class="error-msg">
                <i class="fa-solid fa-triangle-exclamation"></i> <?php echo $error; ?>
            </div>
        <?php endif; ?>
        
        <form method="POST" action="manage_packages.php">
            <div class="form-group" style="text-align: left; margin-bottom: 1.5rem;">
                <label for="password">Enter Portal Password</label>
                <input type="password" name="password" id="password" placeholder="••••••••••••" required autofocus>
            </div>
            <button type="submit" class="btn btn-primary" style="width: 100%;">Authenticate</button>
        </form>
    </div>
</body>
</html>
<?php
exit;
endif;

// Retrieve all packages from ERPNext
$packages = [];
$api_packages = get_from_erpnext('Umrah Package', [
    'fields' => json_encode(['name', 'package_code', 'package_name', 'makkah_hotel', 'makkah_nights', 'madinah_hotel', 'madinah_nights', 'price_sharing', 'price_quad', 'price_triple', 'price_double', 'price_single', 'status']),
    'limit_page_length' => 100
]);

if ($api_packages['code'] === 200 && !empty($api_packages['data']['data'])) {
    foreach ($api_packages['data']['data'] as $pkg) {
        $code = $pkg['package_code'] ?? $pkg['name'];
        if (strpos($code, 'PKG-HH-') !== 0) {
            $packages[] = $pkg;
        }
    }
} else {
    // Fallback static packages from index.php in case ERPNext offline
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
            'price_double' => 305325,
            'price_single' => 450000,
            'status' => 'Active'
        ],
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
            'price_double' => 128464,
            'price_single' => 210000,
            'status' => 'Active'
        ]
    ];
}

// Fetch sub-agents and bookings from local mock DB
$sub_agents = get_mock_subagents();
$bookings = get_mock_bookings();

// Calculate sales statistics
$active_agents_count = count(array_filter($sub_agents, function($a) { return $a['status'] === 'Approved'; }));
$total_b2b_bookings = count($bookings);
$total_base_billing = array_sum(array_column($bookings, 'base_price'));
$total_agent_earnings = array_sum(array_column($bookings, 'commission'));
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sales Portal Dashboard | Insight Travel</title>
    <link rel="stylesheet" href="css/style.css?v=5">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        /* Modern dashboard tabs styling */
        .tab-btn {
            background: transparent;
            border: none;
            color: var(--text-muted);
            font-size: 1.05rem;
            font-weight: 600;
            padding: 0.75rem 1.5rem;
            cursor: pointer;
            border-bottom: 2px solid transparent;
            transition: var(--transition);
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .tab-btn:hover {
            color: var(--white);
        }
        .tab-btn.active {
            color: var(--accent) !important;
            border-bottom-color: var(--accent) !important;
            text-shadow: 0 0 10px rgba(197, 160, 89, 0.2);
        }
        .dashboard-panel {
            display: none;
            animation: fadeIn 0.4s ease;
        }
        .dashboard-panel.active {
            display: block;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        /* Stats Grid styling */
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
        }
        .stat-card {
            background: var(--card-dark);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 1.5rem;
            display: flex;
            align-items: center;
            gap: 1.25rem;
            transition: var(--transition);
        }
        .stat-card:hover {
            border-color: var(--accent);
            transform: translateY(-3px);
            box-shadow: 0 8px 20px rgba(197, 160, 89, 0.05);
        }
        .stat-icon {
            font-size: 1.8rem;
            color: var(--accent);
            background: rgba(197, 160, 89, 0.08);
            width: 54px;
            height: 54px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid rgba(197, 160, 89, 0.15);
        }
        .stat-details h4 {
            font-size: 0.8rem;
            color: var(--text-muted);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .stat-details .stat-number {
            font-size: 1.6rem;
            font-weight: 700;
            color: var(--white);
            margin-top: 2px;
            font-family: 'Outfit', sans-serif;
        }

        /* Status Badge updates */
        .badge-pending {
            background: rgba(234, 179, 8, 0.1);
            color: #fef08a;
            border: 1px solid rgba(234, 179, 8, 0.3);
        }
        .badge-suspended {
            background: rgba(239, 68, 68, 0.1);
            color: #fca5a5;
            border: 1px solid rgba(239, 68, 68, 0.3);
        }
        .badge-standard {
            background: rgba(59, 130, 246, 0.1);
            color: #bfdbfe;
            border: 1px solid rgba(59, 130, 246, 0.3);
        }
        .badge-reseller {
            background: rgba(16, 185, 129, 0.1);
            color: #a7f3d0;
            border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .btn-action-green {
            border: 1px solid rgba(16, 185, 129, 0.4);
            color: #34d399;
            background: transparent;
        }
        .btn-action-green:hover {
            background: rgba(16, 185, 129, 0.1);
        }
        .btn-action-red {
            border: 1px solid rgba(239, 68, 68, 0.4);
            color: #fca5a5;
            background: transparent;
        }
        .btn-action-red:hover {
            background: rgba(239, 68, 68, 0.1);
        }
    </style>
</head>
<body>
    <nav class="navbar" id="navbar">
        <a href="/"><div class="logo">INSIGHT <span>Travel</span></div></a>
        <ul class="nav-links">
            <li><a href="/" target="_blank"><i class="fa-solid fa-globe"></i> View Website</a></li>
            <li><a href="manage_packages.php?action=logout" style="color: #fca5a5;"><i class="fa-solid fa-right-from-bracket"></i> Log Out</a></li>
        </ul>
    </nav>

    <div class="admin-container">
        <div class="admin-header">
            <div>
                <h1>Sales Portal: <span>Dashboard</span></h1>
                <p style="color: var(--text-muted); font-size: 0.95rem; margin-top: 5px;">Manage package rates, sub-agents, and sales commissions seamlessly.</p>
            </div>
            <a href="manage_packages.php?action=logout" class="btn btn-outline" style="border-color: rgba(239, 68, 68, 0.4); color: #fca5a5; padding: 0.6rem 1.5rem; font-size: 0.9rem;">
                <i class="fa-solid fa-right-from-bracket"></i> Log Out
            </a>
        </div>

        <!-- DASHBOARD NAVIGATION TABS -->
        <div class="dashboard-tabs" style="display: flex; gap: 0.5rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem; margin-bottom: 2rem; overflow-x: auto;">
            <button class="tab-btn active" data-panel="panel-rates">
                <i class="fa-solid fa-tags"></i> Package Pricing
            </button>
            <button class="tab-btn" data-panel="panel-agents">
                <i class="fa-solid fa-users"></i> Sub-Agents List
            </button>
            <button class="tab-btn" data-panel="panel-sales">
                <i class="fa-solid fa-chart-line"></i> Sales & Commissions
            </button>
        </div>

        <!-- SEARCH INPUT -->
        <div style="display: flex; justify-content: space-between; align-items: center; gap: 1.5rem; margin-bottom: 1.5rem;">
            <div class="form-group" style="margin-bottom: 0; width: 100%; max-width: 400px; position: relative;">
                <input type="text" id="search-input" placeholder="Search tables..." style="padding-left: 2.5rem; background: rgba(18, 22, 32, 0.6);">
                <i class="fa-solid fa-magnifying-glass" style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--text-muted); font-size: 0.9rem;"></i>
            </div>
        </div>

        <!-- PANEL 1: PACKAGE PRICING -->
        <div class="dashboard-panel active" id="panel-rates">
            <div class="admin-table-wrapper">
                <table class="admin-table" id="table-rates">
                    <thead>
                        <tr>
                            <th>Package Info</th>
                            <th>Sharing</th>
                            <th>Quad</th>
                            <th>Triple</th>
                            <th>Double</th>
                            <th>Single</th>
                            <th>Status</th>
                            <th style="text-align: right;">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if (empty($packages)): ?>
                            <tr>
                                <td colspan="8" style="text-align: center; color: var(--text-muted); padding: 3rem;">
                                    <i class="fa-solid fa-folder-open" style="font-size: 2.5rem; margin-bottom: 1rem; display: block; color: var(--accent);"></i>
                                    No active packages found in ERPNext.
                                </td>
                            </tr>
                        <?php else: ?>
                            <?php foreach ($packages as $pkg): 
                                $pkg_code = $pkg['package_code'] ?? $pkg['name'];
                                $is_active = $pkg['status'] === 'Active';
                            ?>
                                <tr data-pkg="<?php echo htmlspecialchars(json_encode($pkg)); ?>">
                                    <td>
                                        <div class="pkg-title"><?php echo htmlspecialchars(sanitize_meezab($pkg['package_name'])); ?></div>
                                        <div class="pkg-meta">
                                            <span class="pkg-code" style="font-family: monospace; font-weight: 600; color: var(--accent);"><?php echo htmlspecialchars($pkg_code); ?></span>
                                            <?php if ($pkg['makkah_nights'] > 0 || $pkg['madinah_nights'] > 0): ?>
                                                &bull; Hotels: 
                                                <?php 
                                                $hotels = [];
                                                if ($pkg['makkah_nights'] > 0) $hotels[] = sanitize_meezab($pkg['makkah_hotel'] ?? '') . " ({$pkg['makkah_nights']}N Makkah)";
                                                if ($pkg['madinah_nights'] > 0) $hotels[] = sanitize_meezab($pkg['madinah_hotel'] ?? '') . " ({$pkg['madinah_nights']}N Madinah)";
                                                echo htmlspecialchars(implode(' / ', $hotels));
                                                ?>
                                            <?php endif; ?>
                                        </div>
                                    </td>
                                    <td style="font-weight: 700; color: var(--white);"><?php echo number_format($pkg['price_sharing']); ?> <span style="font-size: 0.75rem; color: var(--text-muted);">PKR</span></td>
                                    <td><?php echo number_format($pkg['price_quad']); ?> <span style="font-size: 0.75rem; color: var(--text-muted);">PKR</span></td>
                                    <td><?php echo number_format($pkg['price_triple']); ?> <span style="font-size: 0.75rem; color: var(--text-muted);">PKR</span></td>
                                    <td><?php echo number_format($pkg['price_double']); ?> <span style="font-size: 0.75rem; color: var(--text-muted);">PKR</span></td>
                                    <td><?php echo number_format($pkg['price_single']); ?> <span style="font-size: 0.75rem; color: var(--text-muted);">PKR</span></td>
                                    <td>
                                        <span class="badge <?php echo $is_active ? 'badge-active' : 'badge-inactive'; ?>">
                                            <?php echo $pkg['status']; ?>
                                        </span>
                                    </td>
                                    <td style="text-align: right;">
                                        <button class="btn btn-secondary btn-sm btn-edit-price">
                                            <i class="fa-solid fa-pen-to-square"></i> Edit Rates
                                        </button>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- PANEL 2: SUB-AGENTS LIST -->
        <div class="dashboard-panel" id="panel-agents">
            <div class="admin-table-wrapper">
                <table class="admin-table" id="table-agents">
                    <thead>
                        <tr>
                            <th>Agency Details</th>
                            <th>Contact Person</th>
                            <th>Location</th>
                            <th>Experience</th>
                            <th>Status</th>
                            <th style="text-align: right;">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if (empty($sub_agents)): ?>
                            <tr>
                                <td colspan="6" style="text-align: center; color: var(--text-muted); padding: 3rem;">
                                    <i class="fa-solid fa-users-slash" style="font-size: 2.5rem; margin-bottom: 1rem; display: block; color: var(--accent);"></i>
                                    No registered sub-agents found.
                                </td>
                            </tr>
                        <?php else: ?>
                            <?php foreach ($sub_agents as $agt): 
                                $status_class = 'badge-pending';
                                if ($agt['status'] === 'Approved') $status_class = 'badge-active';
                                if ($agt['status'] === 'Suspended') $status_class = 'badge-suspended';
                            ?>
                                <tr data-agent-id="<?php echo htmlspecialchars($agt['name']); ?>">
                                    <td>
                                        <div class="pkg-title" style="font-weight: 700; color: var(--white);"><?php echo htmlspecialchars($agt['agency_name']); ?></div>
                                        <div class="pkg-meta">
                                            <span style="font-family: monospace; font-weight: 600; color: var(--accent);"><?php echo htmlspecialchars($agt['name']); ?></span>
                                            <?php if ($agt['license_no']): ?>
                                                &bull; License: <strong><?php echo htmlspecialchars($agt['license_no']); ?></strong>
                                            <?php endif; ?>
                                        </div>
                                        <?php if ($agt['bio']): ?>
                                            <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 5px; font-style: italic; max-width: 450px;">
                                                "<?php echo htmlspecialchars($agt['bio']); ?>"
                                            </div>
                                        <?php endif; ?>
                                    </td>
                                    <td>
                                        <div style="font-weight: 500; color: var(--text-light);"><?php echo htmlspecialchars($agt['contact_name']); ?></div>
                                        <div style="font-size: 0.85rem; color: var(--text-muted);">
                                            <i class="fa-solid fa-envelope" style="margin-right: 4px;"></i> <?php echo htmlspecialchars($agt['email']); ?><br>
                                            <i class="fa-solid fa-phone" style="margin-right: 4px;"></i> <?php echo htmlspecialchars($agt['phone']); ?>
                                        </div>
                                    </td>
                                    <td><?php echo htmlspecialchars($agt['address']); ?></td>
                                    <td><?php echo htmlspecialchars($agt['experience']); ?> Years</td>
                                    <td>
                                        <span class="badge <?php echo $status_class; ?>">
                                            <?php echo htmlspecialchars($agt['status']); ?>
                                        </span>
                                    </td>
                                    <td style="text-align: right;">
                                        <div style="display: flex; gap: 8px; justify-content: flex-end;">
                                            <?php if ($agt['status'] !== 'Approved'): ?>
                                                <button class="btn btn-sm btn-action-green btn-update-status" data-status="Approved">
                                                    <i class="fa-solid fa-circle-check"></i> Approve
                                                </button>
                                            <?php endif; ?>
                                            <?php if ($agt['status'] !== 'Suspended'): ?>
                                                <button class="btn btn-sm btn-action-red btn-update-status" data-status="Suspended">
                                                    <i class="fa-solid fa-user-slash"></i> Suspend
                                                </button>
                                            <?php endif; ?>
                                        </div>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- PANEL 3: B2B SALES & LEDGER -->
        <div class="dashboard-panel" id="panel-sales">
            <!-- STATS CARDS -->
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon"><i class="fa-solid fa-user-shield"></i></div>
                    <div class="stat-details">
                        <h4>Active Partners</h4>
                        <div class="stat-number"><?php echo $active_agents_count; ?></div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon"><i class="fa-solid fa-kaaba"></i></div>
                    <div class="stat-details">
                        <h4>B2B Bookings</h4>
                        <div class="stat-number"><?php echo $total_b2b_bookings; ?></div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon"><i class="fa-solid fa-building-columns"></i></div>
                    <div class="stat-details">
                        <h4>Company Billings</h4>
                        <div class="stat-number"><?php echo number_format($total_base_billing); ?> <span style="font-size: 0.75rem; font-weight: normal; color: var(--text-muted);">PKR</span></div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon"><i class="fa-solid fa-hand-holding-dollar"></i></div>
                    <div class="stat-details">
                        <h4>Partner Margin</h4>
                        <div class="stat-number" style="color: #34d399;"><?php echo number_format($total_agent_earnings); ?> <span style="font-size: 0.75rem; font-weight: normal; color: var(--text-muted);">PKR</span></div>
                    </div>
                </div>
            </div>

            <div class="admin-table-wrapper">
                <table class="admin-table" id="table-sales">
                    <thead>
                        <tr>
                            <th>Booking Ref</th>
                            <th>Customer & Passport</th>
                            <th>Sub-Agent</th>
                            <th>Package</th>
                            <th>Pricing Mode</th>
                            <th>Base Cost</th>
                            <th>Resale Rate</th>
                            <th>Markup / Comm.</th>
                            <th>Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if (empty($bookings)): ?>
                            <tr>
                                <td colspan="10" style="text-align: center; color: var(--text-muted); padding: 3rem;">
                                    <i class="fa-solid fa-receipt" style="font-size: 2.5rem; margin-bottom: 1rem; display: block; color: var(--accent);"></i>
                                    No B2B sales bookings recorded yet.
                                </td>
                            </tr>
                        <?php else: ?>
                            <?php foreach ($bookings as $bkg): 
                                $is_reseller = ($bkg['booking_mode'] === 'Reseller');
                                $mode_class = $is_reseller ? 'badge-reseller' : 'badge-standard';
                                
                                // Retrieve sub-agent name
                                $agent_name = "Direct (N/A)";
                                foreach ($sub_agents as $agt) {
                                    if ($agt['name'] === $bkg['sub_agent_id']) {
                                        $agent_name = $agt['agency_name'];
                                        break;
                                    }
                                }
                            ?>
                                <tr>
                                    <td style="font-family: monospace; font-weight: 700; color: var(--white);"><?php echo htmlspecialchars($bkg['name']); ?></td>
                                    <td>
                                        <div style="font-weight: 600; color: var(--white);"><?php echo htmlspecialchars($bkg['customer_name']); ?></div>
                                        <div style="font-size: 0.8rem; color: var(--text-muted); font-family: monospace;">Passport: <?php echo htmlspecialchars($bkg['passport_number']); ?></div>
                                    </td>
                                    <td>
                                        <div style="font-weight: 500; color: var(--text-light);"><?php echo htmlspecialchars($agent_name); ?></div>
                                        <div style="font-size: 0.8rem; color: var(--accent); font-family: monospace;"><?php echo htmlspecialchars($bkg['sub_agent_id']); ?></div>
                                    </td>
                                    <td>
                                        <div style="font-weight: 500; color: var(--text-light);"><?php echo htmlspecialchars(sanitize_meezab($bkg['package_name'])); ?></div>
                                        <div style="font-size: 0.8rem; color: var(--text-muted);"><?php echo htmlspecialchars($bkg['sharing_type']); ?> sharing</div>
                                    </td>
                                    <td>
                                        <span class="badge <?php echo $mode_class; ?>">
                                            <?php echo htmlspecialchars($bkg['booking_mode']); ?>
                                        </span>
                                    </td>
                                    <td><?php echo number_format($bkg['base_price']); ?> <span style="font-size: 0.75rem; color: var(--text-muted);">PKR</span></td>
                                    <td><?php echo number_format($bkg['resale_price']); ?> <span style="font-size: 0.75rem; color: var(--text-muted);">PKR</span></td>
                                    <td style="font-weight: 700; color: <?php echo $is_reseller ? '#34d399' : 'var(--accent)'; ?>;">
                                        +<?php echo number_format($bkg['commission']); ?> <span style="font-size: 0.75rem; font-weight: normal; color: var(--text-muted);">PKR</span>
                                    </td>
                                    <td style="font-size: 0.85rem; color: var(--text-muted);"><?php echo htmlspecialchars($bkg['booking_date']); ?></td>
                                    <td>
                                        <span class="badge badge-active" style="background: rgba(52, 211, 153, 0.1); color: #34d399; border: 1px solid rgba(52, 211, 153, 0.3);">
                                            <?php echo htmlspecialchars($bkg['status']); ?>
                                        </span>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- PRICE EDIT MODAL (From original package rates logic) -->
    <div class="modal" id="price-modal">
        <div class="modal-content" style="max-width: 480px;">
            <button class="modal-close" id="price-modal-close">&times;</button>
            <h3>Update Package Rates</h3>
            
            <div style="margin-bottom: 1.5rem; background: rgba(197, 160, 89, 0.08); padding: 1rem; border-radius: 8px; border-left: 3px solid var(--accent);">
                <div style="font-size: 0.8rem; color: var(--text-muted);">Modifying Package</div>
                <div id="modal-pkg-code" style="font-family: monospace; font-weight: 700; color: var(--accent); font-size: 0.95rem;"></div>
                <div id="modal-pkg-title" style="font-weight: 600; color: var(--white); margin-top: 3px; font-size: 1.05rem;"></div>
            </div>

            <form id="price-edit-form">
                <input type="hidden" name="package_code" id="form-pkg-code">
                
                <div class="price-edit-grid">
                    <div class="form-group">
                        <label for="price_sharing">Sharing Rate</label>
                        <div class="price-field-container" style="position: relative; display: flex; align-items: center;">
                            <input type="number" name="price_sharing" id="price_sharing" min="0" required style="padding-right: 3.5rem;">
                            <span class="currency-addon" style="position: absolute; right: 1rem; color: var(--text-muted); font-size: 0.9rem; font-weight: 600; pointer-events: none;">PKR</span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="price_quad">Quad Sharing Rate</label>
                        <div class="price-field-container" style="position: relative; display: flex; align-items: center;">
                            <input type="number" name="price_quad" id="price_quad" min="0" required style="padding-right: 3.5rem;">
                            <span class="currency-addon" style="position: absolute; right: 1rem; color: var(--text-muted); font-size: 0.9rem; font-weight: 600; pointer-events: none;">PKR</span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="price_triple">Triple Sharing Rate</label>
                        <div class="price-field-container" style="position: relative; display: flex; align-items: center;">
                            <input type="number" name="price_triple" id="price_triple" min="0" required style="padding-right: 3.5rem;">
                            <span class="currency-addon" style="position: absolute; right: 1rem; color: var(--text-muted); font-size: 0.9rem; font-weight: 600; pointer-events: none;">PKR</span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="price_double">Double Sharing Rate</label>
                        <div class="price-field-container" style="position: relative; display: flex; align-items: center;">
                            <input type="number" name="price_double" id="price_double" min="0" required style="padding-right: 3.5rem;">
                            <span class="currency-addon" style="position: absolute; right: 1rem; color: var(--text-muted); font-size: 0.9rem; font-weight: 600; pointer-events: none;">PKR</span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="price_single">Single Sharing Rate</label>
                        <div class="price-field-container" style="position: relative; display: flex; align-items: center;">
                            <input type="number" name="price_single" id="price_single" min="0" required style="padding-right: 3.5rem;">
                            <span class="currency-addon" style="position: absolute; right: 1rem; color: var(--text-muted); font-size: 0.9rem; font-weight: 600; pointer-events: none;">PKR</span>
                        </div>
                    </div>
                </div>

                <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 0.5rem;">Save Real-time Sync</button>
            </form>
        </div>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            // Tab Switcher Logic
            const tabButtons = document.querySelectorAll('.tab-btn');
            const panels = document.querySelectorAll('.dashboard-panel');
            let activeTab = 'panel-rates';

            tabButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    const targetPanel = btn.getAttribute('data-panel');
                    activeTab = targetPanel;
                    
                    tabButtons.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    
                    panels.forEach(p => {
                        if (p.id === targetPanel) {
                            p.classList.add('active');
                        } else {
                            p.classList.remove('active');
                        }
                    });

                    // Clear search input on tab change
                    const searchInput = document.getElementById('search-input');
                    if (searchInput) searchInput.value = '';
                    filterActiveTable('');
                });
            });

            // Unified Search Filtering
            const searchInput = document.getElementById('search-input');
            if (searchInput) {
                searchInput.addEventListener('input', (e) => {
                    const term = e.target.value.toLowerCase();
                    filterActiveTable(term);
                });
            }

            function filterActiveTable(term) {
                if (activeTab === 'panel-rates') {
                    document.querySelectorAll('#table-rates tbody tr').forEach(row => {
                        if (row.cells.length < 8) return;
                        const title = row.querySelector('.pkg-title').textContent.toLowerCase();
                        const code = row.querySelector('.pkg-code').textContent.toLowerCase();
                        row.style.display = (title.includes(term) || code.includes(term)) ? '' : 'none';
                    });
                } else if (activeTab === 'panel-agents') {
                    document.querySelectorAll('#table-agents tbody tr').forEach(row => {
                        if (row.cells.length < 6) return;
                        const title = row.querySelector('.pkg-title').textContent.toLowerCase();
                        const contact = row.cells[1].textContent.toLowerCase();
                        row.style.display = (title.includes(term) || contact.includes(term)) ? '' : 'none';
                    });
                } else if (activeTab === 'panel-sales') {
                    document.querySelectorAll('#table-sales tbody tr').forEach(row => {
                        if (row.cells.length < 10) return;
                        const ref = row.cells[0].textContent.toLowerCase();
                        const customer = row.cells[1].textContent.toLowerCase();
                        const agent = row.cells[2].textContent.toLowerCase();
                        row.style.display = (ref.includes(term) || customer.includes(term) || agent.includes(term)) ? '' : 'none';
                    });
                }
            }

            // Sub-Agent Status Approval/Suspension (AJAX)
            document.querySelectorAll('.btn-update-status').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const row = e.target.closest('tr');
                    const agentId = row.getAttribute('data-agent-id');
                    const status = e.target.getAttribute('data-status');
                    
                    const originalHtml = e.target.innerHTML;
                    e.target.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
                    e.target.disabled = true;

                    const formData = new FormData();
                    formData.append('agent_id', agentId);
                    formData.append('status', status);

                    try {
                        const response = await fetch('update_subagent_status.php', {
                            method: 'POST',
                            body: formData
                        });
                        const result = await response.json();
                        
                        if (response.ok && result.success) {
                            location.reload();
                        } else {
                            alert('Error updating agent status: ' + (result.message || 'Server error.'));
                        }
                    } catch (err) {
                        console.error(err);
                        alert('Connection error: Failed to update agent status.');
                    } finally {
                        e.target.innerHTML = originalHtml;
                        e.target.disabled = false;
                    }
                });
            });

            // Price Edit Modal Controls (Original Logic preserved)
            const modal = document.getElementById('price-modal');
            const modalClose = document.getElementById('price-modal-close');
            const editForm = document.getElementById('price-edit-form');

            document.querySelectorAll('.btn-edit-price').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const row = e.target.closest('tr');
                    const pkgData = JSON.parse(row.getAttribute('data-pkg'));

                    // Populate form fields
                    document.getElementById('form-pkg-code').value = pkgData.package_code || pkgData.name;
                    document.getElementById('modal-pkg-code').innerText = pkgData.package_code || pkgData.name;
                    document.getElementById('modal-pkg-title').innerText = pkgData.package_name;
                    
                    document.getElementById('price_sharing').value = Math.round(pkgData.price_sharing);
                    document.getElementById('price_quad').value = Math.round(pkgData.price_quad);
                    document.getElementById('price_triple').value = Math.round(pkgData.price_triple);
                    document.getElementById('price_double').value = Math.round(pkgData.price_double);
                    document.getElementById('price_single').value = Math.round(pkgData.price_single || 0);

                    // Show modal
                    modal.classList.add('active');
                });
            });

            if (modalClose) {
                modalClose.addEventListener('click', () => {
                    modal.classList.remove('active');
                    editForm.reset();
                });
            }

            window.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                    editForm.reset();
                }
            });

            // Form Submit (AJAX)
            if (editForm) {
                editForm.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    
                    const btnSubmit = editForm.querySelector('button[type="submit"]');
                    const originalBtnText = btnSubmit.innerHTML;
                    btnSubmit.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Syncing to ERPNext...';
                    btnSubmit.disabled = true;

                    const formData = new FormData(editForm);
                    
                    try {
                        const response = await fetch('update_package_price.php', {
                            method: 'POST',
                            body: formData
                        });
                        
                        const result = await response.json();
                        
                        if (response.ok && result.success) {
                            // Show success box inside modal
                            const modalContent = modal.querySelector('.modal-content');
                            modalContent.innerHTML = `
                                <div class="inquiry-success-box" style="text-align: center; padding: 2rem 0;">
                                    <i class="fa-solid fa-circle-check" style="font-size: 4rem; color: #4ade80; margin-bottom: 1.5rem; display: block;"></i>
                                    <h3>Rates Synced!</h3>
                                    <p>Rates for package <strong>${result.package_code}</strong> have been successfully updated in ERPNext.</p>
                                    <button class="btn btn-primary" style="margin-top: 1.5rem;" onclick="location.reload()">Done</button>
                                </div>
                            `;
                        } else {
                            alert('Error: ' + (result.message || 'Failed to update rates.'));
                        }
                    } catch (err) {
                        console.error(err);
                        alert('Connection error: Failed to reach the server. Please try again.');
                    } finally {
                        btnSubmit.innerHTML = originalBtnText;
                        btnSubmit.disabled = false;
                    }
                });
            }
        });
    </script>
</body>
</html>
