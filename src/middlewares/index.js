const crypto = require('crypto');

const generateToken = (req, res) => {
  const randomToken = crypto.randomBytes(8).toString('hex');
  return res.status(200).json({ randomToken });
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
    return res.status(400).json({ message: 'O campo "password" é origatório' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
  }
  next();
};

module.exports = {
  generateToken,
  emailValidator,
  passwordValidator,
};
