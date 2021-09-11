const express = require('express');
const rescue = require('express-rescue');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const { emailValidator,
  passwordValidator,
  generateToken,
  tokenValidator,
  nameValidator,
  ageValidator,
  talkValidator,
  watchAtValidator,
  rateValidator } = require('./src/middlewares');

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
  const talkersJson = await fs.readFile(talkersObj);
  const response = JSON.parse(talkersJson);
  
  if (!response) {
    return res.status(200).json(Array([]));
  } 
 return res.status(200).json(response);
});

app.get('/talker/:id', rescue(async (req, res) => {
  const talkersJson = await fs.readFile(talkersObj);
  const response = JSON.parse(talkersJson);
  const { id } = req.params;
  const chosenTalker = response.find((x) => x.id === Number(id));

  if (!chosenTalker) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  } 
  return res.status(200).json(chosenTalker);
}));

app.post('/login', emailValidator, passwordValidator, generateToken);

app.post('/talker',
  tokenValidator,
  nameValidator,
  ageValidator,
  talkValidator,
  watchAtValidator,
  rateValidator,
  rescue(async (req, res) => {
    const { body } = req;
    const talkersJson = await fs.readFile(talkersObj);
    const z = JSON.parse(talkersJson);
    const id = z.length + 1;
    const y = { ...body, id };
    const x = [...z, y];
    fs.writeFile(talkersObj, JSON.stringify(x));
    return res.status(201).json(y);
}));

app.put('/talker/:id',
  tokenValidator,
  nameValidator,
  ageValidator,
  talkValidator,
  watchAtValidator,
  rateValidator,
  rescue(async (req, res) => {
    const { body } = req;
    const { id } = req.params;
    const talkersJson = await fs.readFile(talkersObj);
    const z = JSON.parse(talkersJson);
    const currId = z.findIndex((index) => Number(id) === index.id);
    const bodyModified = { ...body, id: Number(id) };
    z[currId] = bodyModified;
    fs.writeFile(talkersObj, JSON.stringify(z));
    return res.status(200).json(bodyModified);
  }));

  app.delete('/talker/:id',
    tokenValidator,
    async (req, res) => {
    const { id } = req.params;
    const talkersJson = await fs.readFile(talkersObj);
    const z = JSON.parse(talkersJson);
    const currId = z.findIndex((index) => Number(id) === index.id);
    z.splice(currId, 1);
    fs.writeFile(talkersObj, JSON.stringify(z));
    return res.status(200).json({ message: 'Pessoa palestrante deletada com sucesso' });
  });

  app.get('/talker/search',
    tokenValidator,
    async (req, res) => {
    const { q } = req.query;
    const talkersJson = await fs.readFile(talkersObj);
    
    if (!q) {
      return res.status(200).json(talkersJson);    
    }
    const eachTalker = talkersJson.filter(({ name }) => name.includes(q));
    return res.status(200).json(eachTalker || {});
  });
