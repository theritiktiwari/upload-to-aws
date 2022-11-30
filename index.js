const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/connectDB");

dotenv.config();
connectDB();
const port = process.env.PORT || 5000;
const app = express();
app.use(express.json());
app.use(cors());

app.use("/api", require("./routes/auth"));
app.use("/api", require("./routes/image"));

app.listen(port, () => {
  console.log(`Server started at http://127.0.0.1:${port}`);
});

module.exports = app;