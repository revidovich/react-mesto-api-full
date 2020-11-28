class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.status = 401;
  }
}

module.exports = UnauthorizedError;

// res.status(401). нет токена или невалидный пароль