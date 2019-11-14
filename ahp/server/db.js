var mysql = require('mysql');
let config = require('./config');
let connection = mysql.createConnection(config);


connection.connect(function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log("Connected!");
  }
});


module.exports = connection;