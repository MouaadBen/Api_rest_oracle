<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$transactionId = $_GET['CustomerTransactionId'] ?? null;

if (!$transactionId) {
    http_response_code(400);
    echo json_encode(["error" => "ID de facture manquant."]);
    exit;
}

if ($method !== 'PUT' && $method !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Méthode non autorisée."]);
    exit;
}

$input = json_decode(file_get_contents("php://input"), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(["error" => "Données JSON invalides ou manquantes."]);
    exit;
}

$url = ORACLE_API_BASE_URL . "/fscmRestApi/resources/11.13.18.05/receivablesInvoices/" . urlencode($transactionId);

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PATCH"); 
curl_setopt($ch, CURLOPT_HTTPHEADER, array_merge(getBasicAuthHeaders(), [
    'Content-Type: application/json'
]));
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($input));

$response = curl_exec($ch);

if (curl_errno($ch)) {
    http_response_code(500);
    echo json_encode(["error" => curl_error($ch)]);
} else {
    $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    http_response_code($status);
    echo $response;
}

curl_close($ch);
