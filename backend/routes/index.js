const router = require('express').Router();
const userRouter = require('./users');
const cardsRouter = require('./cards');
const authsRouter = require('./auths');
const notFoundRouter = require('./not_found');

router.use(
  userRouter,
  cardsRouter,
  authsRouter,
  notFoundRouter,
);

module.exports = router;

// Все роуты, кроме /signin и /signup, защищены авторизацией.