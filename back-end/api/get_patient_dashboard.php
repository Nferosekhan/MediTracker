<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
include '../config/db.php';

$patient_id = $_GET['id'];

$response = [];

$pstmt = $con->prepare("SELECT name, dob, gender, blood_group, profile_pic, age FROM patients WHERE id = ?");
$pstmt->bind_param("i", $patient_id);
$pstmt->execute();
$presult = $pstmt->get_result()->fetch_assoc();
$response['profile'] = $presult;

$vstmt = $con->prepare("SELECT weight, height, bmi, blood_presure_systolic, blood_presure_diastolic, sugar_fasting_level, sugar_postprandial_level, heart_rate, temperature FROM vitals WHERE patient_id = ? ORDER BY date_of_entry DESC LIMIT 1");
$vstmt->bind_param("i", $patient_id);
$vstmt->execute();
$vresult = $vstmt->get_result()->fetch_assoc();

$response['vitals'] = $vresult;

echo json_encode($response);
?>