<?php

class Database
{
    // Declare properties so PHP 8.2 doesn’t create them dynamically
    private $host;
    private $db_name;
    private $username;
    private $password;

    public function __construct()
    {
        $envPath = __DIR__ . "/../.env";

        // Load .env variables
        $env = parse_ini_file($envPath);

        // In case parse_ini_file fails, avoid notices
        $this->host     = $env["DB_HOST"] ?? "127.0.0.1";
        $this->db_name  = $env["DB_NAME"] ?? "student_planner";
        $this->username = $env["DB_USER"] ?? "root";
        $this->password = $env["DB_PASS"] ?? "";
    }

    public function connect()
    {
        try {
            $dsn  = "mysql:host={$this->host};dbname={$this->db_name}";
            $conn = new PDO($dsn, $this->username, $this->password);
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            return $conn;

        } catch (PDOException $e) {
            // Don’t echo to the response, just log it
            error_log("Database connection error: " . $e->getMessage());
            return null;
        }
    }
}
