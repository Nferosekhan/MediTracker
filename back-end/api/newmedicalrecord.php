<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header('Content-Type: application/json');
include '../config/db.php';

$patient_id = $_POST['patient_id'] ?? '';
$title = $_POST['title'] ?? '';
$record_type = $_POST['record_type'] ?? '';
$record_date = $_POST['record_date'] ?? '';
$description = $_POST['description'] ?? '';
$record_file = "";

if (isset($_FILES['record_file'])) {
    $targetDir = "../uploads/";
    if (!is_dir($targetDir)) {
        mkdir($targetDir, 0777, true);
    }
    $fileName = uniqid() . "_" . basename($_FILES["record_file"]["name"]);
    $targetPath = $targetDir . $fileName;

    if (move_uploaded_file($_FILES["record_file"]["tmp_name"], $targetPath)) {
        $record_file = $fileName;
    }
}

$stmt = $con->prepare("INSERT INTO medical_records (patient_id, title, record_type, record_date, record_file, description) VALUES (?, ?, ?, ?, ?, ?)");
$stmt->bind_param("isssss", $patient_id, $title, $record_type, $record_date, $record_file, $description);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Medical record added successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to add record"]);
}

$stmt->close();
$con->close();
?>