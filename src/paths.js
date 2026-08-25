// Punto 2 – Gestione dei percorsi (modulo: path)
// Tutti i percorsi del progetto vengono costruiti qui, in modo indipendente dal SO.
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const INPUT_DIR = path.join(ROOT_DIR, 'input');
const OUTPUT_DIR = path.join(ROOT_DIR, 'output');

/* Restituisce tutti i percorsi derivati da un nome file di input.
 * Es. "esempio.txt" -> esempio.upper.txt, esempio.enc, esempio.dec.txt
 */
function buildPaths(fileName) {
  const { name, ext } = path.parse(fileName);
  return {
    input: path.join(INPUT_DIR, fileName),
    upper: path.join(OUTPUT_DIR, `${name}.upper${ext}`),
    encrypted: path.join(OUTPUT_DIR, `${name}.enc`),
    decrypted: path.join(OUTPUT_DIR, `${name}.dec${ext}`),
    backup: path.join(OUTPUT_DIR, 'backup', `${name}.bak${ext}`),
  };
}

module.exports = { ROOT_DIR, INPUT_DIR, OUTPUT_DIR, buildPaths };