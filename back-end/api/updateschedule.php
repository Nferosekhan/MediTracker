<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");
include '../config/db.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !is_array($data) || count($data) === 0) {
    echo json_encode(["status" => false, "message" => "Invalid input"]);
    exit;
}

$successCount = 0;

foreach ($data as $entry) {
    $doctor_id = htmlspecialchars($entry['doctor_id'], ENT_QUOTES, 'utf-8');
    $day = htmlspecialchars($entry['day'], ENT_QUOTES, 'utf-8');
    $start_time = htmlspecialchars($entry['start_time'], ENT_QUOTES, 'utf-8');
    $end_time = htmlspecialchars($entry['end_time'], ENT_QUOTES, 'utf-8');

    $max_patients = htmlspecialchars($entry['max_patients'], ENT_QUOTES, 'utf-8');

    $check = $con->prepare("SELECT id FROM doctor_schedule WHERE doctor_id = ? AND day = ?");
    $check->bind_param("is", $doctor_id, $day);
    $check->execute();
    $check->store_result();

    if ($check->num_rows > 0) {
        $update = $con->prepare("UPDATE doctor_schedule SET start_time = ?, end_time = ?, max_patients = ? WHERE doctor_id = ? AND day = ?");
        $update->bind_param("ssiis", $start_time, $end_time, $max_patients, $doctor_id, $day);
        if ($update->execute()) $successCount++;
        $update->close();
    }
    else {
        $insert = $con->prepare("INSERT INTO doctor_schedule (doctor_id, day, start_time, end_time, max_patients) VALUES (?, ?, ?, ?, ?)");
        $insert->bind_param("isssi", $doctor_id, $day, $start_time, $end_time, $max_patients);
        if ($insert->execute()) $successCount++;
        $insert->close();
    }

    $check->close();
}

echo json_encode([
    "status" => true,
    "message" => "$successCount schedule(s) saved/updated"
]);
?>