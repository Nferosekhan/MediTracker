<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header('Content-Type: application/json');
include '../config/db.php';

$data = json_decode(file_get_contents("php://input"), true);
$id = $data['idval'];
$patient_id = $data['patient_id'] ?? '';
$service_type = $data['service_type'];
$service_date = $data['service_date'];
$amount = $data['amount'];
$discount = $data['discount'];
$total = $data['total'];
$payment_status = $data['payment_status'];
$payment_mode = $data['payment_mode'];
$transaction_id = $data['transaction_id'];

$stmt = $con->prepare("UPDATE billing SET patient_id = ?, service_type = ?, service_date = ?, amount = ?, discount = ?, total = ?, payment_status = ?, payment_mode = ?, transaction_id = ? WHERE id = ?");
$stmt->bind_param("issssssssi", $patient_id, $service_type, $service_date, $amount, $discount, $total, $payment_status, $payment_mode, $transaction_id, $id);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Bill updated successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Update failed"]);
}

$stmt->close();
$con->close();
?>