import nacl from 'tweetnacl';
import util from 'tweetnacl-util';
import crypto from 'node:crypto';

const encrypt = (secret: string, encryptKey: string): { encryptedSecret: string; nonce: string } => {
    const keyBytes = util.decodeUTF8(encryptKey);
    const nonce = nacl.randomBytes(24);
    const encryptedSecret = nacl.secretbox(util.decodeUTF8(secret), nonce, keyBytes);

    return {
        encryptedSecret: util.encodeBase64(encryptedSecret),
        nonce: util.encodeBase64(nonce),
    };
};

const decrypt = (encryptedSecret: string, nonce: string, encryptKey: string): string => {
    const encryptedSecretBytes = util.decodeBase64(encryptedSecret);
    const nonceBytes = util.decodeBase64(nonce);
    const keyBytes = util.decodeUTF8(encryptKey);
    const secret = nacl.secretbox.open(encryptedSecretBytes, nonceBytes, keyBytes);
    if (!secret) {
        throw new Error('Invalid encrypted secret');
    }
    return util.encodeUTF8(secret);
};

const hashPassword = (password: string, secretKey: string): string => {
    const secretKeyUint8Array = util.decodeUTF8(secretKey);
    const hmac = crypto.createHmac('sha256', secretKeyUint8Array);
    hmac.update(password);
    return hmac.digest('hex');
};

export {encrypt, decrypt, hashPassword};