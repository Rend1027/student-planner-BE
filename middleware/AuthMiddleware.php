<?php

require_once __DIR__ . '/../utils/JwtHelper.php';
require_once __DIR__ . '/../utils/Response.php';

class AuthMiddleware
{
    public static function requireToken()
    {
        // Try to get Authorization header
        $headers = function_exists('apache_request_headers') 
            ? apache_request_headers()
            : self::getHeaders();

        if (!isset($headers["Authorization"])) {
            Response::json(401, "Missing Authorization header");
        }

        if (!str_starts_with($headers["Authorization"], "Bearer ")) {
            Response::json(401, "Invalid Authorization format");
        }

        $token = substr($headers["Authorization"], 7);

        try {
            return JwtHelper::verifyToken($token);
        } catch (Exception $e) {
            Response::json(401, "Invalid or expired token");
        }
    }

    // Fallback for CLI or PHP dev server
    private static function getHeaders()
    {
        $headers = [];
        foreach ($_SERVER as $key => $value) {
            if (substr($key, 0, 5) == "HTTP_") {
                $name = str_replace(" ", "-", ucwords(strtolower(str_replace("_", " ", substr($key, 5)))));
                $headers[$name] = $value;
            }
        }
        return $headers;
    }
}
