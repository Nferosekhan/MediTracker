<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
include '../config/db.php';

if (isset($_GET['id'])) {
    $id = intval($_GET['id']);
    $stmt = $con->prepare("SELECT * FROM medical_records WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($medical_records = $result->fetch_assoc()) {
        echo json_encode($medical_records);
    } else {
        echo json_encode(["error" => $id]);
    }
    
    $stmt->close();
}
else {
    $sql = $con->query("SELECT * FROM medical_records");
    $medical_records = [];
    while ($row = $sql->fetch_assoc()) {
        $medical_records[] = $row;
    }
    echo json_encode($medical_records);
}
?>