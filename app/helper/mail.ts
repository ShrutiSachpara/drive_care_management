import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { logger } from '../logger/logger';

dotenv.config();

const transport = nodemailer.createTransport({
  service: 'Gmail',
  secure: false,
  port: parseInt(process.env.MAIL_PORT || '587'),
  auth: {
    user: 'mailto:shrutisachpara.shivinfotech@gmail.com',
    pass: 'tjmg gsky frbc dbkk',
  },
});

export const OtpSend = (email: string, otp: number) => {
  const mailDescription = {
    to: email,
    subject: 'otp for new password',
    html: `<h3>otp for new password</h3><h1>${otp}</h1>`,
  };
  return transport.sendMail(mailDescription, (error, res) => {
    if (error) {
      logger.error('Error sending email:', error);
    } else {
      logger.info('Email sent successfully:', res);
    }
  });
};
