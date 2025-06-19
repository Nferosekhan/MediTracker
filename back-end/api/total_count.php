<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
include '../config/db.php';
$resultdoctor = $con->query("SELECT COUNT(*) as total FROM doctors");
$rowdoctor = $resultdoctor->fetch_assoc();
$resultpatient = $con->query("SELECT COUNT(*) as total FROM patients");
$rowpatient = $resultpatient->fetch_assoc();
echo json_encode(['total_doctors' => $rowdoctor['total'],'total_patients' => $rowpatient['total']]);
?>