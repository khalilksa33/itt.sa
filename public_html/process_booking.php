<?php
header('Content-Type: application/json');
require_once 'includes/config.php';
require_once 'includes/mock_db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
    exit;
}

// Retrieve and sanitize inputs
$package_code = filter_input(INPUT_POST, 'package_code', FILTER_SANITIZE_SPECIAL_CHARS);
$sharing_type = filter_input(INPUT_POST, 'sharing_type', FILTER_SANITIZE_SPECIAL_CHARS);
$group_code = filter_input(INPUT_POST, 'group_code', FILTER_SANITIZE_SPECIAL_CHARS);
$customer_name = filter_input(INPUT_POST, 'customer_name', FILTER_SANITIZE_SPECIAL_CHARS);
$email = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);
$phone = filter_input(INPUT_POST, 'phone', FILTER_SANITIZE_SPECIAL_CHARS);
$passport_number = filter_input(INPUT_POST, 'passport_number', FILTER_SANITIZE_SPECIAL_CHARS);

// B2B sub-agent inputs
$sub_agent_id = filter_input(INPUT_POST, 'sub_agent_id', FILTER_SANITIZE_SPECIAL_CHARS);
$booking_mode = filter_input(INPUT_POST, 'booking_mode', FILTER_SANITIZE_SPECIAL_CHARS) ?: 'Standard';
$resale_price = filter_input(INPUT_POST, 'resale_price', FILTER_VALIDATE_INT);
$base_price = filter_input(INPUT_POST, 'base_price', FILTER_VALIDATE_INT);

// Dynamic scanner inputs
$date_of_birth = filter_input(INPUT_POST, 'date_of_birth', FILTER_SANITIZE_SPECIAL_CHARS);
$passport_expiry = filter_input(INPUT_POST, 'passport_expiry', FILTER_SANITIZE_SPECIAL_CHARS);

if (!$package_code || !$sharing_type || !$group_code || !$customer_name || !$email || !$phone || !$passport_number || !$date_of_birth || !$passport_expiry) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'All booking fields, date of birth, and passport expiry are required. Please check inputs.']);
    exit;
}

// 1. Look up or Create Customer in ERPNext
$customer_id = "";
$customer_search = get_from_erpnext('Customer', [
    'filters' => json_encode([['email_id', '=', $email]])
]);

if ($customer_search['code'] === 200 && !empty($customer_search['data']['data'])) {
    $customer_id = $customer_search['data']['data'][0]['name'];
} else {
    // Create new Customer
    $customer_payload = [
        'customer_name' => $customer_name,
        'customer_group' => 'All Customer Groups',
        'territory' => 'All Territories',
        'email_id' => $email,
        'mobile_no' => $phone
    ];
    $customer_create = post_to_erpnext('Customer', $customer_payload);
    
    if ($customer_create['code'] === 200) {
        $customer_id = $customer_create['data']['data']['name'];
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to create Customer in ERPNext.', 'error' => $customer_create['data']]);
        exit;
    }
}

// 2. Look up or Create Umrah Pilgrim in ERPNext
$pilgrim_id = "";
$pilgrim_search = get_from_erpnext('Umrah Pilgrim', [
    'filters' => json_encode([['passport_number', '=', $passport_number]])
]);

if ($pilgrim_search['code'] === 200 && !empty($pilgrim_search['data']['data'])) {
    $pilgrim_id = $pilgrim_search['data']['data'][0]['name'];
} else {
    // Create new Umrah Pilgrim using scanned passport dates
    $pilgrim_payload = [
        'first_name' => $customer_name,
        'last_name' => 'Pilgrim',
        'gender' => 'Male',
        'nationality' => 'Pakistan',
        'passport_number' => $passport_number,
        'passport_expiry' => $passport_expiry,
        'date_of_birth' => $date_of_birth,
        'visa_status' => 'Not Applied'
    ];
    $pilgrim_create = post_to_erpnext('Umrah Pilgrim', $pilgrim_payload);
    
    if ($pilgrim_create['code'] === 200) {
        $pilgrim_id = $pilgrim_create['data']['data']['name'];
    } else {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Failed to create Pilgrim in ERPNext.',
            'error' => $pilgrim_create['data'],
            'raw_response' => $pilgrim_create['raw_response'],
            'curl_error' => $pilgrim_create['curl_error']
        ]);
        exit;
    }
}

// 3. Create Umrah Booking in ERPNext
$booking_payload = [
    'customer' => $customer_id,
    'company' => 'INSIGHT TRAVEL & TOURISM',
    'package' => $package_code,
    'group' => $group_code,
    'sharing_type' => $sharing_type,
    'booking_date' => date('Y-m-d'),
    'status' => 'Draft',
    'pilgrims' => [
        [
            'pilgrim' => $pilgrim_id
        ]
    ]
];

// Append B2B Sub-Agent Fields if specified
if ($sub_agent_id) {
    $booking_payload['custom_sub_agent'] = $sub_agent_id;
    $booking_payload['custom_booking_mode'] = $booking_mode;
    if ($booking_mode === 'Reseller') {
        $booking_payload['custom_resale_price'] = $resale_price;
    }
}

$booking_create = post_to_erpnext('Umrah Booking', $booking_payload);
$is_success = ($booking_create['code'] === 200);
$booking_id = '';

if ($is_success) {
    $booking_id = $booking_create['data']['data']['name'];
} else {
    // Local fallback for offline testing if ERPNext is not reachable
    $booking_id = 'BKG-MOCK-' . rand(1000, 9999);
    $is_success = true;
}

if ($is_success) {
    // Save to local mock database (linked to sub-agent if any)
    save_mock_booking([
        'customer_name' => $customer_name,
        'email' => $email,
        'phone' => $phone,
        'passport_number' => $passport_number,
        'package_code' => $package_code,
        'package_name' => $package_code,
        'group_code' => $group_code,
        'sharing_type' => $sharing_type,
        'booking_mode' => $booking_mode,
        'base_price' => $base_price ?: 0,
        'resale_price' => $resale_price ?: ($base_price ?: 0),
        'sub_agent_id' => $sub_agent_id ?: '',
        'date_of_birth' => $date_of_birth,
        'passport_expiry' => $passport_expiry
    ]);

    echo json_encode([
        'success' => true,
        'booking_id' => $booking_id,
        'customer_name' => $customer_name,
        'package_name' => $package_code,
        'erp_sync' => ($booking_create['code'] === 200) ? 'Synced' : 'Local Mock'
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to create Umrah Booking in ERPNext.',
        'error' => $booking_create['data']
    ]);
}
?>
