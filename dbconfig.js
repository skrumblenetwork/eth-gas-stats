var version="_p01";

//Database name
var databaseName = "GasTracker"+version;

//Collection
var dbCollectionName = "Details";

var dbURL = "mongodb://localhost:27017";
//const dbURL = await MongoClient.connect('mongodb://adminUsername:adminPassword@localhost:27017/mydb?authSource=admin');

module.exports = {databaseName: databaseName, dbCollectionName: dbCollectionName, dbURL:dbURL};