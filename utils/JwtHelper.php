<?php

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class JwtHelper {
    private static $secret = "my-secret-should-remain-secret"; // change this

    public static function generateToken($userId, $email, $role) {
        $payload = [
            "iss" => "student-planner-api",
            "sub" => $userId,
            "email" => $email,
            "role" => $role,
            "iat" => time(),
            "exp" => time() + (60 * 60 * 24) // 24 hours
        ];

        return JWT::encode($payload, self::$secret, 'HS256');
    }

    public static function verifyToken($token) {
        return JWT::decode($token, new Key(self::$secret, 'HS256'));
    }
}