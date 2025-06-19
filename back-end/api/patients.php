<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
include '../config/db.php';

if (isset($_GET['id'])) {
    $id = intval($_GET['id']);
    $stmt = $con->prepare("SELECT p.*,v.* FROM patients p,vitals v WHERE p.id = ? AND v.patient_id = ?");
    $stmt->bind_param("ii", $id, $id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($patient = $result->fetch_assoc()) {
        echo json_encode($patient);
    } else {
        echo json_encode(["error" => $id]);
    }
    
    $stmt->close();
}
else {
    $sql = $con->query("SELECT * FROM patients");
    $patients = [];
    while ($row = $sql->fetch_assoc()) {
        $patients[] = $row;
    }
    echo json_encode($patients);
}
?>