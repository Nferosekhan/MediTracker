<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
include '../config/db.php';

if (isset($_GET['id'])) {
    $appointmentId = $_GET['id'];

    $sql = "SELECT a.id,a.appointment_date,a.reason,a.notes,a.status,a.patient_id,a.doctor_id,p.name AS patient_name,p.gender,p.age,pr.summary,pr.diagnosis,pr.prescription_file,rm.type,rm.message,rm.trigger_time,rm.method,p.phone AS patient_phone,d.name AS doctor_name,d.specialization FROM appointments a JOIN patients p ON a.patient_id = p.id JOIN doctors d ON a.doctor_id = d.id JOIN prescriptions pr ON pr.patient_id = p.id AND pr.appointment_id = ? AND pr.doctor_id = d.id JOIN reminder rm ON rm.patient_id = p.id AND rm.appointment_id = ? WHERE a.id = ?";

    $stmt = $con->prepare($sql);
    $stmt->bind_param("iii", $appointmentId, $appointmentId, $appointmentId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $appointmentDetails = $result->fetch_assoc();
        echo json_encode($appointmentDetails);
    } else {
        echo json_encode(["error" => "Appointment not found"]);
    }

    $stmt->close();
} else {
    echo json_encode(["error" => "Invalid appointment ID"]);
}

$con->close();
?>