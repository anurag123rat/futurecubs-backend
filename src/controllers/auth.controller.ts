// controllers/authController.ts
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";

const generateAccessToken = (id: string, role: string) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET as string,
    { expiresIn: "15m" }
  );
};

const generateRefreshToken = (id: string, role: string) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_REFRESH_SECRET as string,
    { expiresIn: "7d" }
  );
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.status) {
      return res.status(403).json({ message: "Account is disabled" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const userId = (user._id as any).toString();

    const accessToken = generateAccessToken(userId, user.role);
    const refreshToken = generateRefreshToken(userId, user.role);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      // path: "/api/auth",
    });

    //process.env.NODE_ENV === "production"

    res.status(200).json({
      accessToken,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.refreshToken;

    if (!token) {
      return res.status(401).json({ message: "No refresh token" });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_REFRESH_SECRET as string);

    const user = await User.findById(decoded.id);
    if (!user || !user.status) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const userId = (user._id as any).toString();
    const newAccessToken = generateAccessToken(userId, user.role);

    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    return res.status(401).json({ message: "Refresh token expired or invalid" });
  }
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie("refreshToken", { path: "/api/auth" });
  res.status(200).json({ message: "Logged out" });
};