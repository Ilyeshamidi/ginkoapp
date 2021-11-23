// Loading of the express module
var express = require('express');
var http = require('http');

// Create a service (the app object is just a callback).
var app = express();

app.use(express.static('ginkobus-pwa'));  // <-- TODO change to set the app directory

// Create an HTTP service.
http.createServer(app).listen(process.env.PORT||3000);

console.log("C'est parti. En attente de connexion en HTTP (port 8080)...");