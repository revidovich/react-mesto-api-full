class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.status = 403;
  }
}

module.exports = ForbiddenError;

// res.status(403). обновление чужой инфы - запрещено