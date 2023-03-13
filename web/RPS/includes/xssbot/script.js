const jwt = require('jsonwebtoken')
require('dotenv').config()

var crypto = require('crypto'),
    algorithm = process.env.ALGORITHM,
    password = process.env.SECRET;

function encrypt(text){
  var cipher = crypto.createCipher(algorithm,password)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}

const hash  = encrypt(process.env.ADMIN_PASSWORD)
console.log(process.env.ADMIN_PASSWORD)
console.log(jwt.sign({name: 'admin', password: hash, email:process.env.ADMIN_EMAIL}, process.env.SECRET))
