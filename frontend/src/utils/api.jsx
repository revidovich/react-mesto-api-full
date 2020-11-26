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
      headers: this.getHeaders(),
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
      headers: this.getHeaders(),
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
      headers: this.getHeaders(),
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
      headers: this.getHeaders(),
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
      headers: this.getHeaders(),
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
      headers: this.getHeaders(),
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
        headers: this.getHeaders(),
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
        headers: this.getHeaders(),
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
        headers: this.getHeaders(),
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

  getHeaders() {
    const token = localStorage.getItem('jwt') // const token = getToken();
    return {
      ...this.headers,
      'Authorization': `Bearer ${token}`,
    }
  }
}

export const api = new Api({
  baseUrl: 'http://localhost:3000',
  headers: {
    // 'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
}) // anna@ya.ru 111
