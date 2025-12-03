<?php

require_once __DIR__ . "/../models/Event.php";
require_once __DIR__ . "/../middleware/AuthMiddleware.php";
require_once __DIR__ . "/../utils/Response.php";

class EventController
{
    private $conn;
    private $eventModel;

    public function __construct($db)
    {
        $this->conn = $db;
        $this->eventModel = new Event($db);
    }

    public function create()
    {
        $auth = AuthMiddleware::requireToken();
        $studentId = $auth->sub;

        $input = json_decode(file_get_contents("php://input"), true);

        if (!isset($input["title"], $input["start_time"], $input["end_time"], $input["day_of_week"], $input["type"])) {
            Response::json(400, "Missing required fields");
        }

            // --- CONFLICT CHECK ---
        $conflict = $this->eventModel->checkConflict(
        $studentId,
        $input["day_of_week"],
        $input["start_time"],
        $input["end_time"]
        );

        if ($conflict) {
        Response::json(409, "This event conflicts with another scheduled item", [
            "conflict_with" => $conflict
        ]);
        }

        // No conflict → create event
        $created = $this->eventModel->create($studentId, $input);

        if ($created) {
        Response::json(201, "Event created successfully");
        }

        Response::json(500, "Failed to create event");
    }

    public function getAll()
    {
        $auth = AuthMiddleware::requireToken();
        $studentId = $auth->sub;

        $events = $this->eventModel->getByStudent($studentId);

        Response::json(200, "Events retrieved", $events);
    }

    public function update()
    {
        $auth = AuthMiddleware::requireToken();
        $studentId = $auth->sub;

        $input = json_decode(file_get_contents("php://input"), true);

        if (!isset($input["id"])) {
            Response::json(400, "Event ID required");
        }

        $updated = $this->eventModel->update($input["id"], $studentId, $input);

        if ($updated) {
            Response::json(200, "Event updated");
        }

        Response::json(500, "Failed to update event");
    }

    public function delete()
    {
        $auth = AuthMiddleware::requireToken();
        $studentId = $auth->sub;

        $input = json_decode(file_get_contents("php://input"), true);

        if (!isset($input["id"])) {
            Response::json(400, "Event ID required");
        }

        $deleted = $this->eventModel->delete($input["id"], $studentId);

        if ($deleted) {
            Response::json(200, "Event deleted");
        }

        Response::json(500, "Failed to delete event");
    }
}
