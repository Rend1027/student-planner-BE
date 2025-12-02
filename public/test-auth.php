<?php
require_once __DIR__ . "/../config/database.php";
require_once __DIR__ . "/../controllers/AuthController.php";

$db = (new Database())->connect();
$auth = new AuthController($db);

// Fake request payload
$_POST = [
    "username" => "flo",
    "email" => "flo@example.com",
    "password" => "123456"
];

// Call register directly
$auth->register();
