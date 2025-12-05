<?php
class Database {

    public function __construct() {
        // Load .env variables
        $env = parse_ini_file(__DIR__ . "/../.env");
        $this->host = $env["DB_HOST"];
        $this->db_name = $env["DB_NAME"];
        $this->username = $env["DB_USER"];
        $this->password = $env["DB_PASS"];
    }

    public function connect() {
        try {
            $dsn = "mysql:host={$this->host};dbname={$this->db_name}";
            $conn = new PDO($dsn, $this->username, $this->password);
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            return $conn;

        } catch (PDOException $e) {
            echo "Database connection error: " . $e->getMessage();
            return null;
        }
    }
}