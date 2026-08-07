import "dotenv/config";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "./models/User";
import Field from "./models/Field";
import Court from "./models/Court";
import Booking from "./models/Booking";
import { setCounter } from "./utils/ids";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/db_datn_su26";

async function loadDbJson() {
  const candidates = [
    path.resolve(__dirname, "../../Frontend/db.json"),
    path.resolve(process.cwd(), "../Frontend/db.json"),
    path.resolve(process.cwd(), "db.json"),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) {
      console.log("Reading", p);
      return JSON.parse(fs.readFileSync(p, "utf8"));
    }
  }
  throw new Error("Không tìm thấy Frontend/db.json");
}

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected");

  const data = await loadDbJson();

  await Promise.all([
    User.deleteMany({}),
    Field.deleteMany({}),
    Court.deleteMany({}),
    Booking.deleteMany({}),
  ]);

  // Users — giữ password đã hash nếu có dạng $2, không thì hash lại
  for (const u of data.users || []) {
    let password = u.password;
    if (!password || !String(password).startsWith("$2")) {
      password = await bcrypt.hash(password || "123456", 10);
    }
    // Đảm bảo admin password = 123456 nếu là admin@gmail.com
    if (u.email === "admin@gmail.com") {
      password = await bcrypt.hash("123456", 10);
    }
    await User.create({
      id: u.id,
      email: u.email,
      password,
      fullName: u.fullName || "",
      phone: u.phone || "",
      role: u.role || "user",
    });
  }
  console.log("Users:", data.users?.length || 0);

  for (const f of data.fields || []) {
    await Field.create({ ...f });
  }
  console.log("Fields:", data.fields?.length || 0);

  for (const c of data.courts || []) {
    await Court.create({ ...c });
  }
  console.log("Courts:", data.courts?.length || 0);

  for (const b of data.bookings || []) {
    await Booking.create({
      ...b,
      createdAt: b.createdAt || new Date().toISOString(),
    });
  }
  console.log("Bookings:", data.bookings?.length || 0);

  const max = (arr, key = "id") =>
    arr && arr.length ? Math.max(...arr.map((x) => Number(x[key]) || 0)) : 0;

  await setCounter("users", max(data.users));
  await setCounter("fields", max(data.fields));
  await setCounter("courts", max(data.courts));
  await setCounter("bookings", max(data.bookings));
  console.log("Counters set");

  await mongoose.disconnect();
  console.log("Seed done. Admin: admin@gmail.com / 123456");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
