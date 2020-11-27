const userRouter = require('express').Router();
const {
  getUsers,
  getUser,
  editUser,
  editUserAvatar,
  getCurrentUser,
} = require('../controllers/users.js');

userRouter.get('/users', getUsers);
userRouter.get('/users/me', getCurrentUser);// для получения информации о текущем
userRouter.get('/users/:_id', getUser);

userRouter.patch('/users/me', editUser);
userRouter.patch('/users/me/avatar', editUserAvatar);//залогиненном пользователе

module.exports = userRouter;
