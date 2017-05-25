// routes
var path = require('path');
var request = require('request');
var Q = require('q');

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
      deferred.reject();
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

	var propertiesObject_FB = { id:'967601343274222', name:'Giulio Montenero', access_token:'EAACEdEose0cBAIIoeCVwo3ci7qhPtCYPcx7F3sCQBzw4WX8ssRu1EgJuhmaTWScZAIr18EZBe5PqLggwt8Qo6TYHClPdNX44fVcfUGWdRdXJXVOHGZCnof1axUt8ujRAZCmoVa2sj2Bm4Q9Fq2e9ejijqtKOZBjwZB3WBwQZB4kEzCz0PWUZCty6AnNXHyQGtqMZD' };
	//var propertiesObject_FB = { id:'1528680640499620', name:'Giulio Montenero', access_token:'EAAGDZB2SXKbYBAKn5cV7nUlQiz4GN0U1M9N0mql8vFTNd45eBlhUlCgHxcCaR1LsUsPhI7c3xxdBJT8vHW0HsZA4iCZB8uroGIkKnHFVIeRUnfRMlacNfI3opk9yDOZAGYv3IaDACCj1hJcXAxxpahlQlmXQLe8ZD' };

	request({url:'https://graph.facebook.com/', qs:propertiesObject_FB}, function(err, response, body) {
	  if(err) {
			deferred.reject();
	  }
		else {
			var fb_json = JSON.parse(body);
		  console.log("Get response: " + response.statusCode);
			console.log(fb_json);

			deferred.resolve(fb_json);
		}
	});

	return deferred.promise;
};

getphraseoftheday = function() {
	var deferred = Q.defer();

	request({url:'https://api.chucknorris.io/jokes/random'}, function(err, response, body) {
	  if(err) {
			deferred.reject();
	  }
		else {
		  console.log("Get response: " + response.statusCode);
			console.log(body);
			deferred.resolve(body);
		}
	});

	return deferred.promise;
};


module.exports = function (app) {

  // set up the routes themselves
  /*
	app.get("/", function (req, res) {
      // do something
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

	app.get('/curiosity', function(req, res){
		getphraseoftheday().then(function(result){
			console.log(result);
			res.send(result);
		});
  });

};
