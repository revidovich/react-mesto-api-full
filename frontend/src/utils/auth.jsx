export const BASE_URL = 'http://localhost:3000';
// export const BASE_URL = 'https://auth.nomoreparties.co';

export const register = (email, password) => {
  return fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({email, password})
  }) //Регистрация создаёт пользователя с емейл и Пароль,
  .then((res) => {
    if (res.ok) {
      console.log(`успешная регистрация, статус ${res.status}`)
      return res.json();
    }
    console.log(`к сожалению у вас реджект, ошибка ${res.status}`)
    return Promise.reject(res.status);
  })
};

export const authorize = (email, password) => {
  return fetch(`${BASE_URL}/signin`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({email, password})
  })
  .then((response => response.json()))
  .then((data) => {
    if (data.token) {
        localStorage.setItem('jwt', data.token);
        return data;
    }
  })
  .catch(err => console.log(`const authorize ошибка ` + err))
  // .then((res) => {
  //   console.log('в authorize в signin до иф: ' + res);
  //   if (res.ok) {
  //     return res.json();
  //   }
  //   return Promise.reject(res.status);
  // })
};

export const getContent = (token) => {
  return fetch(`${BASE_URL}/users/me`, { //здесь наш токен отправляется в путь
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    }
  })
  .then((res) => {
    console.log('Обновили инфу: ' + res);
    return res.json()
  })
  // .then((res) => {
  //   if (res.ok) {
  //     return res.json();
  //   }
  //   return Promise.reject(res.status);
  // })
}
