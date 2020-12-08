const cardsRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards,
  getCardById,
  postCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards.js');

cardsRouter.get('/cards', getCards);

cardsRouter.get('/cards/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().hex(),
  }),
}), getCardById);

cardsRouter.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(/^http[s]?:\/\/\w+/),
  }),
}), postCard);

cardsRouter.delete('/cards/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().hex(),
  }),
}), deleteCard);

cardsRouter.put('/cards/likes/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().hex(),
  }),
}), likeCard);

cardsRouter.delete('/cards/likes/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().hex(),
  }),
}), dislikeCard);

module.exports = cardsRouter;
