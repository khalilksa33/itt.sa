<?php
/**
 * Mock Database Helper for Offline Local Persistence
 */

define('MOCK_DB_FILE', __DIR__ . '/mock_data.json');

/**
 * Load raw data from JSON file
 */
function load_mock_data() {
    if (!file_exists(MOCK_DB_FILE)) {
        // Fallback initialization if file deleted
        $init = ['sub_agents' => [], 'bookings' => []];
        file_put_contents(MOCK_DB_FILE, json_encode($init, JSON_PRETTY_PRINT));
        return $init;
    }
    $content = file_get_contents(MOCK_DB_FILE);
    $data = json_decode($content, true);
    if (!is_array($data)) {
        return ['sub_agents' => [], 'bookings' => []];
    }
    return $data;
}

/**
 * Save raw data to JSON file
 */
function save_mock_data($data) {
    return file_put_contents(MOCK_DB_FILE, json_encode($data, JSON_PRETTY_PRINT));
}

/**
 * Get registered sub-agents
 */
function get_mock_subagents($status = null) {
    $db = load_mock_data();
    $agents = $db['sub_agents'] ?? [];
    
    if ($status) {
        $agents = array_values(array_filter($agents, function($agt) use ($status) {
            return strtolower($agt['status']) === strtolower($status);
        }));
    }
    return $agents;
}

/**
 * Create a new sub-agent
 */
function save_mock_subagent($agent) {
    $db = load_mock_data();
    if (!isset($db['sub_agents'])) {
        $db['sub_agents'] = [];
    }

    // Generate unique ID: AGT-2026-XXXX
    $count = count($db['sub_agents']) + 1;
    $id = 'AGT-' . date('Y') . '-' . str_pad($count, 4, '0', STR_PAD_LEFT);
    
    $new_agent = [
        'name' => $id,
        'agency_name' => $agent['agency_name'],
        'contact_name' => $agent['contact_name'],
        'email' => $agent['email'],
        'phone' => $agent['phone'],
        'license_no' => $agent['license_no'] ?? '',
        'address' => $agent['address'] ?? '',
        'experience' => isset($agent['experience']) ? intval($agent['experience']) : 0,
        'bio' => $agent['bio'] ?? '',
        'status' => 'Pending', // Defaults to Pending review
        'created_at' => date('Y-m-d H:i:s')
    ];
    
    $db['sub_agents'][] = $new_agent;
    save_mock_data($db);
    return $new_agent;
}

/**
 * Update sub-agent approval status
 */
function update_subagent_status($agent_id, $status) {
    $db = load_mock_data();
    $updated = false;
    
    foreach ($db['sub_agents'] as &$agent) {
        if ($agent['name'] === $agent_id) {
            $agent['status'] = $status;
            $updated = true;
            break;
        }
    }
    
    if ($updated) {
        save_mock_data($db);
    }
    return $updated;
}

/**
 * Get B2B bookings
 */
function get_mock_bookings($sub_agent_id = null) {
    $db = load_mock_data();
    $bookings = $db['bookings'] ?? [];
    
    if ($sub_agent_id) {
        $bookings = array_values(array_filter($bookings, function($bkg) use ($sub_agent_id) {
            return $bkg['sub_agent_id'] === $sub_agent_id;
        }));
    }
    return $bookings;
}

/**
 * Create a new mock booking (linked to sub-agent)
 */
function save_mock_booking($booking) {
    $db = load_mock_data();
    if (!isset($db['bookings'])) {
        $db['bookings'] = [];
    }
    
    $count = count($db['bookings']) + 1;
    $id = 'BKG-' . date('Y') . '-' . str_pad($count, 4, '0', STR_PAD_LEFT);
    
    $base_price = floatval($booking['base_price']);
    $resale_price = floatval($booking['resale_price'] ?? $base_price);
    
    $commission = 0;
    if ($booking['booking_mode'] === 'Reseller') {
        // Reseller markup model: commission/profit is the resale price markup
        $commission = max(0, $resale_price - $base_price);
    } else {
        // Standard rate model: standard 5% B2B commission
        $commission = $base_price * 0.05;
        $resale_price = $base_price; // Force resale price to match base price in standard mode
    }

    $new_booking = [
        'name' => $id,
        'customer_name' => $booking['customer_name'],
        'email' => $booking['email'],
        'phone' => $booking['phone'],
        'passport_number' => $booking['passport_number'],
        'package_code' => $booking['package_code'],
        'package_name' => $booking['package_name'] ?? $booking['package_code'],
        'group_code' => $booking['group_code'],
        'sharing_type' => $booking['sharing_type'],
        'booking_mode' => $booking['booking_mode'] ?? 'Standard',
        'base_price' => $base_price,
        'resale_price' => $resale_price,
        'commission' => $commission,
        'sub_agent_id' => $booking['sub_agent_id'] ?? '',
        'status' => 'Draft',
        'booking_date' => date('Y-m-d')
    ];
    
    $db['bookings'][] = $new_booking;
    save_mock_data($db);
    return $new_booking;
}
?>
