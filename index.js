// Punto di ingresso: menu interattivo che orchestra i vari moduli dell'applicazione.
// Ogni requisito dell'esercitazione è implementato in un file dentro src/.
const readline = require('readline');
const { buildPaths } = require('./src/paths');
const fileService = require('./src/fileservice');
const bufferService = require('./src/bufferservice');
const cryptoService = require('./src/cryptoservice');
const systemService = require('./src/systemservice');
const httpService = require('./src/httpservice');

// File di input: da riga di comando, altrimenti default.
const fileName = process.argv[2] || 'Divina_Commedia_Inferno_Canto_I.txt';
const paths = buildPaths(fileName);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

/** Versione Promise di rl.question, così possiamo usare await. */
function ask(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

function showMenu() {
  console.log('\n========== MENU ==========');
  console.log(`File in uso: ${fileName}`);
  console.log('1) Leggi il file e crea copia in maiuscolo (fs, stream)');
  console.log('2) Demo Buffer (buffer)');
  console.log('3) Hash SHA-256 e cifratura (crypto)');
  console.log('4) Informazioni sul sistema (os)');
  console.log('5) Avvia server HTTP (http, url)');
  console.log('6) Timer (timers)');
  console.log('7) Verifiche con assert (assert, util)');
  console.log('0) Esci');
  console.log('==========================');
}

// --- Punti 1 e 3: lettura e copia trasformata via stream ---
async function handleFile() {
  if (!fileService.fileExists(paths.input)) {
    console.error(`File di input non trovato: ${paths.input}`);
    return;
  }

  const original = await fileService.readTextFile(paths.input);
  console.log('\n=== Contenuto originale ===');
  console.log(original);

  await fileService.createUpperCaseCopy(paths.input, paths.upper);
  console.log(`Copia in maiuscolo salvata in: ${paths.upper}`);

  const transformed = await fileService.readTextFile(paths.upper);
  console.log('\n=== Contenuto trasformato ===');
  console.log(transformed);
}

async function main() {
  let running = true;

  while (running) {
    showMenu();
    const choice = (await ask('Scegli un\'operazione: ')).trim();

    switch (choice) {
      case '1':
        await handleFile();
        break;
      case '2': {
        const str = await ask('Inserisci una stringa: ');
        bufferService.runBufferDemo(str || 'Ciao Node.js');
        break;
      }
      case '3':
        if (!fileService.fileExists(paths.upper)) {
          console.log("Esegui prima l'operazione 1 per generare il file elaborato.");
          break;
        }
        await cryptoService.runCryptoDemo(paths.upper, ask);
        break;
      case '4':
        systemService.getSystemInfo();
        break;
      case '5':
        await httpService.startServer(paths.upper);
        console.log('Il menu resta attivo: puoi continuare a usare le altre operazioni.');
        break;
      case '6':
        console.log('TODO: punto 9 (timers)');
        break;
      case '7':
        console.log('TODO: punti 10 e 11 (assert, util)');
        break;
      case '0':
        console.log('Uscita.');
        await httpService.stopServer();
        running = false;
        break;
      default:
        console.log(`Scelta non valida: "${choice}"`);
    }
  }

  rl.close();
}

main().catch((err) => {
  console.error('Errore:', err.message);
  rl.close();
  process.exit(1);
});