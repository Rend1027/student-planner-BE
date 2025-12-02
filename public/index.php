<?php

require_once __DIR__ . "/../config/database.php";
require_once __DIR__ . "/../utils/Router.php";
require_once __DIR__ . "/../controllers/AuthController.php";

$db = (new Database())->connect();
$router = new Router();

// -----------------------
// API ROUTES
// -----------------------

$router->post("/api/register", [AuthController::class, "register"]);
$router->post("/api/login", [AuthController::class, "login"]);

// -----------------------
$router->run($db);
