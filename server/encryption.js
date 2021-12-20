"use strict";

const crypto = require ('crypto');

const secret = "FfA11AIiUhnhRDgL8H9KJC5dEh1nJ0Rs";

const algorithm = "aes-256-ctr";

const encrypt = (password) => {
    const iv = Buffer.from(crypto.randomBytes(16));
    const cipher = crypto.createCipheriv(algorithm,Buffer.from(secret),iv);

    const encryptedPassword = Buffer.concat([cipher.update(password),cipher.final()]);

    return {iv: iv.toString("hex"), password: encryptedPassword.toString("hex") };
};

const verify = (encryptedPassword,password) => {
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secret), Buffer.from(encryptedPassword.iv, "hex"));

    const decryptedPassword = Buffer.concat([
        decipher.update(Buffer.from(encryptedPassword.password, "hex")),
        decipher.final()]);

    if (decryptedPassword.toString() === password) return true;
    return false;
};

module.exports = {encrypt, verify};