import path from "path";
import fs from "fs";
import nodemailer from "nodemailer";
import { config } from "../../config/env";

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getTransporter = () => {
  if (config.smtpUser && config.smtpPass) {
    return nodemailer.createTransport({
      host: config.smtpHost,
      port: config.smtpPort,
      auth: {
        user: config.smtpUser,
        pass: config.smtpPass
      }
    });
  }
  return null;
};

export const sendEmail = async (options: SendEmailOptions, retryCount = 0): Promise<any> => {
  const transporter = getTransporter();
  const recipients = Array.isArray(options.to) ? options.to.join(", ") : options.to;

  const logoPath = path.join(__dirname, "../../../public/images/supermarche_logo_transparent.png");
  const attachments = fs.existsSync(logoPath) ? [
    {
      filename: "supermarche_logo_transparent.png",
      path: logoPath,
      cid: "supermarche_logo"
    }
  ] : [];

  if (!transporter) {
    console.log(`\n================ 📧 EMAIL DISPATCH (DEV MODE) ================`);
    console.log(`TO: ${recipients}`);
    console.log(`SUBJECT: ${options.subject}`);
    console.log(`BODY:\n${options.text || options.html}`);
    console.log(`ℹ️ Add your Mailtrap SMTP_USER & SMTP_PASS to .env to deliver directly to Mailtrap Inbox!`);
    console.log(`===========================================================\n`);
    return { delivered: false, mode: "console_log" };
  }

  try {
    const info = await transporter.sendMail({
      from: config.emailFrom,
      to: recipients,
      subject: options.subject,
      text: options.text,
      html: options.html,
      attachments: attachments
    });

    console.log(`✅ [Mailtrap] Email successfully delivered to Mailtrap Sandbox Inbox! (MessageID: ${info.messageId})`);
    return { delivered: true, messageId: info.messageId, mode: "mailtrap" };
  } catch (error: any) {
    // If Mailtrap Free Rate Limit occurs (550 5.7.0 Too many emails per second), auto-retry after 1.25s delay
    if (error?.message?.includes("550") || error?.code === "EENVELOPE") {
      if (retryCount < 3) {
        console.log(`⏳ Mailtrap rate limit reached. Waiting 1.25s before retrying email dispatch... (Attempt ${retryCount + 1})`);
        await delay(1250);
        return sendEmail(options, retryCount + 1);
      }
    }

    console.error("❌ Mailtrap Email Delivery Error:", error);
    throw error;
  }
};
