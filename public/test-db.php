<?php
//require_once "./config/database.php";
require_once __DIR__ . '/../config/database.php';

$db = new Database();
$conn = $db->connect();

if ($conn) {
    echo "Database connected successfully!";
} else {
    echo "Database connection failed";
}
