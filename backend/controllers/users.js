/* eslint-disable no-multi-spaces */
const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const getCurrentUser = (req, res) => { // здесь юзер.айди
  const { user } = req.user;
  return User.findUserByCredentials(user)
    .then(() => {
      res.send({ user });
    })
    .catch((err) => {
      res.status(401).send({ message: `Ошибка getCurrentUser: ${err}` });
    });
};

const getUser = async (req, res) => { // здесь gfhfvc.айди
  try {
    const user = await User.findOne({ _id: req.params._id });
    if (!user) {
      res.status(404).send({ message: 'Нет пользователя с таким id' });
    } else {
      res.status(200).send(user);
    }
  } catch (err) {
    res
      .status(400)
      .send({ message: `Ошибка на сервере при поиске пользователя: ${err}` });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (err) {
    res
      .status(400)
      .send({ message: `Ошибка на сервере при поиске полей Users: ${err}` });
  }
};

const editUser = async (req, res) => {
  try {
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate({ _id: req.user._id }, { name, about });
    res.status(200).send(user);
  } catch (err) {
    res.status(400).send({ message: `Ошибка на сервере при патче: ${err}` });
  }
};

const editUserAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    const newavatar = await User.findByIdAndUpdate(
      { _id: req.user._id },
      { avatar },
    );
    res.status(200).send(newavatar);
  } catch (err) {
    res
      .status(400)
      .send({ message: `Ошибка на сервере при патче авы: ${err}` });
  }
};
// const createUser = async (req, res) => {
//   try {
//     const id = User.countDocuments();
//     const user = await User.create({ id, ...req.body });
//     res.status(200).send(user);
//   } catch (err) {
//     res.status(400).send({ message: `Невалидный джейсон вызвал ошибку на сервере при записи: ${err}` });
//   }
// };

//В контроллере createUser почта и хеш пароля записываются в базу.
const createUser = (req, res, next) => {
  const {email, password} = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({ email, password: hash }))
    .then((_id) => res.status(201).send({ _id, email }))
    .catch(err); //(next)?????????
};

const login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then(() => {
      const token = jwt.sign(
        // { _id: user._id },
        {
          _id: 'd285e3dceed844f902650f40',
        },//создаёт JWT, в пейлоуд которого записано свойство _id с идентификатором пользователя.
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch((err) => {
      res.status(401).send({ message: `Неправильные почта и/или логин: ${err}` });
    });
};

module.exports = { // контроллер возвращает информацию
  // eslint-disable-next-line no-multi-spaces
  getUsers,       // о всех пользователях
  getUser,        // о пользователе
  getCurrentUser, // о текущем пользователе
  createUser,     // возвращает объект пользователя
  editUser,       //
  editUserAvatar, //
  login,          // проверяет полученные в теле запроса почту и пароль.
};
