<?php

require_once __DIR__ . "/../config/database.php";
require_once __DIR__ . "/../utils/Router.php";
require_once __DIR__ . "/../controllers/AuthController.php";
require_once __DIR__ . "/../vendor/autoload.php";
require_once __DIR__ . "/../middleware/AuthMiddleware.php";
require_once __DIR__ . '/../controllers/EventController.php';
require_once __DIR__ . '/../controllers/TaskController.php';
require_once __DIR__ . "/../middleware/AdminMiddleware.php";
require_once __DIR__ . '/../controllers/NotificationController.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    exit(0);
}

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

// TASKS (To-Do List)
// TASKS
$router->get("/api/tasks", function ($db) {
    $controller = new TaskController($db);
    $controller->getAll();
});

$router->post("/api/tasks/create", function ($db) {
    $controller = new TaskController($db);
    $controller->create();
});

$router->put("/api/tasks/update", function ($db) {
    $controller = new TaskController($db);
    $controller->update();
});

$router->delete("/api/tasks/delete", function ($db) {
    $controller = new TaskController($db);
    $controller->delete();
});

// NOTIFICATIONS ROUTES
$router->get('/api/notifications', function ($db) {
    AuthMiddleware::requireAuth();
    $userId = AuthMiddleware::getUserId();
    NotificationController::getAll($db, $userId);
});

$router->put('/api/notifications/read', function ($db) {
    AuthMiddleware::requireAuth();
    $userId = AuthMiddleware::getUserId();
    NotificationController::markRead($db, $userId);
});



// Delete Event route
$router->delete("/api/events/delete", [EventController::class, "delete"]);

// Admin routes -----------------------------

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

    // delete users
$router->delete("/api/admin/users/delete", function($db) {
    $auth = AdminMiddleware::requireAdmin();

    $input = json_decode(file_get_contents("php://input"), true);

    if(!isset($input["id"])) {
        Response::json(400, "User ID required");
    }

    $userId = $input["id"];

    // prevent admin from deleting themselves
    if ($auth->sub == $userId) {
        Response::json(403, "Admin cannot their own account");
    }

    // Delete user
    $stmt = $db->prepare("DELETE FROM users WHERE id = :id");
    $stmt->bindParam(":id", $userId, PDO::PARAM_INT);

    if ($stmt->execute()) {
        Response::json(200, "User deleted successfully");
    }

    Response::json(500, "Failed to delete user");
});



// RUN ROUTER
$router->run($db);
