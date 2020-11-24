const authRouter = require('express').Router();
const {
  login,
  createUser,
} = require('../controllers/users.js');
// удалите обработчик создания пользователя — он больше не нужен
// userRouter.post('/users', createUser);
authRouter.post('/signin', login);// для логина.контроллер login
authRouter.post('/signup', createUser);// для регистрации.контроллер createUser

module.exports = authRouter;
