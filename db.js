const dotenv = require("dotenv");
const mongodb = require("mongodb");

dotenv.config();

const MONGO_DB_URI = process.env.MONGO_DB_URI;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const client = new mongodb.MongoClient(MONGO_DB_URI, options);

const connectDB = async () => {
  try {
    await client.connect();
    console.log("MongoDB Connected...");
  } catch (error) {
    console.error("Error connecting to MongoDB: ", error.message);
    process.exit(1);
  }
};

/**
const listDatabases = async (client) => {
  const databasesList = await client.db().admin().listDatabases();

  console.log("Databases:");

  databasesList.databases.forEach((db) => console.log(` - ${db.name}`));
};

listDatabases(client);
*/

module.exports = connectDB;
