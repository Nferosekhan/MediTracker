<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header('Content-Type: application/json');

include '../config/db.php';

if ($_POST['id'] > 0) {
    $profile_pic = htmlspecialchars($_POST['hid_profile_pic'], ENT_QUOTES, 'utf-8');
    if (isset($_FILES['profile_pic']) && $_FILES['profile_pic']['error'] === 0) {
        $targetDir = "../uploads/";
        if (!is_dir($targetDir)) {
            mkdir($targetDir, 0777, true);
        }
        $fileName = basename($_FILES["profile_pic"]["name"]);
        $targetFile = $targetDir . time() . "_" . $fileName;

        if (move_uploaded_file($_FILES["profile_pic"]["tmp_name"], $targetFile)) {
            $profile_pic = $targetFile;
        }
    }

    $id = (int)$_POST['id'];
    $doctor_id = htmlspecialchars($_POST['doctor_id'], ENT_QUOTES, 'utf-8');
    $name = htmlspecialchars($_POST['name'], ENT_QUOTES, 'utf-8');
    $dob = htmlspecialchars($_POST['dob'], ENT_QUOTES, 'utf-8');
    $age = htmlspecialchars($_POST['age'], ENT_QUOTES, 'utf-8');
    $gender = htmlspecialchars($_POST['gender'], ENT_QUOTES, 'utf-8');
    $phone = htmlspecialchars($_POST['phone'], ENT_QUOTES, 'utf-8');
    $email = htmlspecialchars($_POST['email'], ENT_QUOTES, 'utf-8');
    $address = htmlspecialchars($_POST['address'], ENT_QUOTES, 'utf-8');
    $blood_group = htmlspecialchars($_POST['blood_group'], ENT_QUOTES, 'utf-8');
    $emergency_contact = htmlspecialchars($_POST['emergency_contact'], ENT_QUOTES, 'utf-8');
    $bp_sys = $_POST['blood_presure_systolic'] ?? '';
    $bp_dia = $_POST['blood_presure_diastolic'] ?? '';
    $sugar_fasting = $_POST['sugar_fasting_level'] ?? '';
    $sugar_post = $_POST['sugar_postprandial_level'] ?? '';
    $weight = $_POST['weight'] ?? '';
    $height = $_POST['height'] ?? '';
    $heart_rate = $_POST['heart_rate'] ?? '';
    $temperature = $_POST['temperature'] ?? '';
    $bmi = $_POST['bmi'] ?? '';
    $bmi_status = htmlspecialchars($_POST['bmi_status'], ENT_QUOTES, 'utf-8');
    $bmi_suggestion = htmlspecialchars($_POST['bmi_suggestion'], ENT_QUOTES, 'utf-8');

    $check = $con->prepare("SELECT id FROM patients WHERE id = ?");
    $check->bind_param("i", $id);
    $check->execute();
    $check->store_result();

    if ($check->num_rows == 1) {
        $update = $con->prepare("UPDATE patients SET name=?, dob=?, age=?, gender=?, phone=?, email=?, address=?, blood_group=?, emergency_contact=?, profile_pic=? WHERE id=?");
        $update->bind_param("ssisssssssi", $name, $dob, $age, $gender, $phone, $email, $address, $blood_group, $emergency_contact, $profile_pic, $id);

        if ($update->execute()) {
            $checkVitals = $con->prepare("SELECT id FROM vitals WHERE patient_id = ?");
            $checkVitals->bind_param("i", $id);
            $checkVitals->execute();
            $vitalResult = $checkVitals->get_result();
            $checkVitals->close();

            if ($vitalResult->num_rows > 0) {
                $updateVitals = $con->prepare("UPDATE vitals SET 
                    blood_presure_systolic=?, blood_presure_diastolic=?, sugar_fasting_level=?,
                    sugar_postprandial_level=?, weight=?, height=?, heart_rate=?, temperature=?, bmi=?, bmi_status=?, bmi_suggestion=? WHERE patient_id = ?");
                $updateVitals->bind_param("sssssssssssi", $bp_sys, $bp_dia, $sugar_fasting, $sugar_post, $weight, $height, $heart_rate, $temperature, $bmi, $bmi_status, $bmi_suggestion, $id);
                $updateVitals->execute();
                $updateVitals->close();
            } else {
                $insertVitals = $con->prepare("INSERT INTO vitals (
                    patient_id, blood_presure_systolic, blood_presure_diastolic, sugar_fasting_level,
                    sugar_postprandial_level, weight, height, heart_rate, temperature, bmi, bmi_status, bmi_suggestion
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                $insertVitals->bind_param("isssssssssss", $id, $bp_sys, $bp_dia, $sugar_fasting, $sugar_post, $weight, $height, $heart_rate, $temperature, $bmi, $bmi_status, $bmi_suggestion);
                $insertVitals->execute();
                $insertVitals->close();
            }
            $hisStmt = $con->prepare("INSERT INTO patient_history (doctor_id, patient_id, blood_presure_systolic, blood_presure_diastolic, sugar_fasting_level, sugar_postprandial_level, weight, height, heart_rate, temperature, bmi, bmi_status, bmi_suggestion) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $hisStmt->bind_param("iisssssssssss", $doctor_id, $id, $bp_sys, $bp_dia, $sugar_fasting, $sugar_post, $weight, $height, $heart_rate, $temperature, $bmi, $bmi_status, $bmi_suggestion);
            $hisStmt->execute();

            echo json_encode(["status" => true, "message" => "Patient Updated Successfully"]);
        } else {
            echo json_encode(["status" => false, "message" => "Something went wrong"]);
        }
        $update->close();
    } else {
        echo json_encode(["status" => false, "message" => "Bad attempt"]);
    }

    $check->close();
} else {
    echo json_encode(["status" => false, "message" => "Invalid Attempt"]);
}

$con->close();
?>