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

app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use('/', routes); // защита роутов в общем файле для роутов

app.listen(PORT, () => console.log(`App listening on port ${PORT}..`));
