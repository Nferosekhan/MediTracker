<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
include '../config/db.php';

$sql = "SELECT a.id, p.name AS patient_name, d.name AS doctor_name, a.appointment_date, a.status FROM appointments a LEFT JOIN patients p ON a.patient_id = p.id LEFT JOIN doctors d ON a.doctor_id = d.id WHERE a.status='completed' ORDER BY a.appointment_date DESC";

$result = $con->query($sql);

$appointments = [];
while ($row = $result->fetch_assoc()) {
    $appointments[] = $row;
}

echo json_encode($appointments);
?>