/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');
var app = express();
var path = require('path');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// request module provides a simple way to create HTTP requests in Node.js
var request = require('request');

var routes = require('./routes')(app);

app.get('/', function (req, res) {
 res.sendFile(path.join(__dirname + '/public/index.html'));
});

/*
app.get('/info/linkedin', function(req, res){
  //console.log(path.join(__dirname + '/public/linkedin.html'));
  res.sendFile(path.join(__dirname + '/public/linkedin.html'));
});
*/

const options_auth = {
  url: 'https://api.linkedin.com/v1/people/~?format=json',
  method: 'GET',
  headers: {
    'Authorization': 'Bearer AQV_fc2Js9rs9iB4N7U-xXGI63a4A3099vPhYlTIWFhar9SfjZdH3H4-6O1UAU_f7OvOeCfh4VvJzVzzoZ0HImla9R_eKxzTBjhZtFA6c0Lbx_s9SheIAIc9_l_1VVhxLoI1W7JMs0gCD0lC1Bdz4FLkqHETGWEO766qtEzNctFw_mNfaxc'
  }
};

request (options_auth, function (err, res, body) {
  var json = JSON.parse(body);
  console.log(json.headline);
});

/*
//Facebook API example
var propertiesObject_FB = { id:'967601343274222', name:'Giulio Montenero', access_token:'EAACEdEose0cBALo5Kmwk7qaMrswrCL9grLGwzuCdOjb9QkUXh4TE3V4fVutAuIsfxsjyNaF0YzR9743Xkamyn9RsL7QXZCX5HnMcQcIH386qKimz7MDg2CgL3zy3FZC7mqqXYa6cPzaToNXSrVKHbk5k6ffdlDZC84DlU8OCZCveaEgtlFRzmOtbxR56dVsZD' };

request({url:'https://graph.facebook.com/', qs:propertiesObject_FB}, function(err, response, body) {
  if(err) {
    console.log(err);
    return;
  }
  console.log(body);
  console.log("Get response: " + response.statusCode);
});

*/

///////////

var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({
  extended: false
}));

// Util is handy to have around, so thats why that's here.
const util = require('util');
// and so is assert
const assert = require('assert');

var mysql = require('mysql');

var cfenv = require('cfenv');

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

//reading from the database
app.get("/read_fb_info", function(request, response) {

  // execute a query on our database
  connection.query('SELECT * FROM fb_info_table ORDER BY name ASC', function (err, result) {
    if (err) {
      console.log(err);
     response.status(500).send(err);
    } else {
      console.log(result);
     response.send(result);
    }

  });
});

/////////

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
