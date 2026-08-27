import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

console.log("Testing email with user:", process.env.EMAIL_USER);

async function testGmail() {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            connectionTimeout: 10000, // 10s timeout
            greetingTimeout: 10000,
            socketTimeout: 10000,
        });
        console.log("Transport created. Verifying...");
        await transporter.verify();
        console.log("Verify Success! Sending mail...");
        let info = await transporter.sendMail({
            from: `"Test" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER,
            subject: "Test Mail",
            text: "Hello from test!"
        });
        console.log("Email sent successfully: " + info.messageId);
    } catch (err) {
        console.error("Error during email test:", err.message);
    }
}
testGmail();
