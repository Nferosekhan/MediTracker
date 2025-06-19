<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header('Content-Type: application/json');
include '../config/db.php';
if($_POST['email']!=""){
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
	$name = htmlspecialchars($_POST['name'],ENT_QUOTES,'utf-8');
	$email = htmlspecialchars($_POST['email'],ENT_QUOTES,'utf-8');
	$password = htmlspecialchars(password_hash($_POST['password'], PASSWORD_DEFAULT),ENT_QUOTES,'utf-8');
	$specialization = htmlspecialchars($_POST['specialization'],ENT_QUOTES,'utf-8');
	$degree = htmlspecialchars($_POST['degree'],ENT_QUOTES,'utf-8');
	$experience_years = htmlspecialchars($_POST['experience_years'],ENT_QUOTES,'utf-8');
	$license_number = htmlspecialchars($_POST['license_number'],ENT_QUOTES,'utf-8');
	$working_hours = htmlspecialchars($_POST['working_hours'],ENT_QUOTES,'utf-8');
	$selstoredpass = $con->prepare("SELECT id FROM doctors WHERE email = ?");
	$selstoredpass->bind_param("s", $email);
	$selstoredpass->execute();
	$selstoredpass->store_result();
	if($selstoredpass->num_rows==0){
		$ins = $con->prepare("INSERT INTO doctors SET name = ?, email = ?, password = ?, specialization = ?, degree = ?, experience_years = ?, license_number = ?, working_hours = ?, profile_pic = ?");
		$ins->bind_param("sssssisss", $name, $email, $password, $specialization, $degree, $experience_years, $license_number, $working_hours, $profile_pic);
		if($ins->execute()){
			echo json_encode(["status" => true, "message" => "Doctor created successfully"]);
		}
		else{
			echo json_encode(["status" => false, "message" => "Something went wrong"]);
		}
	}
	else{
		echo json_encode(["status" => false, "message" => "Email already exists"]);
	}
	$selstoredpass->close();
}
else{
	echo json_encode(["status" => false, "message" => "Invalid Attempt"]);
}
?>