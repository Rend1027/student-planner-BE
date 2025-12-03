🚀 1. Requirements

Before running this project, install:

✔ PHP 8.2 or higher
✔ MySQL Server
✔ Composer (PHP dependency manager)
✔ Postman or Thunder Client (VS Code)

If using WSL (recommended):

sudo apt update
sudo apt install php-cli php-mysql mysql-server unzip curl -y


Install Composer:

curl -sS https://getcomposer.org/installer -o composer-setup.php
sudo php composer-setup.php --install-dir=/usr/local/bin --filename=composer

🗄️ 2. Install Project Dependencies

Inside the project folder:

composer install


This installs:

firebase/php-jwt for JWT authentication

Any future PHP dependencies

🛢️ 3. Set Up the Database
Start MySQL:
sudo service mysql start

Log into MySQL:
mysql -u root -p

Create the database and tables:

Run the contents of:

database/schema.sql


Example:

CREATE DATABASE IF NOT EXISTS student_planner;
USE student_planner;

-- tables...

(Optional) Insert a sample user:
INSERT INTO users (username, email, password, role)
VALUES ('demo', 'demo@example.com', 
        '$2y$10$wq9e4kq0g/1vVW5pBmxRquCGS18WDiE3tS2XvY3Bz3F4q1nr4Uf4i',
        'student');


The above password is "password" (hashed using bcrypt).

🔐 4. Configure JWT Secret (important)

Open:

utils/JwtHelper.php


Find:

private static $secret = "SUPER_SECRET_KEY_CHANGE_THIS";


Replace with a strong random key:

openssl rand -base64 32


Example:

private static $secret = "4b!xpPG^eL1Z@h6Q8Rzo!wZ9sKwvcL";

🏁 5. Start the Backend Server

From the project root:

php -S localhost:8000 -t public


This makes the API available at:

http://localhost:8000/

🔥 6. API Routes
🔐 Authentication
Register

POST /api/register

Body:

{
  "username": "test",
  "email": "test@example.com",
  "password": "123456"
}

Login

POST /api/login

Response includes a JWT token:

{
  "token": "eyJhbGciOiJIUzI1..."
}


Use this for all protected routes:

Authorization: Bearer <token>

📅 Events (Classes + Schedules)
Create Event

POST /api/events/create

Body:

{
  "title": "CSC 350",
  "description": "Software Development",
  "day_of_week": "mon",
  "start_time": "10:00:00",
  "end_time": "11:15:00",
  "type": "class"
}

Get All Events

GET /api/events

Update Event

PUT /api/events/update

Body:

{
  "id": 1,
  "title": "CSC 350 - Updated",
  "day_of_week": "wed",
  "start_time": "12:00:00",
  "end_time": "13:15:00",
  "type": "class"
}

Delete Event

DELETE /api/events/delete

Body:

{
  "id": 3
}

🧠 7. Conflict Detection

When creating or updating an event, the backend checks for time conflicts:

{
  "success": false,
  "message": "This event conflicts with another scheduled item",
  "data": {
    "conflict_with": {
      "title": "CSC 350",
      "start_time": "10:00:00",
      "end_time": "11:15:00"
    }
  }
}

👨‍💻 8. Project Structure
student-planner-backend/
  ├── config/
  │     └── database.php
  ├── controllers/
  │     ├── AuthController.php
  │     └── EventController.php
  ├── models/
  │     └── Event.php
  ├── utils/
  │     ├── Router.php
  │     ├── Response.php
  │     └── JwtHelper.php
  ├── middleware/
  │     └── AuthMiddleware.php
  ├── public/
  │     └── index.php   <-- API entrypoint
  ├── vendor/
  └── database/
        └── schema.sql

📦 9. Git Workflow
Save changes:
git add .
git commit -m "Your message"

Push changes:
git push origin main

🎉 10. You're ready to build the frontend!

Use:

React

Vanilla JS

Or any frontend you like

Frontend will call the backend using:

fetch("http://localhost:8000/api/events")


with the JWT token in headers.