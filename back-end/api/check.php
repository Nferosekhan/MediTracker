<?php
$plainPassword = '123';

// Generate hash
$hash = password_hash($plainPassword, PASSWORD_DEFAULT);
echo "Generated Hash: " . $hash . "<br>";

// Verify against the same password
if (password_verify($plainPassword, $hash)) {
    echo "Password is valid!";
} else {
    echo "Invalid password.";
}
?>