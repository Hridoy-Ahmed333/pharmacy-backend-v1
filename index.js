const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const categoryRouter = require("./routes/category"); // Import the cors package
const medicineRouter = require("./routes/medicine");
const searchRouter = require("./routes/search");
const server = express();

const path = require("path");

// Assuming your images are in the Images directory relative to your script

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/pharmacy");
  console.log("Connected with database");
}
server.use("/images", express.static(path.join(__dirname, "Images")));
server.use(cors());
server.use(express.json());
server.use(morgan("combined"));
server.use(express.static("public"));
server.use("/category", categoryRouter.categoryRouter);
server.use("/medicine", medicineRouter.medicineRouter);
server.use("/search", searchRouter.searchRouter);

server.listen(8080, () => {
  console.log("Server started");
});
