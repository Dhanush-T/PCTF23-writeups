require('dotenv').config()

var crypto = require('crypto'),
    algorithm = process.env.ALGORITHM,
    password = process.env.SECRET;


function decrypt(text){
  var decipher = crypto.createDecipher(algorithm,password)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}

module.exports = decrypt