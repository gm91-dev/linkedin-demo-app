// routes.js
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

retrieveFacebookUserInfo = function() {
	var deferred = Q.defer();

	var propertiesObject_FB = { id:'967601343274222', name:'Giulio Montenero', access_token:'EAACEdEose0cBAMwArvZCTWhv2K0ddWWxtVJp0qp5Vv0ZByySYHyu9aLfHVlZBafQAoMybzZAU3KcFcDA2l1KmY94SEc0x9X5sgkVwSoFebjNxuyX45DC5v2qtL6YmAlUcLAqZCKprjrJWevYbKmMbfroArhX9K34fT6Xqj4S6G3SbH11YZB36SX7ADfTKBZAToZD' };

	request({url:'https://graph.facebook.com/', qs:propertiesObject_FB}, function(err, response, body) {
	  if(err) {
			deferred.resolve(null);
	  }
		else {
			var fb_json = JSON.parse(body);
		  console.log("Get response: " + response.statusCode);
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
