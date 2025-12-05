<?php

require_once __DIR__ . "/AuthMiddleware.php";
require_once __DIR__ . "/../utils/Response.php";

class AdminMiddleware {

    public static function requireAdmin() {

        $auth = AuthMiddleware::requireToken(); // verify token first

        if ($auth->role !== "admin") {
            Response::json(403, "Admin access only");
        }

        return $auth; //admin info

    }


}