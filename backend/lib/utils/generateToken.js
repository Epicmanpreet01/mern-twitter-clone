import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = async (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000, //MS
    httpOnly: true,
    sameSite: true,
    secure: process.env.NODE_ENV !== "development",
  });
};
