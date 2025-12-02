<?php

require_once __DIR__ . "/../models/User.php";
require_once __DIR__ . "/../utils/Response.php";

class AuthController {
    private $conn;
    private $userModel;

    public function __construct($db) {
        $this->conn = $db;
        $this->userModel = new User($db);
    }

    // Register User

    public function register() {
        $input = json_decode(file_get_contents("php://input"), true);

        if(!isset($input["username"], $input["email"], $input["password"])) {
            Response::json(400, "Missing required fields (username, email, password");
        }

        $username = trim($input["username"]);
        $email = trim($input["email"]);
        $password = $input["password"];
        $role = User::ROLE_STUDENT; // default role

        // Check if email already exists
        if ($this->userModel->findByEmail($email)) {
            Response::json(409, "Email already in use");
        }

        // Create user
        $created = $this->userModel->create($username, $email, $password, $role);

        if($created) {
            Response::json(500, "Failed to create user");
        }
        Response::json(201, "User registered successfully");
    }

    // Login user
    public function login() {
        $input = json_decode(file_get_contents("php://input"), true);

        if (!isset($input["email"], $input["password"])) {
            Response::json(400, "Missing required fields (email, password)");
        }

        $email = trim($input["email"]);
        $password = $input["password"];

        // Verify credentials
        $user = $this->userModel->verifyPassword($email, $password);

        if (!$user) {
            Response::json(401, "invalid email or password");
        }

        // Remove password from response
        unset($user["password"]);

        Response::json(200, "Login successful", $user);
    }
}