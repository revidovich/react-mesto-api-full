const router = require('express').Router();
const userRouter = require('./users');
const cardsRouter = require('./cards');
const authsRouter = require('./auths');
const notFoundRouter = require('./not_found');
const auth = require('../middlewares/auth');

router.use(
  authsRouter,
  notFoundRouter,
);

// Все роуты, кроме /signin и /signup, защищены авторизацией:
router.use('/', auth, userRouter);
router.use('/', auth, cardsRouter);

module.exports = router;