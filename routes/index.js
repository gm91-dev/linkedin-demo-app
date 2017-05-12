// routes.js
var path = require('path');
module.exports = function (app) {
  // set up the routes themselves
  app.get("/", function (req, res) {
      // do stuff
  });
};

module.exports = function (app) {
  app.get('/info/linkedin', function(req, res){
    console.log(path.join(__dirname + '/public/linkedin.html'));
    //res.sendFile(path.join(__dirname + '/public/linkedin.html'));
    res.sendFile(path.join(__dirname, '../public', 'linkedin.html'));
  });
};
