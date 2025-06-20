<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

require('../config/db.php');
require('../vendor/autoload.php');

$pdf = new \TCPDF();

$input = json_decode(file_get_contents("php://input"), true);

$appointment_id    = $input['appointment_id'] ?? null;
$status            = $input['status'] ?? '';
$patient_id        = $input['patient_id'] ?? null;
$doctor_id         = $input['doctor_id'] ?? null;
$visit_date        = date("Y-m-d H:i:s", strtotime($input['visit_date'] ?? ''));
$summary           = $input['summary'] ?? '';
$diagnosis         = $input['diagnosis'] ?? '';
$reminder_type     = $input['reminder_type'] ?? 'medicine';
$reminder_message  = $input['reminder_message'] ?? '';
$reminder_time     = $input['reminder_time'] ?? '';
$reminder_method   = $input['reminder_method'] ?? 'email';

$updateappointmentstatus = $con->prepare("UPDATE appointments SET status = ? WHERE id = ?");
$updateappointmentstatus->bind_param("si", $status, $appointment_id);
$updateappointmentstatus->execute();

$check = $con->prepare("SELECT id FROM prescriptions WHERE patient_id = ? AND doctor_id = ? AND appointment_id = ?");
$check->bind_param("iii", $patient_id, $doctor_id, $appointment_id);
$check->execute();
$check->store_result();

$pdf_filename = "";
$prescription_id = null;

if ($check->num_rows > 0) {
    $check->bind_result($prescription_id);
    $check->fetch();

    $update = $con->prepare("UPDATE prescriptions SET visit_date = ?, summary = ?, diagnosis = ? WHERE id = ?");
    $update->bind_param("sssi", $visit_date, $summary, $diagnosis, $prescription_id);
    $update->execute();
    $update->close();
}
else {
    $insert = $con->prepare("INSERT INTO prescriptions (patient_id, doctor_id, visit_date, summary, diagnosis, appointment_id) VALUES (?, ?, ?, ?, ?, ?)");
    $insert->bind_param("iisssi", $patient_id, $doctor_id, $visit_date, $summary, $diagnosis, $appointment_id);
    $insert->execute();
    $prescription_id = $insert->insert_id;
    $insert->close();
}
$check->close();

$doctorName = "";
$patientName = "";

$dstmt = $con->prepare("SELECT name FROM doctors WHERE id = ?");
$dstmt->bind_param("i", $doctor_id);
$dstmt->execute();
$dstmt->bind_result($doctorName);
$dstmt->fetch();
$dstmt->close();

$pstmt = $con->prepare("SELECT name FROM patients WHERE id = ?");
$pstmt->bind_param("i", $patient_id);
$pstmt->execute();
$pstmt->bind_result($patientName);
$pstmt->fetch();
$pstmt->close();

$formattedDate = date("d-m-Y h:i:s A", strtotime($visit_date));

$pdf->AddPage();
$pdf->SetFont('helvetica', '', 12);
$html = "
    <style>
      h2 { text-align: center; text-decoration: underline; margin-bottom: 15px; }
      .label { font-weight: bold; text-decoration: underline; }
      .section { margin-bottom: 12px; line-height:15px; }
    </style>

    <h2>Prescription</h2>

    <div class='section'><span class='label'>Patient Name:</span> $patientName</div><br>
    <div class='section'><span class='label'>Doctor Name:</span> $doctorName</div><br>
    <div class='section'><span class='label'>Visit Date:</span> $formattedDate</div><br>

    <div class='section'><span class='label'>Diagnosis:</span> $diagnosis</div><br>
    <div class='section'><span class='label'>Prescription Summary:</span> $summary</div>
";
$pdf->writeHTML($html, true, false, true, false, '');

$folder = __DIR__ . "/../uploads/prescriptions/";
if (!file_exists($folder)) {
    mkdir($folder, 0777, true);
}
$pdf_filename = "prescription_" . $prescription_id . ".pdf";
$full_path = $folder . $pdf_filename;
$pdf->Output($full_path, 'F');

$update = $con->prepare("UPDATE prescriptions SET prescription_file = ? WHERE id = ?");
$update->bind_param("si", $pdf_filename, $prescription_id);
$update->execute();
$update->close();

if (!empty($reminder_message) && !empty($reminder_time)) {
    $check2 = $con->prepare("SELECT id FROM reminder WHERE patient_id = ? AND appointment_id = ?");
    $check2->bind_param("ii", $patient_id, $appointment_id);
    $check2->execute();
    $check2->store_result();

    $method = in_array($reminder_method, ['email', 'sms', 'whatsapp']) ? $reminder_method : 'email';
    $type = in_array($reminder_type, ['medicine', 'appointment', 'test']) ? $reminder_type : 'medicine';
    $reminder_status = "pending";

    if ($check2->num_rows > 0) {
        $update2 = $con->prepare("UPDATE reminder SET type = ?, message = ?, method = ?, status = ?, trigger_time = ? WHERE patient_id = ? AND appointment_id = ?");
        $update2->bind_param("sssssii", $type, $reminder_message, $method, $reminder_status, $reminder_time, $patient_id, $appointment_id);
        $update2->execute();
        $update2->close();
    } else {
        $insert2 = $con->prepare("INSERT INTO reminder (patient_id, type, message, trigger_time, method, status, appointment_id) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $insert2->bind_param("isssssi", $patient_id, $type, $reminder_message, $reminder_time, $method, $reminder_status, $appointment_id);
        $insert2->execute();
        $insert2->close();
    }
    $check2->close();
}

echo json_encode([
    "status" => true,
    "message" => "Visit and PDF saved successfully.",
    "prescription_file" => "uploads/prescriptions/" . $pdf_filename
]);

$con->close();
?>