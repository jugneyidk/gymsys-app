import { decode as atobRN, encode as btoaRN } from 'base-64';
if (!global.atob)  global.atob  = atobRN;
if (!global.btoa)  global.btoa  = btoaRN;

import 'react-native-get-random-values';
import forge     from 'node-forge';
import CryptoJS  from 'crypto-js';

const PUBLIC_KEY_URL = 'http://10.0.2.2/gymsys/public.key';
let cachedPem = null;

async function obtenerClavePublicaPem () {
  if (cachedPem) return cachedPem;

  const r = await fetch(PUBLIC_KEY_URL);
  if (!r.ok) throw new Error('No se pudo obtener la clave pública');

  const pem = (await r.text())
    .replace(/\r\n?/g, '\n')      
    .replace(/[^\S\r\n]+$/gm, '') 
    .trim();

  if (!pem.includes('BEGIN PUBLIC KEY'))
    throw new Error('La clave pública descargada no es válida');

  cachedPem = pem;
  return pem;
}

const b64url   = (b64) => b64.replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
const waToB64  = (wa)  => CryptoJS.enc.Base64.stringify(wa);

export const generarClaveAES = () => ({
  clave: CryptoJS.lib.WordArray.random(32), 
  iv   : CryptoJS.lib.WordArray.random(16), 
});

export const encriptarAES = (texto, clave, iv) => {
  const ct = CryptoJS.AES.encrypt(texto, clave, {
    iv,
    mode   : CryptoJS.mode.CTR,
    padding: CryptoJS.pad.NoPadding,
  }).ciphertext;
  return b64url(CryptoJS.enc.Base64.stringify(iv.clone().concat(ct)));
};


export async function encriptarClaveAESRSA (claveAES) {
  const pem       = await obtenerClavePublicaPem();
  const publicKey = forge.pki.publicKeyFromPem(pem);

  const base64Key = waToB64(claveAES);

  const binaryKey = forge.util.decode64(base64Key);


  const encrypted = publicKey.encrypt(binaryKey, 'RSAES-PKCS1-V1_5');

 
  return forge.util.encode64(encrypted);
}
