<?php
use Firebase\JWT\JWT;
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header('Content-Type: application/json');
require_once '../helpers/jwt_helper.php';
include '../config/db.php';
if($_POST['username']!="" && $_POST['password']!=""){
	$username = htmlspecialchars($_POST['username'],ENT_QUOTES,'utf-8');
	$password = htmlspecialchars($_POST['password'],ENT_QUOTES,'utf-8');
	$usertype = htmlspecialchars($_POST['usertype'],ENT_QUOTES,'utf-8');
	$rememberme = htmlspecialchars($_POST['rememberme'],ENT_QUOTES,'utf-8');
	$selstoredpass = $con->prepare("SELECT id,email,password,name FROM $usertype WHERE email = ?");
	$selstoredpass->bind_param("s", $username);
	$selstoredpass->execute();
	$selstoredpass->store_result();
	if($selstoredpass->num_rows>0){
		$selstoredpass->bind_result($id,$email,$hashed_password,$name);
    	$selstoredpass->fetch();
		if(password_verify($password, $hashed_password)){
			$payload = array(
            "id" => $id,
            "email" => $email,
            "usertype" => $usertype,
            "name" => $name,
            "iat" => time(),
            "exp" => time() + (60 * 60 * 24)
         );

         $jwt = JWT::encode($payload, 'meditrackproject', 'HS256');

			echo json_encode(["status" => true, "message" => "Login successful", "token" => $jwt, "usertype" => $usertype, "rememberme" => $rememberme]);
		}
		else{
			echo json_encode(["status" => false, "message" => "Invalid Password"]);
		}
	}
	else{
		echo json_encode(["status" => false, "message" => "Invalid Username"]);
	}
	$selstoredpass->close();
}
else{
	echo json_encode(["status" => false, "message" => "Invalid Attempt"]);
}
?>