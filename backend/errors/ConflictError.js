class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.status = 409;
  }
}

module.exports = ConflictError;

// res.status(409). попытка зарегать вторую учётку на то же мыло