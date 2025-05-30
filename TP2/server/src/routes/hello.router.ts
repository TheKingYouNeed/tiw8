import express from 'express';

const helloRouteur = express.Router();

helloRouteur.use((request, response, next) => {
  process.stdout.write('HelloRouter Middleware\n');
  if (request.ip && request.ip.endsWith('127.0.0.1')) {
    process.stdout.write('Request from local IP\n');
    next();
  } else {
    next();
  }
});

helloRouteur.get('/', (request, response) => {
  response.send('Hello TIW8 !');
});

export {
  helloRouteur as HelloRouteur
};
