var express = require('express');
var app = express();

var cfenv = require('cfenv');

// Util is handy to have around, so thats why that's here.
const util = require('util');
// and so is assert
const assert = require('assert');

var mysql = require('mysql');

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// Within the application environment (appenv) there's a services object
var services = appEnv.services;

// The services object is a map named by service so we extract the one for Compose for MySQL
var mysql_services = services["compose-for-mysql"];

// This check ensures there is a services for MySQL databases
assert(!util.isUndefined(mysql_services), "Must be bound to compose-for-mysql services");

// We now take the first bound Compose for MySQL database service and extract it's credentials object
var credentials = mysql_services[0].credentials;

var connectionString = credentials.uri;

// set up a new connection using our config details
var connection = mysql.createConnection(credentials.uri);

/*
//delete database table
connection.connect(function(err) {
  if (err) {
   console.log(err);
  } else {
    connection.query('DROP TABLE fb_info_table', function (err, result) {      if (err) {
        console.log(err)
      }
    });
  }
});
*/

module.exports.databaseconnection = function(){
  connection.connect(function(err) {
    if (err) {
     console.log(err);
    } else {
      connection.query('CREATE TABLE fb_info_table (id int auto_increment primary key, name varchar(256) NOT NULL, surname varchar(256) NOT NULL, email varchar(256) NOT NULL, role varchar(256) NOT NULL)', function (err,result){
        if (err) {
          console.log(err)
        }
      });
    }
  });
};

/*
// writing to the database
app.put("/write_fb_info", function(request, response) {

  var queryText = 'INSERT INTO fb_info_table(name,surname,email,role) VALUES(?, ?, ?, ?)';

  connection.query(queryText, ['Giulio','Montenero','giulio.montenero@ibm.com','IBM Bluemix Technical Sales Advisory Specialist'], function (error,result){
    if (error) {
      console.log(error);
      response.status(500).send(error);
    } else {
      console.log("Storing to the mysql database: ");
      console.log(result);
      response.send(result);
    }
  });
});
*/

module.exports.writingtodb = function(){

  // store some information to the compose for mysql database
    var queryText = 'INSERT INTO fb_info_table(name,surname,email,role) VALUES(?, ?, ?, ?)';
    connection.query(queryText, ['Giulio','Montenero','giulio.montenero@ibm.com','IBM Bluemix Technical Sales Advisory Specialist'], function (error,res){
      if (error) {
        console.log(error);
        response.status(500).send(error);
      } else {
        console.log("Storing to the mysql database: ");
        console.log(res);
        response.send(res);
      }
    });
};
