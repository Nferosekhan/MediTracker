<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header('Content-Type: application/json');
include '../config/db.php';

$id = $_POST['id'];
$title = $_POST['title'];
$record_type = $_POST['record_type'];
$record_date = $_POST['record_date'];
$description = $_POST['description'];
$existing_file = $_POST['hid_file'] ?? '';
$record_file = $existing_file;

if (isset($_FILES['record_file']) && $_FILES['record_file']['error'] === UPLOAD_ERR_OK) {
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

$stmt = $con->prepare("UPDATE medical_records SET title = ?, record_type = ?, record_date = ?, record_file = ?, description = ? WHERE id = ?");
$stmt->bind_param("sssssi", $title, $record_type, $record_date, $record_file, $description, $id);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Medical record updated successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Update failed"]);
}

$stmt->close();
$con->close();
?>