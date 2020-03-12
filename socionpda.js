// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express = require('express');        // call express
var app = express();                 // define our app using express
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var proxy = require('express-http-proxy');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override'));
var port = process.env.PORT || 9012;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router
// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override'));
console.log(__dirname)
// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/dist'));



// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api',addCorsHeaders, proxy('http://localhost:3000',{
    proxyReqOptDecorator: function(proxyReqOpts, srcReq) {
        // console.log('api calling:  ')
        // you can update headers
        return proxyReqOpts;
      }
    // proxyReqPathResolver: (req) => require('url').parse('http://localhost:3000').path

}));
// middleware to add CORS headers
function addCorsHeaders(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,PATCH,DELETE,OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization,' +
      'cid, user-id, x-auth, Cache-Control, X-Requested-With, *')
  
    if (req.method === 'OPTIONS') {
      res.sendStatus(200)
    } else {
      next()
    };
  }
  
app.get('*', function (req, res, next) {
    res.sendFile(__dirname + '/dist/index.html');
});
// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);