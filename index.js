import { createServer } from "http";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import UserRoutes from "./routes/UserRoutes.js";
import bodyParser from "body-parser";

dotenv.config();

const app = express();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

app.use(cors());

const server = createServer(app);
const port = process.env.PORT || 5000;

app.use("/api/v1/auth", UserRoutes);
app.get("/", (req, res) => {
  res.json("Working server");
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    server.listen(port, (req, res) => {
      console.log("Server is running on port: " + port);
    });
  })
  .catch((err) => console.log(err));
