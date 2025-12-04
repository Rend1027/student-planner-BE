<?php

require_once __DIR__ . '/../utils/JwtHelper.php';
require_once __DIR__ . '/../utils/Response.php';

class AuthMiddleware
{
    public static function requireToken()
    {
        // Start with an empty header array
        $headers = [];

        // Try getallheaders() first (works on many SAPIs)
        if (function_exists('getallheaders')) {
            $headers = getallheaders();
        } elseif (function_exists('apache_request_headers')) {
            // Fallback to apache_request_headers if available
            $headers = apache_request_headers();
        }

        // Merge in headers built from $_SERVER (HTTP_* keys)
        $serverHeaders = self::getHeaders();
        $headers = array_merge($serverHeaders, $headers);

        // Try to find the Authorization header in several places
        $authHeader = '';

        if (isset($headers['Authorization'])) {
            $authHeader = $headers['Authorization'];
        } elseif (isset($headers['authorization'])) {
            $authHeader = $headers['authorization'];
        } elseif (isset($_SERVER['HTTP_AUTHORIZATION'])) {
            $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
        } elseif (isset($_SERVER['Authorization'])) {
            $authHeader = $_SERVER['Authorization'];
        } elseif (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
            $authHeader = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
        }

        if (!$authHeader) {
            Response::json(401, "Missing Authorization header");
        }

        // Expect "Bearer <token>"
        if (stripos($authHeader, 'Bearer ') !== 0) {
            Response::json(401, "Invalid Authorization format");
        }

        $token = trim(substr($authHeader, 7));

        try {
            return JwtHelper::verifyToken($token);
        } catch (Exception $e) {
            Response::json(401, "Invalid or expired token");
        }
    }

    // Build headers array from $_SERVER for CLI / PHP dev server
    private static function getHeaders()
    {
        $headers = [];
        foreach ($_SERVER as $key => $value) {
            if (substr($key, 0, 5) === 'HTTP_') {
                $name = str_replace(
                    ' ',
                    '-',
                    ucwords(strtolower(str_replace('_', ' ', substr($key, 5))))
                );
                $headers[$name] = $value;
            }
        }
        return $headers;
    }
}
