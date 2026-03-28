import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: `"Notebook Store" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Your OTP Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto; padding: 20px; background: #f9f9f9; border-radius: 8px;">
        <h2 style="color: #333; text-align: center;">Verification Code</h2>
        <p style="color: #666; text-align: center;">Your verification code is:</p>
        <div style="background: #fff; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
          <span style="font-size: 32px; font-weight: bold; color: #2dd4bf; letter-spacing: 8px;">${otp}</span>
        </div>
        <p style="color: #999; text-align: center; font-size: 12px;">This code expires in 5 minutes.</p>
        <p style="color: #999; text-align: center; font-size: 12px;">If you didn't request this code, please ignore this email.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error: error.message };
  }
};
