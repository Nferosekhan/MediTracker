<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header('Content-Type: application/json');
include '../config/db.php';

$patient_id = $_POST['patient_id'] ?? '';
$service_type = $_POST['service_type'];
$service_date = $_POST['service_date'];
$amount = $_POST['amount'];
$discount = $_POST['discount'];
$total = $_POST['total'];
$payment_status = $_POST['payment_status'];
$payment_mode = $_POST['payment_mode'];
$transaction_id = $_POST['transaction_id'];

$stmt = $con->prepare("INSERT INTO billing (patient_id, service_type, service_date, amount, discount, total, payment_status, payment_mode, transaction_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("issssssss", $patient_id, $service_type, $service_date, $amount, $discount, $total, $payment_status, $payment_mode, $transaction_id);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Bill added successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to add record"]);
}

$stmt->close();
$con->close();
?>