import nodemailer from 'nodemailer';

/** Sends an email. With no SMTP settings it prints the message to the server console (handy in development). */
export async function sendMail({ to, subject, html, text }) {
  if (!process.env.SMTP_HOST) {
    console.log(`\n[mail:dev] To: ${to}\nSubject: ${subject}\n${text || html.replace(/<[^>]+>/g, ' ')}\n`);
    return { dev: true };
  }
  const t = nodemailer.createTransport({ host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT) || 587, secure: Number(process.env.SMTP_PORT) === 465, auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } });
  return t.sendMail({ from: process.env.MAIL_FROM || process.env.SMTP_USER, to, subject, html, text });
}
export const siteUrl = () => process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000';
