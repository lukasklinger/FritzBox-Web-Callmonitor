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
  let calls = await fritz.getCalls(options);
  let data = new Object();

  if (calls.error) {
    console.log('Error: ' + calls.error.message);
    res.send("Error: " + calls.error.message);
    res.end();
  } else {
    data.calls = calls.slice(0, (parseInt(numberOfCalls) + 1));
    res.render('index', data);
  }
});

server.listen(3000);
console.log("Listening on port 3000.");
