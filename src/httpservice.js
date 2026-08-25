/* 7. Server HTTP
Realizzare un server HTTP che risponda almeno ai seguenti endpoint:
/          -> pagina di benvenuto
/info      -> informazioni del sistema
/hash      -> hash del file
/download  -> download del file elaborato
Modulo richiesto: http
*/
/*
8. Gestione degli URL
Il server deve leggere almeno un parametro GET, es. /utente?nome=Mario
Modulo richiesto: url 
*/
 
const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');
const systemService = require('./systemservice');
const cryptoService = require('./cryptoservice');
 
const PORT = process.env.PORT || 3000;
let server = null;
 
// Crea il server. `filePath` è il file elaborato (copia in maiuscolo).
function createServer(filePath) {
  return http.createServer((req, res) => {
    // Header di sicurezza di base
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
 
    // url: separa il percorso (/utente) dai parametri GET (?nome=Mario)
    const { pathname, searchParams } = new URL(req.url, `http://${req.headers.host}`);
    console.log(`[HTTP] ${req.method} ${req.url}`);
 
    switch (pathname) {
      case '/':
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`<h1>Benvenuto nel server Node.js</h1>
        <ul>
            <li><a href="/info">/info</a> - informazioni sul sistema</li>
            <li><a href="/hash">/hash</a> - hash SHA-256 del file elaborato</li>
            <li><a href="/download">/download</a> - scarica il file elaborato</li>
            <li><a href="/utente?nome=Mario">/utente?nome=Mario</a> - saluto personalizzato</li>
        </ul>`);
        break;
 
      case '/info':
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(systemService.getSystemInfo(), null, 2));
        break;
 
      case '/hash':
        if (!fs.existsSync(filePath)) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'File elaborato non trovato. Esegui prima l\'operazione 1.' }));
          break;
        }
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
          file: path.basename(filePath),
          algorithm: 'sha256',
          hash: cryptoService.calculateSHA256(filePath),
        }, null, 2));
        break;
 
      case '/download':
        if (!fs.existsSync(filePath)) {
          res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end('File elaborato non trovato. Esegui prima l\'operazione 1.');
          break;
        }
        res.writeHead(200, {
          'Content-Type': 'application/octet-stream',
          'Content-Disposition': `attachment; filename="${path.basename(filePath)}"`,
        });
        // Il file viene inviato a stream, senza caricarlo in memoria
        fs.createReadStream(filePath).pipe(res);
        break;
 
      case '/utente': {
        const nome = searchParams.get('nome') || 'ospite';
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`<h1>Ciao, ${nome}!</h1>`);
        break;
      }
 
      default:
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('404 Not Found');
    }
  });
}
 
// Avvia il server (chiamata dal menu). Restituisce una Promise risolta quando è in ascolto.
function startServer(filePath) {
  return new Promise((resolve, reject) => {
    if (server) {
      console.log(`Il server è già in esecuzione su http://localhost:${PORT}`);
      return resolve(server);
    }
    server = createServer(filePath);
    server.on('error', (err) => {
      server = null;
      reject(err);
    });
    server.listen(PORT, () => {
      console.log(`Server in ascolto su http://localhost:${PORT}`);
      resolve(server);
    });
  });
}
 
// Ferma il server (utile per uscire in modo pulito dal menu).
function stopServer() {
  return new Promise((resolve) => {
    if (!server) return resolve();
    server.close(() => {
      console.log('Server fermato.');
      server = null;
      resolve();
    });
  });
}
 
function isRunning() {
  return server !== null;
}
 
module.exports = { startServer, stopServer, isRunning, PORT };

