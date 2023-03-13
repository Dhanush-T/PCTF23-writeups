<?php
include('classes.php');
if($_SERVER['REQUEST_METHOD'] === 'POST') {
    if(!isset($_COOKIE['user'])){
        if(isset($_POST['username']) && isset($_POST['password'])) {
            $username = trim($_POST['username']);   
            $password = trim($_POST['password']);
            setcookie('user', base64_encode(serialize(new User($username, $password))), time() + 3600, "/");
            header("Location: files.php");
            die();
        }
        else {
            setcookie('user', false);
            header("Location: index.php");
            die();
        }
    }
    else {
        header("Location: files.php");
        die();
    }
   
}
else if($_SERVER['REQUEST_METHOD'] === 'GET') {
    if(!isset($_COOKIE['user']))
        include('../includes/main.html');
    else{
        header("Location: files.php");
        die();
    }
}
