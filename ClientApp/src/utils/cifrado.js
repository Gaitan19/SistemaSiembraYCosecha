import CryptoJS from "crypto-js"

const cifradoKey = "union$2023";

export const cifrarPassword = (password) => {
    let passwordCifrada = CryptoJS.AES.encrypt(password, cifradoKey).toString();
    return passwordCifrada;
}

export const decifrarPassword = (password) => {
    let passwordDeCifrada = CryptoJS.AES.decrypt(password, cifradoKey).toString(CryptoJS.enc.Utf8);
    return passwordDeCifrada;
}