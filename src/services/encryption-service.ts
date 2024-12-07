import nacl from "tweetnacl";
import util from "tweetnacl-util";
import crypto from "node:crypto";

const separator = "::";

const encrypt = (secret: string, encryptKey: string): string => {
  const keyBytes = util.decodeUTF8(encryptKey);
  const nonce = nacl.randomBytes(24);
  const encryptedSecret = nacl.secretbox(
    util.decodeUTF8(secret),
    nonce,
    keyBytes,
  );

  return `${util.encodeBase64(encryptedSecret)}${separator}${util.encodeBase64(nonce)}`;
};

const decrypt = (encryptedSecret: string, encryptKey: string): string => {
  const [secretString, nonce] = encryptedSecret.split(separator);
  const encryptedSecretBytes = util.decodeBase64(secretString);
  const nonceBytes = util.decodeBase64(nonce);
  const keyBytes = util.decodeUTF8(encryptKey);
  const secret = nacl.secretbox.open(
    encryptedSecretBytes,
    nonceBytes,
    keyBytes,
  );
  if (!secret) {
    throw new Error("Invalid encrypted secret");
  }
  return util.encodeUTF8(secret);
};

const hashPassword = (password: string, secretKey: string): string => {
  const secretKeyUint8Array = util.decodeUTF8(secretKey);
  const hmac = crypto.createHmac("sha256", secretKeyUint8Array);
  hmac.update(password);
  return hmac.digest("hex");
};

export { encrypt, decrypt, hashPassword };
