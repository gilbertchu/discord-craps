const {randomBytes, createCipheriv, createDecipheriv} = require('crypto');

class CryptoB {
  static #ALGORITHM = 'aes-128-gcm';
  #key;

  constructor(rawKey) {
    const key = rawKey === true ? randomBytes(16) : Buffer.from(rawKey, 'base64');
    if (key.length !== 16) throw 'Invalid key length';
    this.#key = key;
  }

  encryptB(message) {
    const iv = randomBytes(12);
    const cipher = createCipheriv(CryptoB.#ALGORITHM, this.#key, iv);
    const encrypted = [cipher.update(message, 'utf8', null)];
    encrypted.push(cipher.final(null));
    encrypted.push(cipher.getAuthTag());
    const data = Buffer.concat(encrypted).toString('base64') + iv.toString('base64');
    return data;
  }

  decryptB(data) {
    const encrypted = Buffer.from(data.slice(0, data.length - 16), 'base64');
    const iv = Buffer.from(data.slice(data.length - 16, data.length), 'base64');
    const msg = encrypted.slice(0, encrypted.length - 16);
    const tag = encrypted.slice(encrypted.length - 16, encrypted.length);
    const decipher = createDecipheriv(CryptoB.#ALGORITHM, this.#key, iv);
    decipher.setAuthTag(tag);
    let decrypted = decipher.update(msg, null, 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  get rawKey() {
    return this.#key.toString('base64');
  }

  static generateRawKey() {
    const raw = randomBytes(16).toString('base64');
    return raw;
  }
}

module.exports = exports = CryptoB;
