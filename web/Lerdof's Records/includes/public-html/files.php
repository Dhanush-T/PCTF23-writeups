<?php 
include('classes.php');

if($_SERVER['REQUEST_METHOD'] === 'GET'){
    if(isset($_COOKIE['user'])) {
        try {
            $token = unserialize(base64_decode($_COOKIE['user']));
            if(!($token instanceof User || $token instanceof Admin)){
                setcookie('user', false);
                header("Location: index.php");
                die();
            }
        } catch (\Throwable $th) {
            setcookie('user', false);
            print "Invalid Credentials";
            throw $th;
        }
    }
    else {
        setcookie('user', false);
        header("Location: index.php");
        die();
    }
} else {
    setcookie('user', false);
    print "Invalid Request";
}
?>