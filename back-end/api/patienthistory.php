<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json");

include '../config/db.php';

$input = json_decode(file_get_contents("php://input"), true);
if (isset($input['id'])) {
    $id = intval($input['id']);
    $stmt = $con->prepare("SELECT ph.*, d.name AS doctor_name FROM patient_history ph JOIN doctors d ON ph.doctor_id = d.id WHERE ph.patient_id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $histories = [];
    while ($row = $result->fetch_assoc()) {
        $histories[] = $row;
    }

    echo json_encode($histories);
    $stmt->close();
} else {
    echo json_encode(["error" => "Invalid request"]);
}
?>