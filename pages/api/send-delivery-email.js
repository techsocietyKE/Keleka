// /pages/api/sendDeliveryEmail.js
import nodemailer from 'nodemailer';

const gmailTransport = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER_NAME,
      pass: process.env.GMAIL_USER_PASSWORD,
    },
  });
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, subject, message } = req.body;

    const mailOptions = {
      from: process.env.GMAIL_USER_NAME,
      to: email,
      subject: subject,
      html: `<p>${message}</p>`,
    };

    gmailTransport().sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ success: false, error: 'Failed to send email' });
      } else {
        console.log('Email sent:', info.response);
        return res.status(200).json({ success: true });
      }
    });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
