const sendEmail = async (to, subject, text) => {
  // Mock email sender since SMTP is not configured
  console.log(`[EMAIL] To: ${to} | Subject: ${subject}`);
  console.log(`[EMAIL] Body: ${text}`);
  return true;
};

module.exports = { sendEmail };
