<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
include '../config/db.php';

$query = "
  SELECT 
    prescriptions.id, prescriptions.visit_date, prescriptions.prescription_file,
    patients.name AS patient_name,
    doctors.name AS doctor_name
  FROM prescriptions
  JOIN patients ON prescriptions.patient_id = patients.id
  JOIN doctors ON prescriptions.doctor_id = doctors.id
  ORDER BY prescriptions.visit_date DESC
";

$result = $con->query($query);
$prescriptions = [];

while ($row = $result->fetch_assoc()) {
    $prescriptions[] = $row;
}

echo json_encode($prescriptions);
?>