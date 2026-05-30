<?php
// ERPNext Connection Details
define('ERP_URL', 'https://your-erpnext-url.com');
define('API_KEY', 'your_api_key_here');
define('API_SECRET', 'your_api_secret_here');

/**
 * Helper function to send data to ERPNext
 */
function post_to_erpnext($endpoint, $data) {
    $url = ERP_URL . '/api/resource/' . rawurlencode($endpoint);
    $ch = curl_init($url);

    $headers = [
        'Authorization: token ' . API_KEY . ':' . API_SECRET,
        'Content-Type: application/json',
        'Accept: application/json'
    ];

    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    curl_close($ch);

    return [
        'code' => $httpCode,
        'data' => json_decode($response, true),
        'curl_error' => $curlError,
        'raw_response' => $response
    ];
}

/**
 * Helper function to retrieve data from ERPNext
 */
function get_from_erpnext($endpoint, $params = []) {
    $url = ERP_URL . '/api/resource/' . rawurlencode($endpoint);
    if (!empty($params)) {
        $url .= '?' . http_build_query($params);
    }
    $ch = curl_init($url);

    $headers = [
        'Authorization: token ' . API_KEY . ':' . API_SECRET,
        'Content-Type: application/json',
        'Accept: application/json'
    ];

    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    curl_close($ch);

    return [
        'code' => $httpCode,
        'data' => json_decode($response, true),
        'curl_error' => $curlError,
        'raw_response' => $response
    ];
}

// Sales Portal Authentication Password
define('SALES_PORTAL_PASSWORD', 'your_sales_portal_password_here');

/**
 * Helper function to update data in ERPNext (PUT)
 */
function put_to_erpnext($endpoint, $name, $data) {
    $url = ERP_URL . '/api/resource/' . rawurlencode($endpoint) . '/' . rawurlencode($name);
    $ch = curl_init($url);

    $headers = [
        'Authorization: token ' . API_KEY . ':' . API_SECRET,
        'Content-Type: application/json',
        'Accept: application/json'
    ];

    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT');
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    curl_close($ch);

    return [
        'code' => $httpCode,
        'data' => json_decode($response, true),
        'curl_error' => $curlError,
        'raw_response' => $response
    ];
}
?>
