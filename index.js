var express = require('express');
var morgan = require('morgan');
var app = express();

// Views config
app.set("views", "./views");
app.set("view engine", "pug");
app.set('trust proxy', true);
app.use(express.static(__dirname + '/public'));

// Middleware
app.use(morgan('combined'));

// Routes
app.get("/", function (req, res) {
  var ipReq = req.ip;
  var languageReq = req.get("Accept-Language");
  var softwareReq = req.get("User-Agent");
  res.render("index", {ip: JSON.stringify(ipReq),
                       language: JSON.stringify(languageReq),
                       software: JSON.stringify(softwareReq)}, function(err, html) {
                         res.send(html);
                         res.end();
                       });
});

// Listen on port
app.listen(process.env.PORT || 5000);
