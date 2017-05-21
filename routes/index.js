// routes.js

var dbcontroller = require('../controller/compose-mysql-connection');
var path = require('path');
var request = require('request');
var Q = require('q');

/*
module.exports = function (app) {
  app.get('/info/linkedin', function(req, res){
    console.log(path.join(__dirname + '/public/linkedin.html'));
    //res.sendFile(path.join(__dirname + '/public/linkedin.html'));
    res.sendFile(path.join(__dirname, '../public', 'linkedin.html'));
  });
};
*/

retrieveLinkedInUserInfo = function() {
	var deferred = Q.defer();

  //retrieve the necessary information at first
  var json = null;

  const options_auth = {
    url: 'https://api.linkedin.com/v1/people/~?format=json',
    method: 'GET',
    headers: {
      'Authorization': 'Bearer AQV_fc2Js9rs9iB4N7U-xXGI63a4A3099vPhYlTIWFhar9SfjZdH3H4-6O1UAU_f7OvOeCfh4VvJzVzzoZ0HImla9R_eKxzTBjhZtFA6c0Lbx_s9SheIAIc9_l_1VVhxLoI1W7JMs0gCD0lC1Bdz4FLkqHETGWEO766qtEzNctFw_mNfaxc'
    }
  };

  request (options_auth, function (err, res, body) {
    if(err){
      deferred.resolve(null);
    }
    else{
      json = JSON.parse(body);
      deferred.resolve(json);
      console.log(json.headline);
    }
  });

	return deferred.promise;
};




/*

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

/*
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

*/








retrieveFacebookUserInfo = function() {
	var deferred = Q.defer();

	var propertiesObject_FB = { id:'967601343274222', name:'Giulio Montenero', access_token:'EAACEdEose0cBAFPwMHIZCUeepBsoaMB1WtgNPqZBiLxmsr4iKAVkO2rBeYtDLlX6WO8ryxe9GCGDZCRoLXL493x1jAO1RdOLLFCVZBYYFXnSVIqZAT6RmcHDB4Su4xVJCEUZCTfJS5TVqKlOlkY6RVtDLMKX71THcVoJrcIgaMTPLmqnksrvcEKoB86SzYu4AZD' };

	request({url:'https://graph.facebook.com/', qs:propertiesObject_FB}, function(err, response, body) {
	  if(err) {
			deferred.resolve(null);
	  }
		else {
			var fb_json = JSON.parse(body);
		  console.log("Get response: " + response.statusCode);
			console.log(fb_json);

			//storing information to db
			//dbcontroller.writingtodb();

			deferred.resolve(fb_json);
		}
	});

	return deferred.promise;
};

module.exports = function (app) {

  // set up the routes themselves
  /*
	app.get("/", function (req, res) {
      // do stuff
  });
	*/

  app.get('/info/facebook', function(req, res){
		retrieveFacebookUserInfo().then(function(result){
			console.log("ENTERED");

				res.render('facebook.ejs', {
					title : 'Facebook information',
					fb_obj: result
				});

			});

		});

  app.get('/info/linkedin', function(req, res){
		retrieveLinkedInUserInfo().then(function(result){
			res.render('linkedin.ejs', {
				title : 'LinkedIn information',
				headline_linkedin: result.headline
			});
		});
  });

}
