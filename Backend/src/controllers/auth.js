import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { nextId } from "../utils/ids";
import { serialize } from "../utils/serialize";

function signToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
    },
    process.env.JWT_SECRET || "datn_sm26_jwt_secret_change_me",
    { expiresIn: process.env.JWT_EXPIRES || "7d" }
  );
}

/** POST /register — giống json-server-auth */
export async function register(req, res) {
  try {
    const { email, password, fullName, phone, role } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email và mật khẩu bắt buộc" });
    }
    const exists = await User.findOne({ email: String(email).toLowerCase() });
    if (exists) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const id = await nextId("users");
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      id,
      email: String(email).toLowerCase(),
      password: hash,
      fullName: fullName || "",
      phone: phone || "",
      role: role === "admin" ? "admin" : "user",
    });
    const accessToken = signToken(user);
    return res.status(201).json({
      accessToken,
      user: serialize(user),
    });
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
}

/** POST /login */
export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: String(email || "").toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: "Cannot find user" });
    }
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(400).json({ message: "Incorrect password" });
    }
    const accessToken = signToken(user);
    return res.json({
      accessToken,
      user: serialize(user),
    });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
}

/** GET /users?email= */
export async function listUsers(req, res) {
  try {
    const filter = {};
    if (req.query.email) filter.email = String(req.query.email).toLowerCase();
    const users = await User.find(filter).select("-password");
    return res.json(users.map(serialize));
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
}
