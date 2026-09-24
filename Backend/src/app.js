import "dotenv/config";
import express from "express";
import { createServer } from "http";
import cors from "cors";
import morgan from "morgan";
import jwt from "jsonwebtoken";
import { Server } from "socket.io";
import { connectDB } from "./config/db";
import path from "path";

import authRouter from "./routes/auth";
import fieldRouter from "./routes/field";
import courtRouter from "./routes/court";
import bookingRouter from "./routes/booking";
import voucherRouter from "./routes/voucher";
import vnpayRouter from "./routes/vnpay";
import newsRouter from "./routes/news";
import notificationRouter from "./routes/notification";
import reviewRouter from "./routes/review";
import Review from "./models/Review";
import favoriteRouter from "./routes/favorite";
import Favorite from "./models/Favorite";
import { configureNotificationSocket } from "./utils/notificationSocket";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: true, credentials: true } });
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error("Unauthorized"));
  try {
    socket.data.user = jwt.verify(token, process.env.JWT_SECRET || "datn_sm26_jwt_secret_change_me");
    return next();
  } catch {
    return next(new Error("Invalid token"));
  }
});
io.on("connection", (socket) => {
  const user = socket.data.user;
  if (user?.id) socket.join(`user:${Number(user.id)}`);
  if (user?.email) socket.join(`email:${String(user.email).toLowerCase()}`);
});
configureNotificationSocket(io);
const PORT = process.env.PORT || 3000;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/db_datn_su26";

app.use(morgan("dev"));
app.use(express.json());
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// API giống json-server (root) để Frontend ít phải đổi
app.use(authRouter); // /login /register /users
app.use("/fields", fieldRouter);
app.use("/courts", courtRouter);
app.use("/bookings", bookingRouter);
app.use("/vouchers", voucherRouter);
app.use("/vnpay", vnpayRouter);
app.use("/news", newsRouter);
app.use("/notifications", notificationRouter);
app.use("/reviews", reviewRouter);
app.use("/favorites", favoriteRouter);


// alias /api/*
app.use("/api", authRouter);
app.use("/api/fields", fieldRouter);
app.use("/api/courts", courtRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/vouchers", voucherRouter);
app.use("/api/vnpay", vnpayRouter);
app.use("/api/news", newsRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/favorites", favoriteRouter);

app.get("/", (_req, res) => {
  res.json({
    name: "DATN SM26 API",
    status: "ok",
    endpoints: ["/login", "/register", "/fields", "/courts", "/bookings", "/reviews", "/favorites", "/vouchers", "/news"],
  });
});

import { runSeed } from "./seed";

connectDB(MONGODB_URI)
  .then(async (inMemory) => {
    await Review.syncIndexes();
    await Favorite.syncIndexes();
    if (inMemory) {
      await runSeed(false);
      console.log("Memory DB automatically seeded!");
    }
    httpServer.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });
