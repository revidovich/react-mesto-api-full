const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers,
  getUser,
  editUser,
  editUserAvatar,
  getCurrentUser,
} = require('../controllers/users.js');

userRouter.get('/users', getUsers);

// остальные - с валидацией

userRouter.get('/users/me', getCurrentUser);

userRouter.get('/users/:_id', celebrate({
  params: Joi.object().keys({ _id: Joi.string().required().length(24).hex() }),
}), getUser);

userRouter.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), editUser);

userRouter.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(/^http[s]?:\/\/\w+/),
  }),
}), editUserAvatar);

module.exports = userRouter;
