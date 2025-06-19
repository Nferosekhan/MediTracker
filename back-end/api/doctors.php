<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
include '../config/db.php';

if (isset($_GET['id'])) {
    $id = intval($_GET['id']);
    $stmt = $con->prepare("SELECT * FROM doctors WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($doctor = $result->fetch_assoc()) {
        echo json_encode($doctor);
    } else {
        echo json_encode(["error" => $id]);
    }
    
    $stmt->close();
}
else {
    $sql = $con->query("SELECT * FROM doctors");
    $doctors = [];
    while ($row = $sql->fetch_assoc()) {
        $doctors[] = $row;
    }
    echo json_encode($doctors);
}
?>