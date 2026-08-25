/* L'applicazione dovrà convertire una stringa in Buffer e mostrarne:
    - la rappresentazione in binario e Base64
    - riconvertire alla stringa originale 
*/
// Converte una stringa in Buffer e ne mostra le varie rappresentazioni.
const { Buffer } = require('buffer');


//Converte una stringa in Buffer (codifica UTF-8).
function stringToBuffer(string) {
  return Buffer.from(string, 'utf8');
}

// Rappresentazione in binario di un Buffer (ogni byte come 8 bit).
function toBinaryString(buffer){
    return Array.from(buffer)
    .map((byte) => byte.toString(2).padStart(8, '0'))
    .join(' ');
}

// Rappresentazione in Base64 di un Buffer.
function toBase64(buffer) {
  return buffer.toString('base64');
}

// Riconverte una stringa Base64 in stringa originale (decodifica UTF-8).
function fromBase64(base64) {
  return Buffer.from(base64, 'base64').toString('utf8');
}

//Fa partire la demo di conversione stringa -> Buffer -> binario/Base64 -> stringa originale.
function runBufferDemo(string){
    console.log("Prova di conversione stringa -> Buffer -> binario/Base64 -> stringa originale");
    console.log("Stringa originale:", string);
    const buffer = stringToBuffer(string);
    console.log("Buffer:", buffer);
    console.log("Rappresentazione binaria:", toBinaryString(buffer));
    const base64 = toBase64(buffer);
    console.log("Rappresentazione Base64:", base64);
    const originalString = fromBase64(base64);
    console.log("Riconvertita da Base64 a stringa originale:", originalString);
    console.log("Corrisponde all'originale?", originalString === string);
    return { buffer, base64, originalString };
}

// Esporta le funzioni per l'uso in altri moduli.
module.exports={
    stringToBuffer,
    toBinaryString,
    toBase64,
    fromBase64,
    runBufferDemo
}

