
'use strict';

const DESTINATION_URL = 'http://localhost:8090/ping';


const http = require('http');
setInterval(() => {

  http.get(DESTINATION_URL, resp => {
    let data = '';
    console.log(resp)
    resp.on('data', chunk => (data += chunk));
    resp.on('end', () => console.log(`recv: ${data}`));
    resp.on('error', err => console.log('Error: ' + err.message));
  });

}, 1000);