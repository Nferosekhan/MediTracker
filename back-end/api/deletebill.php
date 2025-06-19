<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header('Content-Type: application/json');
include '../config/db.php';
$data = json_decode(file_get_contents("php://input"), true);
if($data['id']!=""){
    $id = htmlspecialchars($data['id'],ENT_QUOTES,'utf-8');
    $sql = $con->prepare("DELETE FROM billing WHERE id = ?");
    $sql->bind_param("i", $id);
    if($sql->execute()){
        echo json_encode(["status" => true, "message" => "Successfully Deleted"]);
    }
    else{
        echo json_encode(["status" => false, "message" => "Can't Delete This"]);
    }
}
else{
    echo json_encode(["status" => false, "message" => "Can't Delete This"]);
}
?>