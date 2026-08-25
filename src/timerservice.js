/* 9. Timer
Implementare almeno una delle seguenti funzionalità:
stampa periodica dello stato dell'applicazione;
backup automatico;
messaggio programmato;
controllo periodico dell'esistenza del file.
Modulo richiesto: timers
*/

const { setInterval, setTimeout, clearInterval } = require('timers');
const { buildPaths } = require('./paths');
const { fileExists, readTextFile, writeTextFile } = require('./fileservice');

// Esempio di backup automatico del file elaborato ogni 10 secondi.
function startBackupTimer(fileName, intervalMs = 10000) {
  const paths = buildPaths(fileName);
  return setInterval(async () => {
    if (fileExists(paths.upper)) {
      const content = await readTextFile(paths.upper);
      await writeTextFile(paths.backup, content);
      console.log(`Backup automatico salvato in: ${paths.backup}`);
    } else {
      console.log(`File elaborato non trovato: ${paths.upper}`);
    }
  }, intervalMs);
}

// Messaggio programmato ogni 5 secondi.
function messageTimer(message, intervalMs = 5000) {
  return setInterval(() => {
    console.log(`Messaggio programmato: ${message}`);
  }, intervalMs);
}

// Controllo periodico dell'esistenza del file elaborato ogni 7 secondi.
function checkFileExistenceTimer(fileName, intervalMs = 7000) {
  const paths = buildPaths(fileName);
  return setInterval(() => {
    if (fileExists(paths.upper)) {
      console.log(`File elaborato esiste: ${paths.upper}`);
    } else {
      console.log(`File elaborato non trovato: ${paths.upper}`);
    }
  }, intervalMs);
}

// Avvia i tre timer, li lascia girare 30 secondi e poi li ferma.
async function runTimersDemo(fileName) {
  console.log('Avvio dei timer demo (30 secondi)...');
  const timers = [
    startBackupTimer(fileName),
    messageTimer('Questo è un messaggio programmato.'),
    checkFileExistenceTimer(fileName),
  ];
  return new Promise((resolve) => {
    setTimeout(() => {
      timers.forEach(clearInterval);
      console.log('Demo dei timer terminata.');
      resolve();
    }, 30000);
  });
}


module.exports = {
  startBackupTimer,
  messageTimer,
  checkFileExistenceTimer,
  runTimersDemo
};