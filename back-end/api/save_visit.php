<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

include '../config/db.php';

$appointment_id = $_POST['appointment_id'];
$status = $_POST['status'];
$patient_id = $_POST['patient_id'];
$doctor_id = $_POST['doctor_id'];
$visit_date = $_POST['visit_date'];
$summary = $_POST['summary'];
$diagnosis = $_POST['diagnosis'];

$reminder_type = $_POST['reminder_type'];
$reminder_message = $_POST['reminder_message'];
$reminder_time = $_POST['reminder_time'];
$reminder_method = $_POST['reminder_method'];

$filename = "";
if (isset($_FILES['prescription_file']) && $_FILES['prescription_file']['error'] === 0) {
    $file = $_FILES['prescription_file'];
    $filename = uniqid() . "_" . basename($file['name']);
    move_uploaded_file($file['tmp_name'], "../uploads/" . $filename);
}
$updateappointmentstatus = $con->prepare("UPDATE appointments SET status = ? WHERE id = ?");
$updateappointmentstatus->bind_param("si", $status, $appointment_id);
$updateappointmentstatus->execute();

$check = $con->prepare("SELECT id FROM prescriptions WHERE patient_id = ? AND doctor_id = ? AND appointment_id = ?");
$check->bind_param("iii", $patient_id, $doctor_id, $appointment_id);
$check->execute();
$check->store_result();

if ($check->num_rows > 0) {
    if ($filename !== "") {
        $update = $con->prepare("UPDATE prescriptions SET visit_date = ?,summary = ?, diagnosis = ?, prescription_file = ? WHERE patient_id = ? AND doctor_id = ? AND appointment_id = ?");
        $update->bind_param("ssssiii", $visit_date, $summary, $diagnosis, $filename, $patient_id, $doctor_id, $appointment_id);
    }
    else {
        $update = $con->prepare("UPDATE prescriptions SET visit_date = ?,summary = ?, diagnosis = ? WHERE patient_id = ? AND doctor_id = ? AND appointment_id = ?");
        $update->bind_param("sssiii", $visit_date, $summary, $diagnosis, $patient_id, $doctor_id, $appointment_id);
    }
    $update->execute();
    $update->close();
}
else {
    $insert = $con->prepare("INSERT INTO prescriptions (patient_id, doctor_id, visit_date, summary, diagnosis, prescription_file, appointment_id) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $insert->bind_param("iissssi", $patient_id, $doctor_id, $visit_date, $summary, $diagnosis, $filename, $appointment_id);
    $insert->execute();
    $insert->close();
}
$check->close();

if (!empty($reminder_message) && !empty($reminder_time)) {
    $check2 = $con->prepare("SELECT id FROM reminder WHERE patient_id = ? AND appointment_id = ?");
    $check2->bind_param("ii", $patient_id, $appointment_id);
    $check2->execute();
    $check2->store_result();

    $method = in_array($reminder_method, ['email', 'sms', 'whatsapp']) ? $reminder_method : 'email';
    $type = in_array($reminder_type, ['medicine', 'appointment', 'test']) ? $reminder_type : 'medicine';
    $status = "pending";

    if ($check2->num_rows > 0) {
        $update2 = $con->prepare("UPDATE reminder SET type = ?, message = ?, method = ?, status = ?, trigger_time = ? WHERE patient_id = ? AND appointment_id = ?");
        $update2->bind_param("sssssii", $type, $reminder_message, $method, $status, $reminder_time, $patient_id, $appointment_id);
        $update2->execute();
        $update2->close();
    }
    else {
        $insert2 = $con->prepare("INSERT INTO reminder (patient_id, type, message, trigger_time, method, status, appointment_id) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $insert2->bind_param("isssssi", $patient_id, $type, $reminder_message, $reminder_time, $method, $status, $appointment_id);
        $insert2->execute();
        $insert2->close();
    }
    $check2->close();
}

echo json_encode(["status" => true, "message" => "Visit and reminder saved successfully."]);
$con->close();
?>