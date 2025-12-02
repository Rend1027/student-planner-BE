<?php

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class JwtHelper {
    private static $secret = "4b!xpPG^eL1Z@h6Q8Rzo!wZ9sKwvcL"; // cahng this

    public static function generateToken($userId, $email) {
        $payload = [
            "iss" => "student-planner-api",
            "sub" => $userId,
            "email" => $email,
            "iat" => time(),
            "exp" => time() + (60 * 60 * 24) // 24 hours
        ];

        return JWT::encode($payload, self::$secret, 'HS256');
    }

    public static function verifyToken($token) {
        return JWT::decode($token, new Key(self::$secret, 'HS256'));
    }
}