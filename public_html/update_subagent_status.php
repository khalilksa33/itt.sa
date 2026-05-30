<?php
session_start();
header('Content-Type: application/json');
require_once 'includes/config.php';
require_once 'includes/mock_db.php';

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
$agent_id = filter_input(INPUT_POST, 'agent_id', FILTER_SANITIZE_SPECIAL_CHARS);
$status = filter_input(INPUT_POST, 'status', FILTER_SANITIZE_SPECIAL_CHARS);

// Basic Validation
if (!$agent_id || !in_array($status, ['Pending', 'Approved', 'Suspended'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid or missing agent ID or status parameter.']);
    exit;
}

// 1. Update in local mock database (always done for offline demo)
$local_update = update_subagent_status($agent_id, $status);

if (!$local_update) {
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'Agent not found in database.']);
    exit;
}

// 2. Perform PUT request to ERPNext to update agent status
$api_response = put_to_erpnext('Sub Agent', $agent_id, ['status' => $status]);

// Respond success (even if ERPNext fails, the local update is successful for demo)
echo json_encode([
    'success' => true,
    'agent_id' => $agent_id,
    'status' => $status,
    'erp_sync' => ($api_response['code'] === 200) ? 'Synced' : 'Local Mock'
]);
?>
