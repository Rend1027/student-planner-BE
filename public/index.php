<?php

require_once __DIR__ . "/../config/database.php";
require_once __DIR__ . "/../utils/Router.php";
require_once __DIR__ . "/../controllers/AuthController.php";
require_once __DIR__ . "/../vendor/autoload.php";
require_once __DIR__ . "/../middleware/AuthMiddleware.php";
require_once __DIR__ . '/../controllers/EventController.php';
require_once __DIR__ . "/../middleware/AdminMiddleware.php";

$db = (new Database())->connect();
$router = new Router();

// API ROUTES -----------------

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

// Delete Event route
$router->delete("/api/events/delete", [EventController::class, "delete"]);

// Admin routes ----------

   // get all users
$router->get("/api/admin/users", function($db) {
    $auth = AdminMiddleware::requireAdmin();
    $stmt = $db->query("SELECT id, username, email, role, created_at FROM users");
    $users = $stmt->fetchAll();
    Response::json(200, "All users retrieved", $users);
});

    // get all events
$router->get("/api/admin/events", function($db) {
    $auth = AdminMiddleware::requireAdmin();
    $stmt = $db->query("SELECT * FROM events");
    $events = $stmt->fetchAll();
    Response::json(200, "All events retrived", $events);
});



// RUN ROUTER
$router->run($db);
