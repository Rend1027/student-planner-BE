<?php

require_once __DIR__ . '/../utils/Response.php';

class NotificationController
{
    // GET /api/notifications
    public static function getAll($db, $studentId)
    {
        $stmt = $db->prepare("
            SELECT id, message, type, is_read, created_at
            FROM notifications
            WHERE student_id = :student_id
            ORDER BY created_at DESC
            LIMIT 50
        ");
        $stmt->bindParam(':student_id', $studentId, PDO::PARAM_INT);
        $stmt->execute();
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        Response::json(200, "Notifications fetched", $rows);
    }

    // PUT /api/notifications/read
    public static function markRead($db, $studentId)
    {
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        if (!isset($input['id'])) {
            Response::json(400, "Notification id is required");
        }

        $id = (int)$input['id'];

        $stmt = $db->prepare("
            UPDATE notifications
            SET is_read = 1
            WHERE id = :id AND student_id = :student_id
        ");
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->bindParam(':student_id', $studentId, PDO::PARAM_INT);

        if ($stmt->execute()) {
            Response::json(200, "Notification marked as read");
        }

        Response::json(500, "Failed to mark notification as read");
    }

    // Helper used by other controllers to create a notification
    public static function createNotification($db, $studentId, $message, $type)
    {
        $stmt = $db->prepare("
            INSERT INTO notifications (student_id, message, type)
            VALUES (:student_id, :message, :type)
        ");
        $stmt->bindParam(':student_id', $studentId, PDO::PARAM_INT);
        $stmt->bindParam(':message', $message, PDO::PARAM_STR);
        $stmt->bindParam(':type', $type, PDO::PARAM_STR);

        $stmt->execute();
    }
}
