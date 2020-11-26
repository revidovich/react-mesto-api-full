const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env;

const jwtSign = (user) => {
  return jwt.sign({ _id: user._id },      //   { id },
    NODE_ENV === 'production' ? JWT_SECRET : 'admin-secret', { expiresIn: '7d' }
  )
}

module.exports = jwtSign
