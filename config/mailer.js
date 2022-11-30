const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});
const mailSender = async (receiverMail, subject, text_data) => {
    const info = await transporter.sendMail({
        from: `"${process.env.MAIL_SENDER_NAME}" <${process.env.MAIL_USER}>`,
        to: receiverMail,
        subject: subject,
        html: text_data,
    });

    return info.messageId ? true : false;
}

module.exports = mailSender;