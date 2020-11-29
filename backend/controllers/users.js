const jwt = require('jsonwebtoken');
const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const jwtSign = require('../helpers/jwt-sign')
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const ConflictError = require('../errors/ConflictError');

const _getCurrentUser = (req, res) => { // здесь юзер.айди
  // console.log( 'fffffffffffffffffff' + req)
  const { _id } = req.user;
  return User.findOne({_id})
    .then((user) => {
    //   if (!user) { - падает и ничего не отдаёт!!!!!!
    //   throw new NotFoundError('Нет пользователя с таким id');
    // }
      res.status(200).send(user);
    })
    .catch((err) => {
      res.status(401).send({ message: `Ошибка getCurrentUser: ${err}` });
    });
    // .catch(next);
};
const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundError('Нет пользователя с таким id'))
    .then((user) => res.send(user))
    .catch(next);
};

// const getUser = async (req, res) => {
//   try {
//     const user = await User.findOne({ _id: req.params.id }); // здесь парамс.айди   getUserData() {
//     if (!user) {
//       res.status(404).send({ message: 'Нет пользователя с таким id' });
//     } else {
//       res.status(200).send(user);
//     }
//   } catch (err) {
//     res
//       .status(400)
//       .send({ message: `Ошибка на сервере при поиске пользователя: ${err}` });
//   }
// };

const getUser = (req, res, next) => {
  User.findOne({ _id: req.user.id })
    .orFail(new NotFoundError('Нет пользователя с таким id'))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch(next);
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (err) {
    // res
    //   .status(400)
    //   .send({ message: `Ошибка на сервере при поиске полей Users: ${err}` });
    next (err)
  }
};


// const editUser = async (req, res) => {
//   try {
//     const { name, about } = req.body;
//     const newuser = await User.findByIdAndUpdate(
//       { _id: req.user._id },
//       { name, about }
//       );
//     res.status(200).send(newuser); // patchUserData({name, about})
//   } catch (err) {
//     res.status(400).send({ message: `Ошибка на сервере при патче: ${err}` });
//   }
// };
// const editUser = async (req, res, next) => {
//   try {
//     const { name, about } = req.body;
//     const newUser = await User.findByIdAndUpdate({ _id: req.user._id }, { name, about } )
//     res.send(newUser) //да что ж такое!
//   } catch(err){
//     next(err)
//   }
// }
const editUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate({ _id: req.user._id }, { name, about } )
    .orFail(() => new NotFoundError({ message: 'Нет пользователя с таким id' }))
    .catch((err) => {
      throw new ValidationError({ message: 'Указаны некорректные данные' });
    })
    .then((user) => res.send(user)) // не получается вывести нового пользователя
    .catch(next);
};

// const editUserAvatar = async (req, res) => {
//   try {
//     const { avatar } = req.body;
//     const newuser = await User.findByIdAndUpdate(
//       { _id: req.user._id },
//       { avatar },
//     );
//     res.status(200).send(newuser);
//   } catch (err) {
//     res.status(400).send({ message: `Ошибка на сервере при патче авы: ${err}` });
//   }
// };
const editUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
            { _id: req.user._id },
            { avatar },
          )
    .orFail(() => new NotFoundError({ message: 'Нет пользователя с таким id' }))
    .catch((err) => {
      throw new BadRequestError({ message: 'Указаны некорректные данные' });
    })
    .then((user) => res.send(user))
    .catch(next);
};

//В контроллере createUser почта и хеш пароля записываются в базу.
const createUser = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ConflictError({ message: 'не заполнены поля формы рег-ции' });
    // return res.status(400).send({ message: 'не заполнены поля формы рег-ции' });
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
    .then(user => res.status(201).send(user)) //({ data: user }))
  )
  // .catch(err => res.status(500).send({ message: 'Произошла ошибка сервера' }))
  .catch(next);
};

const _login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .orFail(new ConflictDataError('Не заполнены поля формы логина'))
    .then((user) => {
      const token = jwtSign(user)
      res.send({ token });
    })
    .catch(next);
};

const login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    // throw new ConflictDataError('Не заполнены поля формы логина')
    return res.status(400).send({ message: 'не заполнены поля формы логина' });
  }
  User.findUserByCredentials(email, password) // сравним запрос с БД
    .then((user) => {
      if (!user) {
        res.status(401).send({ message: 'не заполнены поля формы логина' });
        return next(new ConflictDataError(err));
        // throw new ConflictDataError('Не заполнены поля формы логина')
      }
      // создадим токен и возвратим его обратно для доступа
      const token = jwtSign(user)
      res.send({ token });
      // console.log(token)
    })
    .catch((err) => {
      res.status(401).send({ message: `Неправильные почта и/или логин: ${err}` });
    });
    // .catch(next);
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
