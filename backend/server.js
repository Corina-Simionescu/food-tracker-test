require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDatabase = require("./config/database.js");
const routes = require("./routes/index.js");

const app = express();
const port = process.env.PORT;

app.use(express.json());

connectDatabase();

const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? "https://food-tracker-frontend.onrender.com"
      : "http://localhost:5173",
};

app.use(cors(corsOptions));

app.use("/", routes);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
