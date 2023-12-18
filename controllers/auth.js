import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const verifyUser = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (accessToken) {
      jwt.verify(accessToken, "jwt-access-token-secret-key", (err, decoded) => {
        if (err) {
          return res.json({ success: false, msg: "Invalid Token" });
        } else {
          req.email = decoded.email;
          next();
        }
      });
    } else {
      if (renewToken(req, res)) next();
    }
  } catch (e) {
    console.log(e);
  }
};

const renewToken = async (req, res) => {
  try {
    let exist = false;

    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      jwt.verify(
        refreshToken,
        "jwt-refresh-token-secret-key",
        (err, decoded) => {
          if (err) {
            return res.json({ success: false, msg: "Invalid Refresh Token" });
          } else {
            const accessToken = jwt.sign(
              { email: decoded.email },
              "jwt-access-token-secret-key",
              { expiresIn: "1m" }
            );
            res.cookie("accessToken", accessToken, { maxAge: 60000 });
            exist = true;
          }
        }
      );
    } else {
      return res.json({ success: false, msg: "No Refresh Token" });
    }
    return exist;
  } catch (e) {
    console.log(e);
  }
};

const isAuthorized = async (req, res) => {
  try {
    return res.json({ success: true, msg: "authorised" });
  } catch (e) {
    console.log(e);
  }
};

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res.json({ success: false, msg: "User already exists" });
    } else {
      bcrypt.hash(password, 10, async (err, encrypted) => {
        if (err) console.log(err);
        else await User.create({ username, email, password: encrypted });
      });

      return res.json({ success: true });
    }
  } catch (e) {
    console.log(e);
  }
};

const getUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      bcrypt.compare(password, user.password, (err, same) => {
        if (same) {
          const accessToken = jwt.sign(
            { email: email },
            "jwt-access-token-secret-key",
            { expiresIn: "1m" }
          );
          const refreshToken = jwt.sign(
            { email: email },
            "jwt-refresh-token-secret-key",
            { expiresIn: "5m" }
          );
          res.cookie("accessToken", accessToken, { maxAge: 60000 });
          res.cookie("refreshToken", refreshToken, {
            maxAge: 300000,
            httpOnly: true,
            // secure: true,
            // sameSite: "strict",
            sameSite: "None",
            // path: "/",
            // domain: ".netlify.app",
          });
          return res.json({ success: true });
        } else {
          return res.json({ success: false, msg: "Password is incorrect" });
        }
      });
    } else {
      return res.json({ success: false, msg: "User doesn't exists" });
    }
  } catch (e) {
    console.log(e);
  }
};

export { registerUser, getUser, isAuthorized, verifyUser };
