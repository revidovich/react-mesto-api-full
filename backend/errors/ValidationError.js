class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.status = 400;
  }
}

module.exports = ValidationError;

// res.status(400). валидейшн эррор или каст эррор
