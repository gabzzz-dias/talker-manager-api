const crypto = require('crypto');

const generateToken = () => { 
  crypto.randomBytes(8).toString('hex');
};

const emailValidator = (email) => {
  const regex = /^[a-z0-9._]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/i;
  const emailFormat = regex.test(email);

  if (!email.length) return { status: 400, msg: 'O campo "email" é obrigatório' };

  if (!emailFormat) return { status: 400, msg: 'O "email" deve ter o formato "email@email.com"' };
};

const passwordValidator = (password) => {
  if (!password.length) return { status: 400, msg: 'O campo "password" é obrigatório' };

  if (password.length < 6) {
    return { status: 400, msg: 'O "password" deve ter pelo menos 6 caracteres' }; 
  }
};

module.exports = {
  generateToken,
  emailValidator,
  passwordValidator,
};
