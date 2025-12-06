<?php

require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';

class TaskController
{
    private $db;

    public function __construct($db)
    {
        $this->db = $db;
    }

    // POST /api/tasks/create
    public function create()
    {
        $auth = AuthMiddleware::requireToken(); // JWT payload
        $studentId = $auth->sub;

        $input = json_decode(file_get_contents("php://input"), true);

        if (!isset($input["title"]) || !isset($input["due_date"])) {
            Response::json(400, "Title and due_date are required");
        }

        $title       = trim($input["title"]);
        $description = $input["description"] ?? null;
        $dueDate     = $input["due_date"];   // "YYYY-MM-DD"
        $dueTime     = $input["due_time"] ?? null;   // "HH:MM" or null
        $alarmTime   = $input["alarm_time"] ?? null; // "HH:MM" or null

        $sql = "INSERT INTO tasks (student_id, title, description, due_date, due_time, alarm_time)
                VALUES (:student_id, :title, :description, :due_date, :due_time, :alarm_time)";
        $stmt = $this->db->prepare($sql);

        $stmt->bindParam(":student_id", $studentId, PDO::PARAM_INT);
        $stmt->bindParam(":title", $title, PDO::PARAM_STR);
        $stmt->bindParam(":description", $description, PDO::PARAM_STR);
        $stmt->bindParam(":due_date", $dueDate, PDO::PARAM_STR);
        $stmt->bindParam(":due_time", $dueTime, PDO::PARAM_STR);
        $stmt->bindParam(":alarm_time", $alarmTime, PDO::PARAM_STR);

        if (!$stmt->execute()) {
            Response::json(500, "Failed to create task");
        }

        $newId = $this->db->lastInsertId();

        // Return the newly created row (optional but nice)
        $stmt = $this->db->prepare("SELECT * FROM tasks WHERE id = :id");
        $stmt->bindParam(":id", $newId, PDO::PARAM_INT);
        $stmt->execute();
        $task = $stmt->fetch(PDO::FETCH_ASSOC);

        Response::json(201, "Task created", $task);
    }

    // GET /api/tasks
    public function getAll()
    {
        $auth = AuthMiddleware::requireToken();
        $studentId = $auth->sub;

        $sql = "SELECT * FROM tasks
                WHERE student_id = :student_id
                ORDER BY due_date ASC, due_time ASC";
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(":student_id", $studentId, PDO::PARAM_INT);
        $stmt->execute();

        $tasks = $stmt->fetchAll(PDO::FETCH_ASSOC);

        Response::json(200, "Tasks retrieved", $tasks);
    }

    // PUT /api/tasks/update
    public function update()
    {
        $auth = AuthMiddleware::requireToken();
        $studentId = $auth->sub;

        $input = json_decode(file_get_contents("php://input"), true);

        if (!isset($input["id"])) {
            Response::json(400, "Task ID is required");
        }

        $id          = (int) $input["id"];
        $title       = $input["title"] ?? null;
        $description = $input["description"] ?? null;
        $dueDate     = $input["due_date"] ?? null;
        $dueTime     = $input["due_time"] ?? null;
        $alarmTime   = $input["alarm_time"] ?? null;

        // Build a simple update; we assume all fields are sent
        $sql = "UPDATE tasks
                SET title = :title,
                    description = :description,
                    due_date = :due_date,
                    due_time = :due_time,
                    alarm_time = :alarm_time
                WHERE id = :id AND student_id = :student_id";

        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(":title", $title, PDO::PARAM_STR);
        $stmt->bindParam(":description", $description, PDO::PARAM_STR);
        $stmt->bindParam(":due_date", $dueDate, PDO::PARAM_STR);
        $stmt->bindParam(":due_time", $dueTime, PDO::PARAM_STR);
        $stmt->bindParam(":alarm_time", $alarmTime, PDO::PARAM_STR);
        $stmt->bindParam(":id", $id, PDO::PARAM_INT);
        $stmt->bindParam(":student_id", $studentId, PDO::PARAM_INT);

        $stmt->execute();

        if ($stmt->rowCount() === 0) {
            // Either not found or not owned by this student
            Response::json(404, "Task not found");
        }

        // Return updated row
        $stmt = $this->db->prepare("SELECT * FROM tasks WHERE id = :id");
        $stmt->bindParam(":id", $id, PDO::PARAM_INT);
        $stmt->execute();
        $task = $stmt->fetch(PDO::FETCH_ASSOC);

        Response::json(200, "Task updated", $task);
    }

    // DELETE /api/tasks/delete
    public function delete()
    {
        $auth = AuthMiddleware::requireToken();
        $studentId = $auth->sub;

        $input = json_decode(file_get_contents("php://input"), true);

        if (!isset($input["id"])) {
            Response::json(400, "Task ID is required");
        }

        $id = (int) $input["id"];

        $stmt = $this->db->prepare(
            "DELETE FROM tasks WHERE id = :id AND student_id = :student_id"
        );
        $stmt->bindParam(":id", $id, PDO::PARAM_INT);
        $stmt->bindParam(":student_id", $studentId, PDO::PARAM_INT);
        $stmt->execute();

        if ($stmt->rowCount() === 0) {
            Response::json(404, "Task not found");
        }

        Response::json(200, "Task deleted");
    }
}
