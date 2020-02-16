const express = require('express');
const app = express();
const server = require('http').createServer(app);

const pug = require('pug');

const fritz = require('fritzbox.js')
const options = {
  username: process.env.USER,
  password: process.env.PASSWORD,
  server: process.env.HOST || "fritz.box",
  protocol: process.env.PROTOCOL || "http"
}

const numberOfCalls = process.env.CALLS || 20;

app.use(express.static('public'));
app.set('view engine', 'pug');
app.set('views', './public/pug');

app.get('/', async function(req, res){
  try {
    let data = await updateCallList();
    res.render('index', data);
  } catch (e) {
    res.send("Error: " + e);
    res.end();
  }
});

async function updateCallList() {
  return new Promise(async function(resolve, reject) {
    let retryCount = 0;
    let finished = false;
    let lastError;

    while (retryCount < 3 && !finished) {
      try {
        let calls = await fritz.getCalls(options);
        let data = new Object();

        data.calls = calls.slice(0, (parseInt(numberOfCalls)));

        finished = true;
        console.log("Retries: " + retryCount);
        resolve(data);
      } catch (e) {
        lastError = e;
        retryCount++;
      }
    }

    reject(lastError);
  });
}

server.listen(3000);
console.log("Listening on port 3000.");
