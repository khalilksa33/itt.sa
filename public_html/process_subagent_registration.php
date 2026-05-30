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
$agency_name = filter_input(INPUT_POST, 'agency_name', FILTER_SANITIZE_SPECIAL_CHARS);
$contact_name = filter_input(INPUT_POST, 'contact_name', FILTER_SANITIZE_SPECIAL_CHARS);
$email = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);
$phone = filter_input(INPUT_POST, 'phone', FILTER_SANITIZE_SPECIAL_CHARS);
$license_no = filter_input(INPUT_POST, 'license_no', FILTER_SANITIZE_SPECIAL_CHARS);
$address = filter_input(INPUT_POST, 'address', FILTER_SANITIZE_SPECIAL_CHARS);
$experience = filter_input(INPUT_POST, 'experience', FILTER_VALIDATE_INT);
$bio = filter_input(INPUT_POST, 'bio', FILTER_SANITIZE_SPECIAL_CHARS);

if (!$agency_name || !$contact_name || !$email || !$phone || !$address || $experience === false) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Required fields (Agency Name, Contact, valid Email, Phone, Address, Experience) are missing.']);
    exit;
}

// 1. Save to local mock database (always done for local offline demo)
$subagent_details = [
    'agency_name' => $agency_name,
    'contact_name' => $contact_name,
    'email' => $email,
    'phone' => $phone,
    'license_no' => $license_no,
    'address' => $address,
    'experience' => $experience,
    'bio' => $bio
];

$local_agent = save_mock_subagent($subagent_details);

// 2. Sync to ERPNext if configured
$erp_payload = [
    'agency_name' => $agency_name,
    'contact_person' => $contact_name,
    'email_id' => $email,
    'mobile_no' => $phone,
    'custom_license_no' => $license_no,
    'city_country' => $address,
    'experience_years' => $experience,
    'agency_bio' => $bio,
    'status' => 'Pending'
];

$erp_sync = post_to_erpnext('Sub Agent', $erp_payload);

// Return response
echo json_encode([
    'success' => true,
    'agent_id' => $local_agent['name'],
    'agency_name' => $agency_name,
    'erp_sync_code' => $erp_sync['code'],
    'erp_response' => $erp_sync['data'] ?? null
]);
?>
