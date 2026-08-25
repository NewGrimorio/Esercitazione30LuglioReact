/*1. Gestione dei file:
leggere un file di testo scelto dall’utente;
creare una copia del file trasformandone il contenuto (ad esempio in maiuscolo);
salvare il risultato in una nuova cartella di output.
Modulo richiesto: fs */

/*3. Elaborazione tramite Stream
La trasformazione del contenuto del file dovrà essere effettuata utilizzando gli Stream, evitando di caricare l’intero file in memoria.
Modulo richiesto: stream*/

const fs = require('fs');
const { Transform } = require('stream');
const { pipeline } = require('stream/promises');
const path = require('path');

/* Stream di trasformazione: converte in maiuscolo ogni chunk che lo attraversa.
 * I chunk arrivano uno alla volta (64 KB di default), quindi il file
 * non viene mai caricato interamente in memoria.
 */
function createUpperCaseTransform() {
  return new Transform({
    transform(chunk, encoding, callback) {
      callback(null, chunk.toString().toUpperCase());
    },
  });
}

/* Legge un file di testo e lo restituisce come stringa.
 * (Usato solo per stampare a video: la trasformazione vera usa gli stream.)*/
async function readTextFile(filePath) {
  return fs.promises.readFile(filePath, 'utf8');
}

// Crea la cartella di output (e le eventuali cartelle intermedie) se non esiste.
async function ensureDir(dirPath) {
  await fs.promises.mkdir(dirPath, { recursive: true });
}

/* Crea una copia del file con il contenuto in maiuscolo, usando una pipeline:
 *   ReadStream -> Transform (uppercase) -> WriteStream
 */
async function createUpperCaseCopy(inputPath, outputPath) {
  await ensureDir(path.dirname(outputPath));
  await pipeline(
    fs.createReadStream(inputPath, { encoding: 'utf8' }),
    createUpperCaseTransform(),
    fs.createWriteStream(outputPath)
  );
  return outputPath;
}

//Restituisce true se il file esiste. 
function fileExists(filePath) {
  return fs.existsSync(filePath);
}

module.exports = {
  readTextFile,
  ensureDir,
  createUpperCaseCopy,
  createUpperCaseTransform,
  fileExists,
};