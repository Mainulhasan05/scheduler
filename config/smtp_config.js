// configure and setup nodemailer to send emails
const nodemailer = require("nodemailer");
const SENDER_EMAIL = "mdrifatbd5@gmail.com";
const env = require("dotenv").config();
const smtpTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: SENDER_EMAIL,
      pass: "ijbsrulkgesgyocq"
    }
  });
// send email
const sendEmail = async (from,email, subject, body) => {
    const testAccount= await nodemailer.createTestAccount();
    try {
        const mailOptions = {
            from: from,
            to: email,
            subject: subject,
            html: body,
        };
        
        const result = await smtpTransport.sendMail(mailOptions);

        return result;
    }
    catch (error) {
        return error;
    }
}
module.exports = {
    sendEmail
}