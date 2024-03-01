<?php
$host     = 'localhost';
$username = 'root';
$password = '';
$dbname   ='iot';

$conn = new mysqli($host, $username, $password, $dbname);
if(!$conn){
    die("Cannot connect to the database.". $conn->error);
}