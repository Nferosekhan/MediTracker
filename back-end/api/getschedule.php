<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
include '../config/db.php';

if (isset($_GET['doctor_id'])) {
    $id = intval($_GET['doctor_id']);
    $stmt = $con->prepare("SELECT * FROM doctor_schedule WHERE doctor_id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();

    $schedule = [];
    while ($row = $result->fetch_assoc()) {
        $schedule[] = $row;
    }

    echo json_encode($schedule);
    $stmt->close();
} else {
    echo json_encode(["status" => false, "message" => "Id is not available to fetch the data"]);
}
?>