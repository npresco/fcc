/* eslint no-console: ["error", { allow: ["warn", "error"] }] */

// Load env
require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const MongoClient = require("mongodb").MongoClient;
const path = require("path");

const app = express();

// Views config
app.set("views", "./views");
app.set("view engine", "pug");
app.set("trust proxy", true);
app.use(express.static(path.join(__dirname, "/public")));

// Middleware
app.use(morgan("combined"));

MongoClient.connect(process.env.MONGODB_URI, (err, database) => {
  if (err) return console.warn(err);
  const dbUrls = database.collection("urls");

  // Routes
  app.get("/", (req, res) => {
    // Display project use cases
    res.end("Hello");
  });

  app.get("/new/:url(*)", (req, res) => {
    // create shortend url
    const queryUrl = req.params.url;
    const hostUrl = `${req.protocol}://${req.get("host")}`;

    dbUrls.count().then((numIds) => {
      dbUrls.findOne({ originalUrl: queryUrl }, (err2, result) => {
        if (err2) return console.warn(err2);
        if (result) {
          res.end(JSON.stringify(result));
        } else {
          dbUrls.insertOne({
            _id: numIds + 1,
            shortenedUrl: `${hostUrl}/${numIds + 1}`,
            originalUrl: queryUrl,
          }, (err3, doc) => {
            if (err3) return console.warn(err3);
            res.end(JSON.stringify(doc.ops));
            return undefined;
          },
                          );
        }
        return undefined;
      });
    });
  });

  app.get("/:id", (req, res) => {
    const reqId = parseInt(req.params.id, 10);
    dbUrls.findOne({ _id: reqId }, (err3, data) => {
      if (err3) return console.warn(err);
      if (data) {
        res.redirect(data.originalUrl);
      } else {
        res.send("No match found!");
      }
      return undefined;
    });
  });

  // Listen on port
  app.listen(process.env.PORT || 5000, () => {
    console.warn("listening on 5000");
  });
  return undefined;
});
