// Load env
require('dotenv').config()

var express = require('express');
var morgan = require('morgan');
var app = express();
const MongoClient = require('mongodb').MongoClient;
var dbUrls;

// Views config
app.set("views", "./views");
app.set("view engine", "pug");
app.set('trust proxy', true);
app.use(express.static(__dirname + '/public'));

// Middleware
app.use(morgan('combined'));

MongoClient.connect(process.env.MONGODB_URI, function (err, database) {
  if (err) return console.log(err);
  dbUrls = database.collection("urls");

  // Routes
  app.get("/", function (req, res) {
    // Display project use cases
    res.end("Hello");
  });

  app.get("/new/:url(*)", function (req, res) {
    // create shortend url
    var queryUrl = req.params.url;
    var hostUrl = req.protocol + '://' + req.get('host')

    dbUrls.count().then(function(numIds) {
      dbUrls.findOne({ originalUrl: queryUrl }, function(err, result) {
          if (err) return console.log(err)
          if (result) {
            res.end(JSON.stringify(result));
          } else {
            dbUrls.insertOne(
              {
                _id: numIds + 1,
                shortenedUrl: `${hostUrl}/${numIds + 1}`,
                originalUrl: queryUrl
              }, function(err, doc) {
                if (err) return console.log(err);
                res.end(JSON.stringify(doc.ops));
              }
            );
          }
        });
    });
  });

  app.get("/:id", function (req, res) {
    var reqId = parseInt(req.params.id);
    dbUrls.findOne({ _id: reqId }, function(err, data) {
      if (err) return console.log(err)
      if (data)
        res.redirect(data.originalUrl);
      else
        res.send("No match found!")
    });
  })

  // Listen on port
  app.listen(process.env.PORT || 5000, () => {
    console.log('listening on 5000');
  });
});
