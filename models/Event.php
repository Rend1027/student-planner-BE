<?php

class Event
{
    private $conn;
    private $table = "events";

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function create($studentId, $data)
    {
        $query = "INSERT INTO " . $this->table . "
                  (student_id, title, description, date, start_time, end_time, day_of_week, type)
                  VALUES (:student_id, :title, :description, :date, :start_time, :end_time, :day_of_week, :type)";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":student_id", $studentId);
        $stmt->bindParam(":title", $data["title"]);
        $stmt->bindParam(":description", $data["description"]);
        $stmt->bindParam(":date", $data["date"]);
        $stmt->bindParam(":start_time", $data["start_time"]);
        $stmt->bindParam(":end_time", $data["end_time"]);
        $stmt->bindParam(":day_of_week", $data["day_of_week"]);
        $stmt->bindParam(":type", $data["type"]); // 'class' or 'event'

        return $stmt->execute();
    }

    public function getByStudent($studentId)
    {
        $query = "SELECT * FROM " . $this->table . " WHERE student_id = :student_id ORDER BY created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":student_id", $studentId);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function update($eventId, $studentId, $data)
    {
        $query = "UPDATE " . $this->table . "
                  SET title = :title, description = :description, date = :date,
                      start_time = :start_time, end_time = :end_time,
                      day_of_week = :day_of_week, type = :type
                  WHERE id = :id AND student_id = :student_id";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":id", $eventId);
        $stmt->bindParam(":student_id", $studentId);
        $stmt->bindParam(":title", $data["title"]);
        $stmt->bindParam(":description", $data["description"]);
        $stmt->bindParam(":date", $data["date"]);
        $stmt->bindParam(":start_time", $data["start_time"]);
        $stmt->bindParam(":end_time", $data["end_time"]);
        $stmt->bindParam(":day_of_week", $data["day_of_week"]);
        $stmt->bindParam(":type", $data["type"]);

        return $stmt->execute();
    }

    public function delete($eventId, $studentId)
    {
        $query = "DELETE FROM " . $this->table . " WHERE id = :id AND student_id = :student_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $eventId);
        $stmt->bindParam(":student_id", $studentId);
        return $stmt->execute();
    }
}
