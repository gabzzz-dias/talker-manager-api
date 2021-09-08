const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const { emailValidator, passwordValidator, generateToken } = require('./src/middlewares');

const talkersObj = ('./talker.json');  

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});

app.get('/talker', async (req, res) => {
  const talkers = await fs.readFile(talkersObj);
  const response = JSON.parse(talkers);
  
  if (!response) return res.status(200).json(Array([]));

 return res.status(200).json(response);
});

app.get('/talker/:id', async (req, res) => {
  const talkers = await fs.readFile(talkersObj);
  const { id } = req.params;
  const chosenTalker = talkers.find((x) => x.id === id);

  if (!chosenTalker) return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });

  return res.status(200).json(chosenTalker);
});

app.post('/login', emailValidator, passwordValidator, generateToken);
