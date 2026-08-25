// Punto di ingresso: orchestra i vari moduli dell'applicazione.
// Ogni requisito dell'esercitazione è implementato in un file dentro src/.
const { buildPaths } = require('./src/paths');
 
// Nome del file scelto dall'utente: da riga di comando, altrimenti default.
const fileName = process.argv[2] || 'esempio.txt';
const paths = buildPaths(fileName);
 
async function main() {
  console.log('Percorsi in uso:', paths);
  // TODO (nei prossimi passi):
  // 1. fileService.js  -> lettura + copia trasformata via stream (fs, stream)
  // 2. bufferDemo.js   -> stringa -> Buffer -> binario / base64 / stringa (buffer)
  // 3. security.js     -> hash SHA-256, cifratura, decifratura (crypto)
  // 4. systemInfo.js   -> informazioni sulla macchina (os)
  // 5. server.js       -> server HTTP con endpoint e parametri GET (http, url)
  // 6. timers.js       -> stato periodico / backup automatico (timers)
  // 7. checks.js       -> verifiche con assert (assert, util)
}
 
main().catch((err) => {
  console.error('Errore:', err);
  process.exit(1);
});