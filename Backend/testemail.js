require("dotenv").config();

console.log("TEST EMAIL FILE STARTED");

const sendEmail = require("./utils/emailService");

const test = async () => {
  try {
    await sendEmail(
      "siya8365@gmail.com",
      "LeadMind Test Email",
      "Agar ye email mil gayi, LeadMind email system successfully kaam kar raha hai."
    );

    console.log("Test email sent successfully");
  } catch (error) {
    console.log("Email sending failed:", error.message);
  }
};

test();

console.log("TEST EMAIL FILE ENDED");