1. Install PHP 8.2+
2. Install MySQL
3. Create database:
   CREATE DATABASE student_planner;

4. Run schema:
   mysql -u root -p student_planner < database/schema.sql

5. Start backend:
   php -S localhost:8000 -t public

6. Use Postman to test /api/register and /api/login