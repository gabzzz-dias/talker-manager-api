const crypto = require('crypto');
const fs = require('fs').promises;

const generateToken = (req, res) => {
  const token = crypto.randomBytes(8).toString('hex');
  return res.status(200).json({ token });
};

const emailValidator = (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'O campo "email" é obrigatório' });
  }
  const re = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;
  const validEmail = re.test(email);
  if (!validEmail) {
    return res.status(400).json({ message: 'O "email" deve ter o formato "email@email.com"' }); 
  }
  next();
};

const passwordValidator = (req, res, next) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ message: 'O campo "password" é obrigatório' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
  }
  next();
};

const tokenValidator = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ message: 'Token não encontrado' });
  }
  if (authorization.length !== 16) {
    return res.status(401).json({ message: 'Token inválido' });
  }
  next();
};

const nameValidator = (req, res, next) => {
  const { name } = req.body; 
  if (!name) {
    return res.status(400).json({ message: 'O campo "name" é obrigatório' });
  }
  if (name.length < 3) {
    return res.status(400).json({ message: 'O "name" deve ter pelo menos 3 caracteres' }); 
  }
  next();
};

const ageValidator = (req, res, next) => {
  const { age } = req.body;
  if (!age) {
    return res.status(400).json({ message: 'O campo "age" é obrigatório' }); 
  }
  if (age < 18) {
  return res.status(400).json({ message: 'A pessoa palestrante deve ser maior de idade' }); 
  }
  next();
};

const talkValidator = (req, res, next) => {
  const { talk } = req.body;
  if (!talk || !talk.watchedAt || talk.rate === undefined) {
    return res.status(400)
    .json({ message: 'O campo "talk" é obrigatório e "watchedAt" e "rate" não podem ser vazios' });
  }
  next();
};

const watchAtValidator = (req, res, next) => {
  const { watchedAt } = req.body.talk;
  const re = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/i;
  const dateFormat = re.test(watchedAt);

  if (!dateFormat) {
    return res.status(400)
      .json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' }); 
  }
  next();
};

const rateValidator = (req, res, next) => {
  const { rate } = req.body.talk;
  if (!(rate > 0 && rate < 6)) {
    return res.status(400).json({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' });
  }
  next();
};

function readFile() {
  const talkers = fs.readFile('./talker.json', 'utf-8');
  return talkers.then((data) => JSON.parse(data));
}

const talkerSearch = async (req, res) => {
  const { q } = req.query;
  const talkers = await readFile();
  if (!q || q === '') {
    return res.status(200).json(talkers);    
  }   
  const filteredTalkers = talkers.filter((talker) => talker.name.includes(q));
  if (filteredTalkers.length > 0) {
    return res.status(200).json(filteredTalkers); 
  } 
  return res.status(200).json(Array.from([])); 
};

module.exports = {
  generateToken,
  emailValidator,
  passwordValidator,
  tokenValidator,
  nameValidator,
  ageValidator,
  talkValidator,
  watchAtValidator,
  rateValidator,
  talkerSearch,
};
