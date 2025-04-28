<?php
define("ORACLE_API_BASE_URL", "https://edbh-test.fa.em2.oraclecloud.com");
define("ORACLE_USERNAME", "setup_user");
define("ORACLE_PASSWORD", "XPS@2025**");

function getBasicAuthHeaders() {
    $auth = base64_encode(ORACLE_USERNAME . ":" . ORACLE_PASSWORD);
    return [
        "Authorization: Basic $auth",
        "Content-Type: application/json",
        "Accept: application/json"
    ];
}
