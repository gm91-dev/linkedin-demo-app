/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');
var app = express();
var path = require('path');

var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({
  extended: false
}));

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// request module provides a simple way to create HTTP requests in Node.js
var request = require('request');

var routes = require('./routes')(app);

app.get('/', function (req, res) {
 res.sendFile(path.join(__dirname + '/public/index.html'));
});

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

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
