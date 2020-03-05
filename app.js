const express = require('express');
const app = express();
const server = require('http').createServer(app);
const fritz = require('fritzbox.js');
const request = require('request');
const pug = require('pug');

var options = {
  username: process.env.USER,
  password: process.env.PASSWORD,
  server: process.env.HOST || "fritz.box",
  protocol: process.env.PROTOCOL || "http"
};

const numberOfCalls = process.env.CALLS || 10;

app.use(express.static('public'));
app.set('view engine', 'pug');
app.set('views', './public/pug');

app.get('/', async function(req, res){
  try {
    let data = await getCallList();
    let resolved = await getUnknownNumbers(data);
    
    res.render('index', resolved);
  } catch (e) {
    res.send("Error: " + e);
    res.end();
  }
});

async function getUnknownNumbers(callList) {
  return new Promise(async function(resolve, reject) {
    for (let i = 0; i < callList.calls.length; i++) {
      let entry = callList.calls[i];
      
      if(entry.name == '') {
        try {
          let info = await resolveUnknownNumber(entry.number);
          entry.name = `${info.name} (aus Das Örtliche)`;
        } catch (e) {
          // catches entries w/o names, nothing to be done here...
        }
      }
    }
    
    resolve(callList);
  });
}

async function getCallList() {
  return new Promise(async function(resolve, reject) {
    let retryCount = 0;
    let finished = false;
    let lastError;

    // remove old session ID to force fritzbox.js to sign in again
    options.sid = undefined;

    while (retryCount < 3 && !finished) {
      try {
        let calls = await fritz.getCalls(options);
        let data = new Object();

        data.calls = calls.slice(0, (parseInt(numberOfCalls)));

        finished = true;
        console.log("Retries: " + retryCount);
        resolve(data);
      } catch (e) {
        console.log("Error: " + e);
        lastError = e;
        retryCount++;
      }
    }

    if(!finished) {
      console.log(`Getting data failed after ${retryCount} retries.`);
      reject(lastError);
    }
  });
}

async function resolveUnknownNumber(number) {
  return new Promise(function(resolve, reject) {
    request(`https://www.dasoertliche.de/?form_name=search_inv&ph=${number}`, {
      timeout: 3000
    }, (error, response, body) => {
      if (error) {
        return reject(new Error(error));
      }
      
      if (!body) {
        return reject("Error passing body of html request.");
      }
      
      const step1 = body.split("var itemData = [")[1];
      
      if (!step1) {
        return reject(new Error("Nothing found."));
      }
      
      const arr = eval(step1.split("];")[0]);
      const output = {};
      output.id = arr[1];
      output.website = arr[3];
      output.email = arr[7];
      output.numbers = arr[10];
      output.name = arr[15];
      return resolve(output);
    });
  });
}

server.listen(3000);
console.log("Listening on port 3000.");
