const QRCode = require('qrcode');
const crypto = require('crypto');

async function toDataUrl(token) {
  return await QRCode.toDataURL(token, {
    errorCorrectionLevel: 'M',
    margin: 2,
    width: 256,
  });
}

function generateToken() {
  return crypto.randomBytes(16).toString('hex');
}

module.exports = {
  toDataUrl,
  generateToken,
};
