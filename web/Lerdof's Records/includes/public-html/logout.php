<?php 
if($_SERVER['REQUEST_METHOD'] === 'GET'){
    setcookie('user', false);
    header("Location: index.php");
    die();
}
?>