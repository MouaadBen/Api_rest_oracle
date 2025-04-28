<?php
require_once 'config.php';

$date = $_GET['date'] ?? '';

$url = ORACLE_API_BASE_URL . "/fscmRestApi/resources/11.13.18.05/receivablesInvoices?finder=invoiceSearch;TransactionSource=%22SPA%20-%20PM%20auto%22,TransactionDate=" . $date ;
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, getBasicAuthHeaders());
$response = curl_exec($ch);

if (curl_errno($ch)) {
    echo json_encode(["error" => curl_error($ch)]);
} else {
    echo $response;
}
curl_close($ch);
