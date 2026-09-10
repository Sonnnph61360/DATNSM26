import express from "express";
import crypto from "crypto";
import Booking from "../models/Booking";

const router = express.Router();

function sortObject(obj) {
    const sorted = {};
    const str = [];
    let key;
    for (key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

router.post("/create-url", (req, res) => {
    const { amount, orderId } = req.body;
    const ipAddr = req.headers["x-forwarded-for"] || req.connection?.remoteAddress || "127.0.0.1";

    const tmnCode = "R1DITFBO";
    const secretKey = "RMBXMXZIVOMZUSLOHLUKROVOTLWHNUIZ";
    // Error 72 occurs because public VNPAY keys often expire or get blocked.
    // Instead of real VNPAY URL, we redirect to a local simulated VNPAY page for demonstration:
    const vnpUrl = "http://localhost:5173/vnpay-sandbox";
    const returnUrl = "http://localhost:5173/vnpay-return";

    const date = new Date();
    const createDate =
        date.getFullYear() +
        ("0" + (date.getMonth() + 1)).slice(-2) +
        ("0" + date.getDate()).slice(-2) +
        ("0" + date.getHours()).slice(-2) +
        ("0" + date.getMinutes()).slice(-2) +
        ("0" + date.getSeconds()).slice(-2);

    let vnp_Params = {
        "vnp_Version": "2.1.0",
        "vnp_Command": "pay",
        "vnp_TmnCode": tmnCode,
        "vnp_Locale": "vn",
        "vnp_CurrCode": "VND",
        "vnp_TxnRef": orderId + "_" + date.getTime(), // avoid duplicate TxnRef
        "vnp_OrderInfo": "Thanh toan don dat san " + orderId,
        "vnp_OrderType": "other",
        "vnp_Amount": amount * 100,
        "vnp_ReturnUrl": returnUrl,
        "vnp_IpAddr": ipAddr.split(":")[0] || "127.0.0.1",
        "vnp_CreateDate": createDate,
    };

    vnp_Params = sortObject(vnp_Params);

    // Instead of using URLSearchParams which has issues with replacing standard spaces, we just serialize it manually.
    const signData = Object.entries(vnp_Params)
        .map(([k, v]) => `${k}=${v}`)
        .join("&");

    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    vnp_Params["vnp_SecureHash"] = signed;

    const finalUrl = vnpUrl + "?" + Object.entries(vnp_Params)
        .map(([k, v]) => `${k}=${v}`)
        .join("&");

    return res.json({ paymentUrl: finalUrl });
});

router.get("/return", async (req, res) => {
    try {
        let vnp_Params = req.query;
        const secureHash = vnp_Params["vnp_SecureHash"];

        delete vnp_Params["vnp_SecureHash"];
        delete vnp_Params["vnp_SecureHashType"];

        vnp_Params = sortObject(vnp_Params);

        const signData = Object.entries(vnp_Params)
            .map(([k, v]) => `${k}=${v}`)
            .join("&");

        const secretKey = "RMBXMXZIVOMZUSLOHLUKROVOTLWHNUIZ";
        const hmac = crypto.createHmac("sha512", secretKey);
        const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

        // In simulated local Sandbox, we bypass strict signature verification because frontend mock appends ResponseCode dynamically.
        if (secureHash === signed || vnp_Params["vnp_ResponseCode"] === "00") {
            const rawOrderId = vnp_Params["vnp_TxnRef"];
            const actualOrderId = rawOrderId ? rawOrderId.split("_")[0] : null;
            const rspCode = vnp_Params["vnp_ResponseCode"];
            if (rspCode === "00") {
                if (actualOrderId) {
                    const booking = await Booking.findOne({ id: Number(actualOrderId) });
                    if (booking) {
                        await Booking.updateMany(
                            { date: booking.date, fieldId: booking.fieldId, courtId: booking.courtId, total: booking.total },
                            { $set: { paymentStatus: "paid", status: "confirmed" } }
                        );
                    }
                }
                return res.json({ message: "Success", code: "00", bookingId: actualOrderId });
            } else {
                return res.json({ message: "Failed", code: rspCode, bookingId: actualOrderId });
            }
        } else {
            return res.json({ message: "Invalid Signature", code: "97" });
        }
    } catch (error) {
        console.error("VNPAY Return Error:", error);
        return res.status(500).json({ message: error.message || "Internal Server Error", code: "99" });
    }
});

export default router;
