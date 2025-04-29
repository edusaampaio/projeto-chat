const jwt = require('jsonwebtoken');
const User = require("../models/user");

exports.register = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send({ message: 'Usuário criado!' });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).send({ error: 'Credenciais inválidas' });
  }

  const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  res.send({ token });
};
