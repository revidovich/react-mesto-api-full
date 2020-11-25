class Api {
  constructor({
    baseUrl,
    headers
  }) {
    this.baseUrl = baseUrl
    this.headers = headers
  }

  //Написать общие функции для Api.js (запрос, обработка ошибок, и.т.д)_common() {  } ??

  getInitialItems() {
    return fetch(`${this.baseUrl}/cards`, {
        headers: this.headers
      })
      .then(res => {
        if (res.ok) {
          return res.json()//Написать общие функции для Api.js (запрос, обработка ошибок, и.т.д)
        }
        return Promise.reject(`Ошибка при обращении к серверу: ${res.status}`)
      })
  }

  postItem({name, link}) {
    return fetch(`${this.baseUrl}/cards`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          name, link
        })
      })
      .then(res => {
        if (res.ok) {
          return res.json()
        }
        return Promise.reject(`Ошибка при обращении к серверу: ${res.status}`)
      })
  }

  deleteItem(_id) {
    return fetch(`${this.baseUrl}/cards/${_id}`, {
        method: 'DELETE',
        headers: this.headers
      })
      .then(res => {
        if (res.ok) {
          return res.json()
        }
        return Promise.reject(`Ошибка при обращении к серверу: ${res.status}`)
      })
  }

  patchUserAvatar(avatar) {
    return fetch(`${this.baseUrl}/users/me/avatar`, {
        method: 'PATCH',
        headers: this.headers,
        body: JSON.stringify(avatar)
      })
      .then(res => {
        if (res.ok) {
          return res.json()
        }
        return Promise.reject(`Ошибка при обращении к серверу: ${res.status}`)
      })
  }

  getUserData() {
    return fetch(`${this.baseUrl}/users/me`, {
        headers: this.headers
      })
      .then(res => {
        if (res.ok) {
          return res.json()
        }
        return Promise.reject(`Ошибка при обращении к серверу: ${res.status}`)
      })
  }

  patchUserData({name, about}) {
    return fetch(`${this.baseUrl}/users/me`, {
        method: 'PATCH',
        headers: this.headers,
        body: JSON.stringify({
          name,
          about
        })
      })
      .then(res => {
        if (res.ok) {
          return res.json()
        }
        return Promise.reject(`Ошибка при обращении к серверу: ${res.status}`)
      })
  }

  putLike(_id) {
    return fetch(`${this.baseUrl}/cards/likes/${_id}`, {
        method: 'PUT',
        headers: this.headers
      })
      .then(res => {
        if (res.ok) {
          return res.json()
        }
        return Promise.reject(`Ошибка при обращении к серверу: ${res.status}`)
      })
  }

  deleteLike(_id) {
    return fetch(`${this.baseUrl}/cards/likes/${_id}`, {
        method: 'DELETE',
        headers: this.headers
      })
      .then(res => {
        if (res.ok) {
          return res.json()
        }
        return Promise.reject(`Ошибка при обращении к серверу: ${res.status}`)
      })
  }

  changeLikeCardStatus(_id, isLiked) {
    return fetch(`${this.baseUrl}/cards/likes/${_id}`, {
        method: `${isLiked ? 'PUT' : 'DELETE'}`,
        headers: this.headers,
        body: JSON.stringify({
          _id
        })
      })
      .then(res => {
        if (res.ok) {
          return res.json()
        }
        return Promise.reject(`Ошибка при обращении к серверу: ${res.status}`)
      })
  }
}

export const api = new Api({
  baseUrl: 'https://localhost:27017/mestodb',
  // baseUrl: 'https://mesto.nomoreparties.co/v1/cohort-14',
  headers: {
    authorization: `Bearer ${localStorage.jwt}`,
    // authorization: 'd53467ef-75db-4cf1-9a1c-2d2c544f18c8',
      'Content-Type': 'application/json'
  }
}) // anna@ya.ru 111
