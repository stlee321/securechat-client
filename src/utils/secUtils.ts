export async function encryptMessage(
  message: string,
  key: CryptoKey
): Promise<string> {
  const encoder = new TextEncoder();
  const encoded = encoder.encode(message);
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoded
  );
  const pem = ab2pem(encrypted);
  const ivPem = ab2pem(iv);
  return pem + "." + ivPem;
}

export async function decryptMessage(
  encrypted: string,
  key: CryptoKey
): Promise<string> {
  const [pem, ivPem] = encrypted.split(".");
  const bytes = pem2ab(pem);
  const iv = pem2ab(ivPem);
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    bytes
  );
  const decoder = new TextDecoder();
  const message = decoder.decode(decrypted);
  return message;
}

export function ab2pem(buf: ArrayBuffer): string {
  const values = Array.from(new Uint8Array(buf));
  const encodedChunks: string[] = [];
  for (let i = 0; i < values.length; i += 10_000) {
    encodedChunks.push(
      String.fromCharCode.apply(null, values.slice(i, i + 10_000))
    );
  }
  let encoded = "";
  for (let i = 0; i < encodedChunks.length; i++) {
    encoded += encodedChunks[i];
  }
  const encodedB64 = window.btoa(encoded);
  return encodedB64;
}

export function pem2ab(pem: string): ArrayBuffer {
  const encoded = window.atob(pem);
  const buf = new ArrayBuffer(encoded.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = encoded.length; i < strLen; i++) {
    bufView[i] = encoded.charCodeAt(i);
  }
  return buf;
}
