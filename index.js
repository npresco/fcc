var express = require('express');
var app = express();

// Views config
app.set("views", "./views");
app.set("view engine", "pug");

app.get("/", function (req, res) {
  res.render("index")
});

app.get("/:time", function(req, res) {

  var queryTime = req.params.time;
  var date, unixTime, stringTime;

  var months = ["January", "February", "March", "April", "May", "June", "July",
  "August", "September", "October", "November", "December"]

  if (isNaN(queryTime)) {
    date = new Date(`${queryTime} GMT`)

    if (isNaN(date)) {
      unixTime = null;
      stringTime = null;
    } else {
      unixTime = date.getTime()/1000
      stringTime = `${months[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`
    }
  } else {
    date = new Date(queryTime * 1000)
    unixTime = date.getTime()/1000
    stringTime = `${months[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`
  }

  var obj = {
    unix: unixTime,
    natural: stringTime
  }

  res.send(JSON.stringify(obj))

})

app.listen(3000);
