const jwt = require('jsonwebtoken');
const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const jwtSign = require('../helpers/jwt-sign')

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

const getUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id }); // здесь парамс.айди   getUserData() {
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
    res.status(200).send(user); // patchUserData({name, about})
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

//В контроллере createUser почта и хеш пароля записываются в базу.
const createUser = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send({ message: 'не заполнены поля формы рег-ции' });
  }
  User
  .findOne({ email })
  .then((user) => {
    if (user) {
      res.status(409).send({ message: 'Пользователь с таким email уже зарегистрирован'})
      return next(new ConflictDataError(err));
    }
    return bcrypt.hash(password, 10);
  })
  .then((hash) => User // далее - зона безопасной регистрации  .catch(next);
    .create({ email, password: hash, })
    .then(user => res.status(201).send({ data: user }))
  )
  .catch(err => res.status(500).send({ message: 'Произошла ошибка сервера' }))
};

const login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send({ message: 'не заполнены поля формы логина' });
  }
  User.findUserByCredentials(email, password) // сравним запрос с БД
    .then((user) => {
      if (!user) {
        res.status(401).send({ message: 'не заполнены поля формы логина' });
        return next(new ConflictDataError(err));
      }
      // создадим токен и возвратим его обратно для доступа
      const token = jwtSign(user)
      console.log(token)
      res.send({ token });
    })
    .catch((err) => {
      res.status(401).send({ message: `Неправильные почта и/или логин: ${err}` });
    });
};

module.exports = { // контроллер возвращает информацию
  getUsers,       // о всех пользователях
  getUser,        // о пользователе
  getCurrentUser, // о текущем пользователе
  createUser,     // возвращает объект пользователя
  editUser,       // редактирование
  editUserAvatar, // редактирование
  login,          // проверяет полученные в теле запроса почту и пароль.
};

// res.status(400). валидейшн эррор или каст эррор
// res.status(401). нет токена или невалидный пароль
// res.status(403). обновление чужой инфы - запрещено
// res.status(404). не найдено по данному айди карточка или пользователь
// res.status(409). попытка зарегать вторую учётку на то же мыло
