const axios = require("axios");
const MongoClient = require("mongodb").MongoClient;
let dbconfig = require("./dbconfig");
let assert = require("assert");
const Config = require("./config.json");

sleep_time = 2; //seconds
let enableConsoleLog = true;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function doStuff() {
  var previousBlock = -1;
  try {
    MongoClient.connect(
      dbconfig.dbURL,
      { useNewUrlParser: true },
      async function(err, client) {
        assert.equal(err, null);

        const db = client.db(dbconfig.databaseName);

        //Begin repeated Work
        while (true) {
          axios
            .get(Config.statsapi_url)
            .then(async function(resp) {
              let _resultObj = await resp.data;
              //if (previousBlock != _resultObj.blockNum) {
                previousBlock = _resultObj.blockNum;

                var query = { blockNum: _resultObj.blockNum };

                await db
                  .collection(dbconfig.dbCollectionName)
                  .findOneAndReplace(
                    query,
                    {
                      fast: _resultObj.fast,
                      fastest: _resultObj.fastest,
                      safeLow: _resultObj.safeLow,
                      average: _resultObj.average,
                      block_time: _resultObj.block_time,
                      blockNum: _resultObj.blockNum,
                      speed: _resultObj.speed,
                      safeLowWait: _resultObj.safeLowWait,
                      avgWait: _resultObj.avgWait,
                      fastWait: _resultObj.fastWait,
                      fastestWait: _resultObj.fastestWait
                    },
                    { upsert: true }
                  );

                if (enableConsoleLog)
                  console.log("Inserted/Updated block " + previousBlock);
              //} //if New block
            });
          await sleep(sleep_time * 1000);
        }
        //End repeated Work
        //client.close();
      }
    );
  } catch (err) {
    if (enableConsoleLog) console.log("Exception Occured. " + err);
  }
}

doStuff();
