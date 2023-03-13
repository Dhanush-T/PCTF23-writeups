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
 

module.exports = encrypt