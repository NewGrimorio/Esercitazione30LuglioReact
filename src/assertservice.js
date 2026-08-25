/*
10. Assert
Utilizzare il modulo assert per verificare almeno tre condizioni, ad esempio:
il file esiste;
l'hash non è vuoto;
il contenuto trasformato è diverso da quello originale;
il server è stato configurato correttamente.
*/

const assert = require('assert');
const { fileExists, readTextFile } = require('./fileservice');
const { calculateSHA256 } = require('./cryptoservice');
const { buildPaths } = require('./paths');
const { isRunning } = require('./httpservice');

function assertFileExists(filePath) {
  assert.ok(fileExists(filePath), `Il file non esiste: ${filePath}`);
}

function assertHashIsNotEmpty(hash) {
  assert.ok(hash && hash.length > 0, 'L\'hash è vuoto');
}

function assertContentIsDifferent(originalContent, transformedContent) {
  assert.notStrictEqual(originalContent, transformedContent, 'Il contenuto trasformato è uguale all\'originale');
}

function assertServerIsConfigured() {
  assert.ok(isRunning(), 'Il server non è in esecuzione');
}

async function runAssertionsDemo(fileName) {
  const paths = buildPaths(fileName);
  console.log('=== Verifiche con assert ===');
  assertFileExists(paths.input);
  console.log('OK - il file di input esiste');
  assertFileExists(paths.upper);
  console.log('OK - il file elaborato esiste');
  const hash = calculateSHA256(paths.upper);
  assertHashIsNotEmpty(hash);
  console.log('OK - l\'hash non è vuoto');
  const original = await readTextFile(paths.input);
  const transformed = await readTextFile(paths.upper);
  assertContentIsDifferent(original, transformed);
  console.log('OK - il contenuto trasformato è diverso dall\'originale');
  assertServerIsConfigured();
  console.log('OK - il server HTTP è in esecuzione');
  console.log('Tutte le verifiche sono passate.');
}

module.exports = {
  assertFileExists,
  assertHashIsNotEmpty,
  assertContentIsDifferent,
  assertServerIsConfigured,
  runAssertionsDemo
};