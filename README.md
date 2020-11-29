# [Веб-приложение "Место"](https://nutkatuz.github.io/react-mesto-auth/ "Ссылка на GhP")

### Описание проекта
Ссылка на сайт: http://more.students.nomoreparties.xyz
Функциональность:
* регистрация и авторизация,
* редактирование профиля,
* добавление/удаление карточки,
* постановка и снятие лайка.

### Технологии
Фронтенд приложения Место
Бэкенд - REST API сервер на Node.js через веб-фреймворк express.js
База данных - MongoDB. 
Размещение на [облаке](https://console.cloud.yandex.ru/folders/b1ghabk7lhl8jr40808b/compute/instance/ef3rhnsamoq9ang3r4m5/edit-instance).

### Планы
$ ssh mesto@178.154.233.107
Проверка регистрации в постмане: POST http://more.students.nomoreparties.xyz:3000/signup - указываем 3000 порт, так как именно на нём запущен наш Node сервер. Если убрать порт из запроса, ответа не будет. 
