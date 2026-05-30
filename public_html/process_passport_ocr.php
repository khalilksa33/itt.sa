<?php
header('Content-Type: application/json');
require_once 'includes/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
    exit;
}

if (!isset($_FILES['passport'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'No passport image file uploaded.']);
    exit;
}

$file = $_FILES['passport'];
$filename = strtolower($file['name']);

// Simulate OCR scan processing time
usleep(1500000); // 1.5 seconds delay

// Check file name keywords to mock different test cases
if (strpos($filename, 'expired') !== false) {
    // Return an expired passport (validity under 6 months)
    echo json_encode([
        'success' => true,
        'customer_name' => 'Zahid Ahmed Khan',
        'passport_number' => 'EX892019',
        'date_of_birth' => '1975-10-12',
        // Set expiry to exactly 45 days from today
        'passport_expiry' => date('Y-m-d', strtotime('+45 days')),
        'nationality' => 'Pakistan',
        'gender' => 'Male',
        'ocr_status' => 'Successfully parsed with eligibility warnings'
    ]);
} elseif (strpos($filename, 'minor') !== false) {
    // Return a minor passport (pilgrim under 18)
    echo json_encode([
        'success' => true,
        'customer_name' => 'Yousuf Faisal',
        'passport_number' => 'MN102948',
        // Set DOB to 12 years ago today
        'date_of_birth' => date('Y-m-d', strtotime('-12 years')),
        // Valid passport (expires in 8 years)
        'passport_expiry' => date('Y-m-d', strtotime('+8 years')),
        'nationality' => 'Pakistan',
        'gender' => 'Male',
        'ocr_status' => 'Successfully parsed with age warning'
    ]);
} else {
    // Return a normal, valid passport
    echo json_encode([
        'success' => true,
        'customer_name' => 'Kamran Siddique',
        'passport_number' => 'PK7204918',
        'date_of_birth' => '1988-08-14',
        // Valid passport (expires in 5 years)
        'passport_expiry' => date('Y-m-d', strtotime('+5 years')),
        'nationality' => 'Pakistan',
        'gender' => 'Male',
        'ocr_status' => 'Successfully parsed'
    ]);
}
?>
