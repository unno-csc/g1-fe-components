import CryptoJS from "crypto-js";

const IV_BYTE_LENGTH = 16;
export const encryptData = (value: string, KEY_ENCRYPT: CryptoJS.lib.WordArray): string => {
    const iv = CryptoJS.lib.WordArray.random(IV_BYTE_LENGTH);
    const encrypted = CryptoJS.AES.encrypt(value, KEY_ENCRYPT, {
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    });
    const combined = iv.clone().concat(encrypted.ciphertext);
    const base64 = CryptoJS.enc.Base64.stringify(combined);
    const base64url = base64
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
    return base64url;
};

export const decryptData = (base64url: string, KEY_ENCRYPT: CryptoJS.lib.WordArray): string => {

    if (!base64url) {
        return "";
    }
    let base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
    const missingPadding = base64.length % 4;
    if (missingPadding) {
        base64 += "=".repeat(4 - missingPadding);
    }
    const combined = CryptoJS.enc.Base64.parse(base64);
    if (combined.sigBytes <= IV_BYTE_LENGTH) {
        return "";
    }
    const iv = CryptoJS.lib.WordArray.create(combined.words.slice(0, IV_BYTE_LENGTH / 4), IV_BYTE_LENGTH);
    const ciphertext = CryptoJS.lib.WordArray.create(
        combined.words.slice(IV_BYTE_LENGTH / 4),
        combined.sigBytes - IV_BYTE_LENGTH,
    );
    const decrypted = CryptoJS.AES.decrypt({ ciphertext } as CryptoJS.lib.CipherParams, KEY_ENCRYPT, {
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
};

export const decryptDataFromStorage = (key: string, KEY_ENCRYPT: CryptoJS.lib.WordArray): string | undefined => {
    const storage = localStorage.getItem(key);
    if (storage) {
        return decryptData(storage, KEY_ENCRYPT);
    }
    return undefined;
};

export const setDataEncryptedInStorage = (key: string, value: string, KEY_ENCRYPT: CryptoJS.lib.WordArray): void => {
    const encrypted = encryptData(value, KEY_ENCRYPT);
    localStorage.setItem(key, encrypted);
};