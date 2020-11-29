const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const ForbiddenError = require('../errors/ForbiddenError');

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    if (!cards) {
      throw new ValidationError('Ошибка на сервере при поиске карточек ');
    }
    res.status(200).send(cards);
  } catch (err) {
    next(err)
  }
};

const postCard = (req, res, next) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;
  Card.create({ name, link, owner: ownerId })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError(`Ошибка на сервере при создании карточки, в метод переданы некорректные данные! ${err}`);
      }
    })
    .catch(next);
};

const deleteCard = async (req, res, next) => {
  try{
    const currentUser = req.user._id
    const cardToCompare = await Card.findById(req.params._id)
    if (!cardToCompare) {
      throw new NotFoundError('А такой карточки у нас нет в нашей базе данных ');
    } else if (currentUser !== cardToCompare.owner.toString()) {
      throw new ForbiddenError('Нет прав на удаление ');
    }
    const newCard = await Card.findByIdAndRemove(req.params._id)
    res.status(200).send(newCard)
  } catch (err) {
    next(err)
  }
}

const getCardById = (req, res, next) => {
  Card.findById(req.params._id)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Нет карточки с таким id');
      }
      return res.send(card);
    })
    .catch(next);
};

module.exports = {
  getCards,
  postCard,
  deleteCard,
  getCardById,
};
