// integrate gmail api
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const {sendEmail} = require("../config/smtp_config");
const User = require("../schemas/userSchema");
const {decodeToken} = require("../controllers/auth_controllers");

// configure and setup nodemailer to send emails
const nodemailer = require("nodemailer");
const SENDER_EMAIL = "mdrifatbd5@gmail.com";

// use google
const oauth2Client = new OAuth2(
    "1069770189772-", // ClientID
    "DbaYpuAg3qDXE4y17R", // Client Secret
    "https://developers.google.com/oauthplayground" // Redirect URL
);

// refresh token
oauth2Client.setCredentials({
    refresh_t
});

// get access token
const accessToken = oauth2Client.getAccessToken()

const smtpTransport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: "OAuth2",
        user: SENDER_EMAIL,
        clientId: "1069770189772-",
        clientSecret: "DbaYpuAg3qDXE4y17R",
        refreshToken: "1//04Y0qZq",
        accessToken: accessToken
    }
});


    