// Load env
require('dotenv').config()

var express = require('express');
var morgan = require('morgan');
var app = express();
const MongoClient = require('mongodb').MongoClient;
var db;

// Views config
app.set("views", "./views");
app.set("view engine", "pug");
app.set('trust proxy', true);
app.use(express.static(__dirname + '/public'));

// Middleware
app.use(morgan('combined'));

MongoClient.connect(`mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}.mlab.com:57040/npresco-fcc-url-shortener`, function (err, database) {
  if (err) return console.log(err);
  db = database;

  // Routes
  app.get("/", function (req, res) {
    // Display project use cases
    res.end("Hello");
  });

  app.get("/new/:url(*)", function (req, res) {
    // create shortend url
    var url = req.params.url;

    res.end(`${url}`);

  });


  // Listen on port
  app.listen(process.env.PORT || 5000, () => {
    console.log('listening on 5000');
  });
});
