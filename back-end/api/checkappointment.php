<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
include '../config/db.php';
$today = date('Y-m-d');
$sql = "SELECT a.*,d.* FROM appointments a LEFT JOIN patients p ON a.patient_id = p.id LEFT JOIN doctors d ON a.doctor_id = d.id WHERE DATE(a.appointment_date) >= '$today' AND a.status!='completed' ORDER BY a.appointment_date DESC LIMIT 1";

$result = $con->query($sql);

$appointments = [];
while ($row = $result->fetch_assoc()) {
    $appointments[] = $row;
}

echo json_encode(["appointment" => $appointments]);
?>