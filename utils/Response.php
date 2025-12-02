<?php

class Response {
    public static function json($statusCode, $message, $data = null) {
        http_response_code($statusCode);

        echo json_encode([
            "success" => $statusCode >= 200 && $statusCode < 300,
            "message" => $message,
            "data" => $data
        ]);
        exit;
    }
}