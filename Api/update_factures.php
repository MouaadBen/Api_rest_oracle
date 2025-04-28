<?php
require_once 'config.php';

$transactionId = $_GET['CustomerTransactionId'] ?? null;

if (!$transactionId) {
    echo json_encode(["error" => "Identifiant de transaction manquant."]);
    exit;
}

$url = ORACLE_API_BASE_URL . "/fscmRestApi/resources/11.13.18.05/receivablesInvoices?q=CustomerTransactionId=" . urlencode($transactionId);

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, getBasicAuthHeaders());

$response = curl_exec($ch);

if (curl_errno($ch)) {
    echo json_encode(["error" => curl_error($ch)]);
} else {
    header('Content-Type: application/json');
    echo $response;
}

curl_close($ch);
