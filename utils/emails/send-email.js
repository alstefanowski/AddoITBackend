const nodemailer = require('nodemailer');

require('dotenv').config();

const sendEmail = async (email, subject, html) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USERNAME,
                pass: process.env.SMTP_PASSWORD
            }
        });

        await transporter.sendMail({
            from: process.env.SMTP_USERNAME,
            to: email,
            subject: subject,
            html: html
        });
        
    } catch (error) {
        console.log(error);
    }
};
module.exports = sendEmail;