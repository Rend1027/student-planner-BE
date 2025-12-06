<?php

class User {
    private $conn;
    private $table = 'users';

    public $id;
    public $username;
    public $email;
    public $password;
    public $role;
    public $created_at;

    //ENUM values
    const ROLE_STUDENT = 'student';
    const ROLE_ADMIN = 'admin';

    public function __construct($db) {
        $this->conn = $db;
    }

    // Create User
    public function create($username, $email, $password, $role = self::ROLE_STUDENT) {
        $query = "INSERT INTO " . $this->table . "
                 (username, email, password, role, created_at)
                 VALUES (:username, :email, :password, :role, NOW())";
        $stmt = $this->conn->prepare($query);

        // Sanitize
        $username = htmlspecialchars(strip_tags($username));
        $email = htmlspecialchars(strip_tags($email));
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        // Bind params
        $stmt->bindParam(":username", $username);
        $stmt->bindParam(":email", $email);
        $stmt->bindParam(":password", $hashedPassword);
        $stmt->bindParam(":role", $role);

        if (!$stmt->execute()) {
            print_r($stmt->errorInfo());
            return false;
        }
        return true;
    }

    // find uUser by email
    public function findByEmail($email) {
        $query = "SELECT * FROM " . $this->table . " WHERE email = :email LIMIT 1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":email", $email);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    //VERIFY CREDENTIALS
    public function verifyPassword($email, $password) {
        $user = $this->findByEmail($email);

        if($user && password_verify($password, $user['password'])) {
            return $user;
        }
        
        return false;
    }
}