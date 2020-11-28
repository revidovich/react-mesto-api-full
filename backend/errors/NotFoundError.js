class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.status = 404;
  }
}

module.exports = NotFoundError;

// res.status(404). не найдено по данному айди карточка или пользователь