<?php 
require_once('db-connect.php');
if($_SERVER['REQUEST_METHOD'] !='POST'){
    echo "<script> alert('Error: No data to save.'); location.replace('./') </script>";
    $conn->close();
    exit;
}
extract($_POST);
$allday = isset($allday);

if(empty($id)){
    // Requête préparée pour l'INSERT
    $sql = "INSERT INTO `schedule_list` (`title`, `description`, `start_datetime`, `end_datetime`) VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    // Liaison des valeurs et exécution de la requête
    $stmt->bind_param("ssss", $title, $description, $start_datetime, $end_datetime);
}else{
   // Requête préparée pour l'UPDATE
    $sql = "UPDATE `schedule_list` SET `title` = ?, `description` = ?, `start_datetime` = ?, `end_datetime` = ? WHERE `id` = ?";
    $stmt = $conn->prepare($sql);
    // Liaison des valeurs et exécution de la requête
    $stmt->bind_param("ssssi", $title, $description, $start_datetime, $end_datetime, $id);
}


$save = $stmt->execute();

if($save){
    echo "<script> alert('Schedule Successfully Saved.'); location.replace('./') </script>";
}else{
    echo "<pre>";
    echo "An Error occured.<br>";
    echo "Error: ".$conn->error."<br>";
    echo "SQL: ".$sql."<br>";
    echo "</pre>";
}
$conn->close();

?>