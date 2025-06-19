<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

include '../config/db.php';

$doctor_id = $_GET['doctor_id'] ?? 0;
$date = $_GET['date'] ?? '';
$stmt = $con->prepare("SELECT TIME_FORMAT(appointment_date, '%H:%i') as time FROM appointments WHERE doctor_id = ? AND DATE(appointment_date) = ? AND status != 'cancelled'");
$stmt->bind_param("is", $doctor_id, $date);
$stmt->execute();
$result = $stmt->get_result();

$times = [];
while ($row = $result->fetch_assoc()) {
    $times[] = $row;
}

echo json_encode($times);
$stmt->close();
$con->close();
?>