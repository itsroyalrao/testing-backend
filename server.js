import { config } from "dotenv";
config();
import express from "express";
import cors from "cors";
// import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

import authRoutes from "./routes/auth.js";

const app = express();

app.use(express.json()); // parse data from req.body
app.use(cookieParser()); // parse data from req.cookies
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

app.use("/auth", authRoutes);

mongoose.connect(process.env.MONGO_URI).then(() => {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
});
