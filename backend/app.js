const express = require('express');
const path = require('path');
const PORT = 3000;
const app = express();
const routes = require('./routes/index.js');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

// подключаем мидлвары, роуты и всё остальное...
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // нет сторонним пакетам!

app.use(cors());
app.use('/', routes); // защита роутов - в общем файле для роутов

// Централизованная обработка ошибок
app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ message: err.message });
    return;
  }
  res.status(500).send({ message: `Сервер пятисотит` });
  next(); // дальше нет ничего
});

app.listen(PORT, () => console.log(`App listening on port ${PORT}..`));
