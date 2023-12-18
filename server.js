import { config } from "dotenv";
config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://testing-v0.netlify.app"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  const { email } = req.query;

  const accessToken = jwt.sign({ email }, "jwt-access-token-secret-key", {
    expiresIn: "2m",
  });
  const refreshToken = jwt.sign({ email }, "jwt-refresh-token-secret-key", {
    expiresIn: "2m",
  });
  res.json({ success: true, tokens: { accessToken, refreshToken } });
});

app.post("/", (req, res) => {
  const { accessToken, refreshToken } = req.body;

  jwt.verify(accessToken, "jwt-access-token-secret-key", (err, decoded) => {
    if (err) {
      return res.json({ success: false });
    } else {
      req.email = decoded.email;
      return res.json({ success: true, email: decoded.email });
    }
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
