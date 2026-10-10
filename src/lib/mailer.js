const nodemailer = require('nodemailer');
const { env } = require('../config/env');

let transporter = null;
if (env.SMTP_HOST && env.SMTP_USER) {
  transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: parseInt(env.SMTP_PORT || '587', 10),
    secure: env.SMTP_PORT === '465',
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  });
}

async function sendMail({ to, subject, html, text }) {
  if (!transporter) {
    console.log(`[MAIL MOCK] To: ${to} | Subject: ${subject}`);
    if (text) console.log(`[MAIL MOCK TEXT]: ${text}`);
    return { mock: true, accepted: [to] };
  }

  try {
    return await transporter.sendMail({
      from: env.MAIL_FROM || 'Skyline <no-reply@skyline.test>',
      to,
      subject,
      text: text || (html ? html.replace(/<[^>]*>?/gm, '') : ''),
      html,
    });
  } catch (err) {
    console.error(`[MAIL ERROR] Failed sending to ${to}:`, err.message);
    return { error: err.message };
  }
}

async function sendBulk(emails, subject, html) {
  if (!Array.isArray(emails) || emails.length === 0) return [];
  const results = [];
  const batchSize = 10;
  for (let i = 0; i < emails.length; i += batchSize) {
    const chunk = emails.slice(i, i + batchSize);
    const promises = chunk.map((to) => sendMail({ to, subject, html }));
    const batchRes = await Promise.allSettled(promises);
    results.push(...batchRes);
  }
  return results;
}

module.exports = {
  sendMail,
  sendBulk,
};
