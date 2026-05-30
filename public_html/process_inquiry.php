<?php
header('Content-Type: application/json');
require_once 'includes/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
    exit;
}

// Retrieve and sanitize inputs
$inquiry_name = filter_input(INPUT_POST, 'inquiry_name', FILTER_SANITIZE_SPECIAL_CHARS);
$email = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);
$phone = filter_input(INPUT_POST, 'phone', FILTER_SANITIZE_SPECIAL_CHARS);
$pilgrim_count = filter_input(INPUT_POST, 'pilgrim_count', FILTER_VALIDATE_INT);
$message = filter_input(INPUT_POST, 'message', FILTER_SANITIZE_SPECIAL_CHARS);

$source = filter_input(INPUT_POST, 'source', FILTER_SANITIZE_SPECIAL_CHARS) ?: 'Web Portal';
$destination = filter_input(INPUT_POST, 'destination', FILTER_SANITIZE_SPECIAL_CHARS);
$hotel_category = filter_input(INPUT_POST, 'hotel_category', FILTER_SANITIZE_SPECIAL_CHARS);
$travel_month = filter_input(INPUT_POST, 'travel_month', FILTER_SANITIZE_SPECIAL_CHARS);

if (!$inquiry_name || !$email || !$phone || $pilgrim_count === false) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Name, valid email, phone, and number of pilgrims are required.']);
    exit;
}

// Build a detailed note from fields
$notes_content = '';
if ($source === 'world-tour') {
    $notes_content .= "World Tour Custom Inquiry:\n";
    if ($destination) $notes_content .= "- Destination: $destination\n";
    if ($hotel_category) $notes_content .= "- Hotel Category: $hotel_category\n";
    if ($travel_month) $notes_content .= "- Travel Month: $travel_month\n";
    if ($message) $notes_content .= "- Special Requests: $message\n";
} else {
    $notes_content = $message ? $message : ($source === 'umrah-landing' ? 'Umrah Landing Page Inquiry' : 'General Umrah Service Inquiry');
}

// Prepare payload for Lead in ERPNext
$lead_payload = [
    'lead_name' => $inquiry_name,
    'email_id' => $email,
    'mobile_no' => $phone,
    'phone' => $phone,
    'custom_pilgrim_count' => $pilgrim_count,
    'notes' => [
        [
            'note' => $notes_content
        ]
    ],
    'status' => 'Open',
    'company' => 'INSIGHT TRAVEL & TOURISM',
    'source' => $source
];

$lead_create = post_to_erpnext('Lead', $lead_payload);

if ($lead_create['code'] === 200) {
    echo json_encode([
        'success' => true,
        'lead_id' => $lead_create['data']['data']['name'],
        'lead_name' => $inquiry_name
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to submit inquiry to ERPNext.',
        'error' => $lead_create['data']
    ]);
}
?>
