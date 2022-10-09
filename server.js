const app = require("./app");
const mongoose = require("mongoose");
const {
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_IP,
  MONGO_PORT,
} = require("./config/config");
const port = process.env.PORT || 8000;
const mongoUrl = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/mydb?authSource=admin`;

mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("mongodb connectecd");
  })
  .catch((e) => {
    console.log(e.message);
  });

const server = app.listen(port, () => {
  console.log(`listening to server ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log(err);
  console.log("Unhandled rejection Shutting down ...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
