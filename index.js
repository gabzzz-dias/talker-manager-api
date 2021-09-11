const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;

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
  
  if (!response) {
    return res.status(200).json(Array([]));
  } 
 return res.status(200).json(response);
});
