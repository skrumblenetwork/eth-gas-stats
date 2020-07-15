var http = require("http");
var fs = require("fs");

const MongoClient = require("mongodb").MongoClient;
let dbconfig = require("./dbconfig");
let assert = require("assert");

var requiredBlocks = 100;

http
  .createServer(function(req, response) {
    fs.readFile("index.html", "utf-8", function(err, data) {
      response.writeHead(200, { "Content-Type": "text/html" });

      try {
        MongoClient.connect(dbconfig.dbURL, { useNewUrlParser: true }, function(
          err,
          client
        ) {
          assert.equal(err, null);
          const db = client.db(dbconfig.databaseName);

          //Insert all keys to a database
          db.collection(dbconfig.dbCollectionName)
            .find({}, { average: true })
            .sort({ blockNum: -1 })
            .limit(requiredBlocks)
            .toArray(function(err, results) {
              console.log("Retrieved Results");
              var chartData = new Array(requiredBlocks);
              var chartDataAvgWaitTime = new Array(requiredBlocks);
              var labelsData = new Array(requiredBlocks);

              for (var i = results.length - 1, j = 0; i >= 0; i--, j++) {
                chartData[j] = results[i].average / 10;
                chartDataAvgWaitTime[j] = results[i].avgWait / 10;
                labelsData[j] = results[i].blockNum;
              }

              var result = data
                .toString("utf8")
                .replace("{{chartData}}", JSON.stringify(chartData))
                .replace(
                  "{{chartDataAvgWaitTime}}",
                  JSON.stringify(chartDataAvgWaitTime)
                )
                .replace("{{labelsData}}", JSON.stringify(labelsData));
              response.write(result);
              response.end();
            });
            client.close();
        });
      } catch (err) {}
    });
  })
  .listen(1337, "0.0.0.0");

console.log("Server running at http://127.0.0.1:1337/");