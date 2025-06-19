<?php
$con = mysqli_connect("localhost","root","","meditracksystem");

if ($con->connect_error) {
    die(json_encode(["status" => false, "message" => "Connection failed"]));
}
?>