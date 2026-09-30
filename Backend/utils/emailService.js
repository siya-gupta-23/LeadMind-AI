const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendEmail = async (to, subject, text) => {
  const info = await transporter.sendMail({
    from: `LeadMind <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  });

  console.log("EMAIL SENT:", info.messageId);
  console.log("EMAIL RESPONSE:", info.response);

  return info;
};

module.exports = sendEmail;