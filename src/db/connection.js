const { MongoClient, ServerApiVersion } = require('mongodb');

let _client;
let _db;

async function connectToDb() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.DB_NAME;
  if (!uri || !dbName) throw new Error('Missing MONGODB_URI or DB_NAME');

  _client = new MongoClient(uri, {
    serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true }
  });
  await _client.connect();
  _db = _client.db(dbName);
  console.log(`Connected to MongoDB → ${_db.databaseName}`);
}

function getDb() {
  if (!_db) throw new Error('DB not initialized. Call connectToDb() first.');
  return _db;
}

module.exports = { connectToDb, getDb };
