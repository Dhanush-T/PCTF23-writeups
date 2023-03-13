<?php 
    error_reporting(0);
    include('../includes/flag.php');

    class Validate {
        public $key;
    }

    class Admin {
        private $name;
        private $secret1;
        private $secret2;

        function __construct($name, $secret1, $secret2){
            $this->name = $name;
            $this->secret1 = $secret1;
            $this->secret2 = $secret2;
        }
        function __wakeup(){
            if(strlen($this->name) == 10 &&
            strcmp($this->name, "admin") &&
            $this->secret1 === $this->secret2 &&
            md5($this->secret2->key) == 23) {
            print FLAG;
            }
        }
    }

    class User {
        private $name;
        private $password;
        function __construct($name, $password){
            $this->name = $name;
            $this->password = $password;
        }

        function __wakeup(){
            if($this->name === "Jaiden" && $this->password === "cool_password_yo")
                include('../includes/user_files.php');
            else{
                setcookie('user', false);
                header("Location: index.php");
                die();
            }
        }
    }
?>