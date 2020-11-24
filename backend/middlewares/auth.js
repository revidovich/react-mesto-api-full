// авторизационный мидлвэр для проверки JWT. для авторизации/ должен верифицировать токен из заголовков.
// OK- мидлвэр должен добавлять пейлоуд токена в объект запроса и вызывать next - пропускает запрос дальше.:
// req.user = payload;
// next();

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');

  } catch (err) {// ELSE-  мидлвэр должен вернуть ошибку 401.
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
