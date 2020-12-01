class Api {
  constructor({
    baseUrl,
    headers
  }) {
    this.baseUrl = baseUrl
    this.headers = headers
  }

  _processingRes(res) {
    if (res.ok) {
      return res.json()
    } else {
    return Promise.reject(`Ошибка при обращении к серверу: ${res.status}`)
    }
  }

  getUserData() {
    return fetch(`${this.baseUrl}/users/me`, { //здесь происходит ошибка
      headers: this.getHeaders(),
    })
    .then(this._processingRes)
  }

  getInitialItems() {
    return fetch(`${this.baseUrl}/cards`, {
      headers: this.getHeaders(),
    })
    .then(this._processingRes)
  }

  postItem({name, link}) {
    return fetch(`${this.baseUrl}/cards`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        name, link
      })
    })
    .then(this._processingRes)
  }

  deleteItem(_id) {
    return fetch(`${this.baseUrl}/cards/${_id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    })
    .then(this._processingRes)
  }

  patchUserAvatar(avatar) {
    return fetch(`${this.baseUrl}/users/me/avatar`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(avatar)
    })
    .then(this._processingRes)
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
    .then(this._processingRes)
  }

  putLike(_id) {
    return fetch(`${this.baseUrl}/cards/likes/${_id}`, {
        method: 'PUT',
        headers: this.getHeaders(),
      })
      .then(this._processingRes)
  }

  deleteLike(_id) {
    return fetch(`${this.baseUrl}/cards/likes/${_id}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      })
      .then(this._processingRes)
  }

  changeLikeCardStatus(_id, isLiked) {
    return fetch(`${this.baseUrl}/cards/likes/${_id}`, {
        method: `${isLiked ? 'PUT' : 'DELETE'}`,
        headers: this.getHeaders(),
        body: JSON.stringify({
          _id
        })
      })
      .then(this._processingRes)
  }

  getHeaders() {
    const token = localStorage.getItem('jwt') // надо каждый раз брать его оттуда
    return {
      ...this.headers,
      'Authorization': `Bearer ${token}`,
    }
  }
}

export const api = new Api({
  baseUrl: 'http://localhost:3000',
  // baseUrl: 'https://api.more.students.nomoreparties.xyz',
  headers: {
    // 'Authorization': `Bearer ${token}`,// anna@ya.ru 111
    'Content-Type': 'application/json'
  }
})
