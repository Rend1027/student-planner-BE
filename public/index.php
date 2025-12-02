<?php

require_once __DIR__ . "/../config/database.php";
require_once __DIR__ . "/../utils/Router.php";
require_once __DIR__ . "/../controllers/AuthController.php";
require_once __DIR__ . "/../vendor/autoload.php";
require_once __DIR__ . "/../middleware/AuthMiddleware.php";
require_once __DIR__ . '/../controllers/EventController.php';

$db = (new Database())->connect();
$router = new Router();

// -----------------------
// API ROUTES
// -----------------------

// AUTH
$router->post("/api/register", [AuthController::class, "register"]);
$router->post("/api/login", [AuthController::class, "login"]);

// EVENTS (Class Scheduler)
$router->post("/api/events/create", [EventController::class, "create"]);
$router->get("/api/events", [EventController::class, "getAll"]);
$router->put("/api/events/update", [EventController::class, "update"]);
$router->delete("/api/events/delete", [EventController::class, "delete"]);

// (Optional placeholder for tasks)
$router->post("/api/tasks/create", function($db) {
    $auth = AuthMiddleware::requireToken(); 
});

// -----------------------
// RUN ROUTER
// -----------------------
$router->run($db);
