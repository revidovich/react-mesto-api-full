const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const ForbiddenError = require('../errors/ForbiddenError');

const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    if (!cards) {
      throw new ValidationError('Ошибка на сервере при поиске карточек ');
    }
    res.status(200).send(cards);
  } catch (err) {
    next(err);
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
  try {
    const currentUser = req.user._id;
    const cardToCompare = await Card.findById(req.params._id);
    if (!cardToCompare) {
      throw new NotFoundError('А такой карточки у нас нет в нашей базе данных ');
    } else if (currentUser !== cardToCompare.owner.toString()) {
      throw new ForbiddenError('Нет прав на удаление ');
    }
    const newCard = await Card.findByIdAndRemove(req.params._id);
    res.status(200).send(newCard);
  } catch (err) {
    next(err);
  }
};

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

// const likeCard = (req, res, next) => { // /cards/likes/:_id
//   Card.findByIdAndUpdate(req.params._id, { likes: req.user._id }, { new: true })
//     .then((card) => {
//       // console.log(req)
//       if (!card) {
//         throw new NotFoundError('Нет карточки с таким id');
//       }
//       return res.send(card);
//     })
//     .catch(next);
// }; мой айдишник user 5fbe60db589d5f1f4cbc748a

// const likeCard = (req, res, next) => {
//   console.log(req.user);
//   Card.findByIdAndUpdate(req.params._id, { $addToSet: { likes: req.user._id } }, { new: true })
//     .orFail(new NotFoundError('Нет карточки с таким id'))
//     .then((card) => {
//       res.status(200).send(card);
//     })
//     .catch(next);
// };

const likeCard = async (req, res, next) => {
  try {
    const likedCard = await Card.findByIdAndUpdate(
      req.params._id,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!likedCard) throw new NotFoundError('Карточка не найдена');
    res.status(200).send(likedCard);
  } catch (error) {
    next(error);
  }
};
const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params._id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new NotFoundError('Нет карточки с таким id'))
    .then((cards) => {
      res.send(cards);
    })
    .catch(next);
};

// // Card это объект {"likes":[],"createdAt":"2020-12-02T15:57:41.604Z","_id":"5fc7e7c1949d1604686b7b18","name":"pictures","link":"https://pictures.s3.yandex.net/frontend-developer/cards-compressed/tulinovka.jpg","owner":"5fbe60db589d5f1f4cbc748a","__v":0}

// const dislikeCard = (req, res, next) => {
//   Card.update(req.params._id, { likes: 'req.user._id' }, { likes: '' })
//     .then((card) => {
//       if (!card) {
//         throw new NotFoundError('Нет карточки с таким id');
//       }
//       return res.send(card);
//     })
//     .catch(next);
// };

module.exports = {
  getCards,
  postCard,
  deleteCard,
  getCardById,
  likeCard,
  dislikeCard,
};
