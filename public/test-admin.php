<?php

$plain = "admin123";
$hash = '$2y$10$7Ikc4T45JpHg0LrQBuOgnO9hyeH4lNsewijxBp2yq1t2uMJVvJ5u2';

if (password_verify($plain, $hash)) {
    echo "OK: Hash matches\n";
} else {
    echo "ERROR: Hash does NOT match\n";
}