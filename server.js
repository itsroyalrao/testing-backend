import { config } from "dotenv";
config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
// import mongoose from "mongoose";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://0th.netlify.app"],
    credentials: true,
  })
);

app.use("/", (req, res) => {
  res.json({ success: true, msg: "Mahadev" });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

// mongoose.connect(process.env.MONGO_URI).then(() => {
//   const port = process.env.PORT || 3000;
//   app.listen(port, () => console.log(`Example app listening on port ${port}!`));
// });
