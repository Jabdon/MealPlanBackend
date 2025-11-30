const mongoose = require("mongoose");
const dotenv = require("dotenv");

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! Shutting down...");
  console.log(err.name, err.message, err.stack);
  process.exit(1);
});

dotenv.config({ path: "./config.env" });
/*const DB = process.env.DATABASE.replace(
  "<db_password>",
  process.env.DB_PASSWORD
); */
const DB = process.env.DATABASE_LOCAL;

const app = require("./app");

console.log(process.env);

mongoose.connect(DB).then((con) => {
  console.log("DB connection successful!");
});

// Start server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("UNHANDLED REJECTION! Shutting down...");
  server.close(() => {
    process.exit(1);
  });
});
