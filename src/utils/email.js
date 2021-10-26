const nodemailer = require('nodemailer');
require('dotenv').config();

const sendEmail = async (options) => {
    /** Create Transporter - MailTrap for Development */
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        }
    });

    /** DEfine Email Options */
    const mailOptions = {
        from: "Opemipo Jokotagba A <opemipojokotagba@gmail.com>",
        to: options.email,
        subject: options.subject,
        text: options.message
    };

    /** Send the Mail */
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;