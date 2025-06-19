<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header('Content-Type: application/json');
include '../config/db.php';
$data = json_decode(file_get_contents("php://input"), true);
if($data['type']=="doctor"){
    $id = htmlspecialchars($data['id'],ENT_QUOTES,'utf-8');
    $status = htmlspecialchars($data['status'],ENT_QUOTES,'utf-8');
    $sql = $con->prepare("UPDATE doctors SET status = ? WHERE id = ?");
    $sql->bind_param("si", $status, $id);
    if($sql->execute()){
        echo json_encode(["status" => true, "message" => "Successfully Updated"]);
    }
    else{
        echo json_encode(["status" => false, "message" => "Can't Update This"]);
    }
}
else if($data['type']=="patient"){
    $id = htmlspecialchars($data['id'],ENT_QUOTES,'utf-8');
    $status = htmlspecialchars($data['status'],ENT_QUOTES,'utf-8');
    $sql = $con->prepare("UPDATE patients SET status = ? WHERE id = ?");
    $sql->bind_param("si", $status, $id);
    if($sql->execute()){
        echo json_encode(["status" => true, "message" => "Successfully Updated"]);
    }
    else{
        echo json_encode(["status" => false, "message" => "Can't Update This"]);
    }
}
else{
    echo json_encode(["status" => false, "message" => "Invalid Attempt"]);
}
?>