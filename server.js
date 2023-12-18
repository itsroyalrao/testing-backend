import { config } from "dotenv";
config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://testing-v0.netlify.app"],
    credentials: true,
  })
);

app.use("/", (req, res) => {
  const cookies = req.cookies;
  res.json({ success: true, msg: cookies });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
