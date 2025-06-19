<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
include '../config/db.php';
$data = json_decode(file_get_contents("php://input"), true);

$doctor_id = $con->real_escape_string($data['doctor_id']);
$patient_id = $con->real_escape_string($data['patient_id']);
$appointment_date = $con->real_escape_string($data['appointment_date']);
$reason = $con->real_escape_string($data['reason']);
$notes = isset($data['notes']) ? $con->real_escape_string($data['notes']) : "";

if (!$doctor_id || !$patient_id || !$appointment_date || !$reason) {
    echo json_encode(["status" => "error", "message" => "Missing required fields."]);
    exit;
}

$sql = "INSERT INTO appointments (doctor_id, patient_id, appointment_date, reason, notes,status) 
        VALUES ('$doctor_id', '$patient_id', '$appointment_date', '$reason', '$notes', 'upcoming')";

if ($con->query($sql) === TRUE) {

    $appointment_id = $con->insert_id;

    $sqlpr = "INSERT INTO prescriptions (doctor_id, patient_id, appointment_id) 
            VALUES ('$doctor_id', '$patient_id', '$appointment_id')";

    if ($con->query($sqlpr) === TRUE){

        $sqlrm = "INSERT INTO reminder (patient_id, appointment_id) 
                VALUES ('$patient_id', '$appointment_id')";

        if ($con->query($sqlrm) === TRUE){
            echo json_encode(["status" => "success", "message" => "Appointment booked successfully."]);
        }
    }
} else {
    echo json_encode(["status" => "error", "message" => "Error booking appointment: " . $con->error]);
}

$con->close();
?>