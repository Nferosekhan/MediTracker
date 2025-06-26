<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header('Content-Type: application/json');
include '../config/db.php';

if ($_POST['email'] != "") {
    $profile_pic = "";
    if (isset($_FILES['profile_pic'])) {
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

    $doctor_id = htmlspecialchars($_POST['doctor_id'], ENT_QUOTES, 'utf-8');
    $name = htmlspecialchars($_POST['name'], ENT_QUOTES, 'utf-8');
    $dob = htmlspecialchars($_POST['dob'], ENT_QUOTES, 'utf-8');
    $age = htmlspecialchars($_POST['age'], ENT_QUOTES, 'utf-8');
    $gender = htmlspecialchars($_POST['gender'], ENT_QUOTES, 'utf-8');
    $phone = htmlspecialchars($_POST['phone'], ENT_QUOTES, 'utf-8');
    $email = htmlspecialchars($_POST['email'], ENT_QUOTES, 'utf-8');
    $password = htmlspecialchars(password_hash($_POST['password'], PASSWORD_DEFAULT), ENT_QUOTES, 'utf-8');
    $address = htmlspecialchars($_POST['address'], ENT_QUOTES, 'utf-8');
    $blood_group = htmlspecialchars($_POST['blood_group'], ENT_QUOTES, 'utf-8');
    $emergency_contact = htmlspecialchars($_POST['emergency_contact'], ENT_QUOTES, 'utf-8');

    $selstoredpass = $con->prepare("SELECT id FROM patients WHERE email = ?");
    $selstoredpass->bind_param("s", $email);
    $selstoredpass->execute();
    $selstoredpass->store_result();

    if ($selstoredpass->num_rows == 0) {
        $ins = $con->prepare("INSERT INTO patients SET name = ?, dob = ?, age = ?, gender = ?, phone = ?, email = ?, password = ?, address = ?, blood_group = ?, emergency_contact = ?, profile_pic = ?");
        $ins->bind_param("ssissssssss", $name, $dob, $age, $gender, $phone, $email, $password, $address, $blood_group, $emergency_contact, $profile_pic);

        if ($ins->execute()) {
            $patient_id = $ins->insert_id;

            $bp_systolic = $_POST['blood_presure_systolic'] ?? '';
            $bp_diastolic = $_POST['blood_presure_diastolic'] ?? '';
            $sugar_fasting = $_POST['sugar_fasting_level'] ?? '';
            $sugar_post = $_POST['sugar_postprandial_level'] ?? '';
            $weight = $_POST['weight'] ?? '';
            $height = $_POST['height'] ?? '';
            $heart_rate = $_POST['heart_rate'] ?? '';
            $temperature = $_POST['temperature'] ?? '';
            $bmi = $_POST['bmi'] ?? '';

            $vitalStmt = $con->prepare("INSERT INTO vitals (patient_id, blood_presure_systolic, blood_presure_diastolic, sugar_fasting_level, sugar_postprandial_level, weight, height, heart_rate, temperature, bmi) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $vitalStmt->bind_param("isssssssss", $patient_id, $bp_systolic, $bp_diastolic, $sugar_fasting, $sugar_post, $weight, $height, $heart_rate, $temperature, $bmi);
            if($vitalStmt->execute()){
                $hisStmt = $con->prepare("INSERT INTO patient_history (doctor_id, patient_id, blood_presure_systolic, blood_presure_diastolic, sugar_fasting_level, sugar_postprandial_level, weight, height, heart_rate, temperature, bmi) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                $hisStmt->bind_param("iisssssssss", $doctor_id, $patient_id, $bp_systolic, $bp_diastolic, $sugar_fasting, $sugar_post, $weight, $height, $heart_rate, $temperature, $bmi);
                $hisStmt->execute();
                echo json_encode(["status" => true, "message" => "Patient created successfully"]);
            }
            else{
                echo json_encode(["status" => false, "message" => "Something went wrong"]);
            }
        }
        else {
            echo json_encode(["status" => false, "message" => "Something went wrong"]);
        }
        $ins->close();
    }
    else {
        echo json_encode(["status" => false, "message" => "Email already exists"]);
    }

    $selstoredpass->close();
}
else {
    echo json_encode(["status" => false, "message" => "Invalid Attempt"]);
}

$con->close();
?>