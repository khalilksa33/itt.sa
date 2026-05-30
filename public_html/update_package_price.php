<?php
session_start();
header('Content-Type: application/json');
require_once 'includes/config.php';

// Verify authentication
if (!isset($_SESSION['sales_logged_in']) || $_SESSION['sales_logged_in'] !== true) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Unauthorized Access. Please login first.']);
    exit;
}

// Verify request method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
    exit;
}

// Retrieve and sanitize inputs
$package_code = filter_input(INPUT_POST, 'package_code', FILTER_SANITIZE_SPECIAL_CHARS);
$price_sharing = filter_input(INPUT_POST, 'price_sharing', FILTER_VALIDATE_INT);
$price_quad = filter_input(INPUT_POST, 'price_quad', FILTER_VALIDATE_INT);
$price_triple = filter_input(INPUT_POST, 'price_triple', FILTER_VALIDATE_INT);
$price_double = filter_input(INPUT_POST, 'price_double', FILTER_VALIDATE_INT);
$price_single = filter_input(INPUT_POST, 'price_single', FILTER_VALIDATE_INT);

// Basic Validation
if (!$package_code || 
    $price_sharing === false || $price_sharing < 0 ||
    $price_quad === false || $price_quad < 0 ||
    $price_triple === false || $price_triple < 0 ||
    $price_double === false || $price_double < 0 ||
    $price_single === false || $price_single < 0) {
    
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid or missing price parameters. Rates must be non-negative numbers.']);
    exit;
}

// Prepare payload for ERPNext PUT request
$update_payload = [
    'price_sharing' => $price_sharing,
    'price_quad' => $price_quad,
    'price_triple' => $price_triple,
    'price_double' => $price_double,
    'price_single' => $price_single
];

// Perform PUT request to ERPNext
$api_response = put_to_erpnext('Umrah Package', $package_code, $update_payload);

if ($api_response['code'] === 200) {
    echo json_encode([
        'success' => true,
        'package_code' => $package_code
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to sync rates to ERPNext server.',
        'error' => $api_response['data'],
        'raw' => $api_response['raw_response']
    ]);
}
?>
