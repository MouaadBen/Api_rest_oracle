<?php
require_once 'config.php';

$data = json_decode(file_get_contents('php://input'), true);

$transactionId = $data['CustomerTransactionId'] ?? null;

if (!$transactionId) {
    echo json_encode(["error" => "Identifiant de transaction manquant."]);
    exit;
}

if (isset($data['TransactionDate']) && !preg_match('/^\d{4}-\d{2}-\d{2}$/', $data['TransactionDate'])) {
    echo json_encode(["error" => "Date de transaction invalide."]);
    exit;
}

$updateFields = [];

if (isset($data['PayingCustomerName'])) {
    $updateFields['PayingCustomerName'] = $data['PayingCustomerName'];
}
if (isset($data['PayingCustomerSite'])) {
    $updateFields['PayingCustomerSite'] = $data['PayingCustomerSite'];
}
if (isset($data['BillToCustomerName'])) {
    $updateFields['BillToCustomerName'] = $data['BillToCustomerName'];
}
if (isset($data['TransactionNumber'])) {
    $updateFields['TransactionNumber'] = $data['TransactionNumber'];
}
if (isset($data['RemitToAddress'])) {
    $updateFields['RemitToAddress'] = $data['RemitToAddress'];
}
if (isset($data['TransactionDate'])) {
    $updateFields['TransactionDate'] = $data['TransactionDate'];
}
if (isset($data['TransactionType'])) {
    $updateFields['TransactionType'] = $data['TransactionType'];
}

if (empty($updateFields)) {
    echo json_encode(["error" => "Aucune donnée à mettre à jour."]);
    exit;
}

$url = ORACLE_API_BASE_URL . "/fscmRestApi/resources/11.13.18.05/receivablesInvoices/" . urlencode($transactionId);

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PATCH");
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($updateFields));
curl_setopt($ch, CURLOPT_HTTPHEADER, array_merge(
    getBasicAuthHeaders(),
    [
        "Content-Type: application/json",
        "Accept: application/json"
    ]
));
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true); 

$response = curl_exec($ch);

if (curl_errno($ch)) {
    echo json_encode(["error" => curl_error($ch)]);
} else {
    header('Content-Type: application/json');
    echo $response;
}

curl_close($ch);
?>
