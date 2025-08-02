const AES = require('aes-encryption');
const CryptoJS = require('crypto-js');

const aes = new AES();
const secretKey = process.env.AES_SECRET_KEY && process.env.AES_SECRET_KEY.trim() !== '' ? process.env.AES_SECRET_KEY : 'default_secret';
aes.setSecretKey(secretKey);

defaultSecretWarn();

function defaultSecretWarn() {
  if (!process.env.AES_SECRET_KEY || process.env.AES_SECRET_KEY.trim() === '') {
    console.warn('Warning: AES_SECRET_KEY not set in environment. Using default (insecure) key.');
  }
}

function encryptData(data) {
  if (typeof data === 'string') {
    return aes.encrypt(data);
  }
  return aes.encrypt(JSON.stringify(data));
}

function decryptData(encrypted) {
  try {
    const decrypted = aes.decrypt(encrypted);
    try {
      return JSON.parse(decrypted);
    } catch {
      return decrypted;
    }
  } catch (e) {
    return null;
  }
}

// Alternative using crypto-js (for fields, etc.)
function encryptField(text) {
  return CryptoJS.AES.encrypt(text, secretKey).toString();
}

function decryptField(ciphertext) {
  const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
}

// Export encrypt/decrypt as aliases for encryptField/decryptField
module.exports = {
  encryptData,
  decryptData,
  encryptField,
  decryptField,
  encrypt: encryptField,
  decrypt: decryptField
}; 