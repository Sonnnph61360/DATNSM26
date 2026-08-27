import "dotenv/config";
import { sendMail } from "./src/utils/mailer.js";

async function run() {
    console.log("USER:", process.env.EMAIL_USER);
    const success = await sendMail(process.env.EMAIL_USER, "Test", "Test body");
    console.log("Success:", success);
}
run();
