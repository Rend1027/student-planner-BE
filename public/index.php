<?php

require_once __DIR__ . "/../config/database.php";
require_once __DIR__ . "/../utils/Router.php";
require_once __DIR__ . "/../controllers/AuthController.php";
require_once __DIR__ . "/../vendor/autoload.php";
require_once __DIR__ . "/../middleware/AuthMiddleware.php";


$db = (new Database())->connect();
$router = new Router();

// -----------------------
// API ROUTES
// -----------------------

$router->post("/api/tasks/create", function($db) {
    $auth = AuthMiddleware::requireToken(); 
    // $auth->sub is the user ID
});

$router->post("/api/register", [AuthController::class, "register"]);
$router->post("/api/login", [AuthController::class, "login"]);

// -----------------------
$router->run($db);
