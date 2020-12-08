const bcrypt = require('bcryptjs');
const User = require('../models/user');
const jwtSign = require('../helpers/jwt-sign');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const ConflictError = require('../errors/ConflictError');

const getCurrentUser = (req, res, next) => {
  const { _id } = req.user;
  return User.findOne({ _id })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      res.status(200).send(user);
    })
    .catch(next);
};

const getUser = (req, res, next) => {
  User.findOne({ _id: req.user.id })
    .orFail(new NotFoundError('Нет пользователя с таким id'))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch(next);
};

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (err) {
    next(err);
  }
};

const editUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate({ _id: req.user._id }, { name, about }, { new: true })
    .orFail(() => new NotFoundError({ message: 'Нет пользователя с таким id' }))
    .catch(() => {
      throw new ValidationError({ message: 'Указаны некорректные данные' });
    })
    .then((user) => res.status(200).send(user))
    .catch(next);
};

const editUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate({ _id: req.user._id }, { avatar }, { new: true })
    .orFail(() => new NotFoundError({ message: 'Нет пользователя с таким id' }))
    .catch(() => {
      throw new ValidationError({ message: 'Указаны некорректные данные' });
    })
    .then((user) => res.status(200).send(user))
    .catch(next);
};

// В контроллере createUser почта и хеш пароля записываются в базу.
const createUser = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ConflictError({ message: 'не заполнены поля формы регистрации' });
  }
  User
    .findOne({ email })
    .then((user) => {
      if (user) {
        return next(new ConflictError('Пользователь с таким email уже зарегистрирован'));
      }
      return bcrypt.hash(password, 10); // вернуть результат исполнения bycrypt
      // через return из одного then
    }) // и получить его в следующем then и там дальше обработать
    .then((hash) => User.create({ email, password: hash })
      .then(({ _id }) => res.status(200).send({ email, _id })))
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => { // проверка в модели
      const token = jwtSign(user);
      res.send({ token });
    })
    .catch(next);
};

module.exports = {
  getUsers,
  getUser,
  getCurrentUser,
  createUser,
  editUser,
  editUserAvatar,
  login,
};
