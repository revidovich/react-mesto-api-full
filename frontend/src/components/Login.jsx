import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Login = (props) => {
  const [data, setData] = useState({
    email: '',
    password: '',
  });

  function handleChange (e) {
    const name = e.target.name;
    setData({...data, [name]: e.target.value});
  }

  function handleSubmit (e) {
    e.preventDefault();
    props.onLogin(data.email, data.password);
    setData({email: '', password: ''});
  }

  return (
      <form
        className="authform"
        onSubmit={handleSubmit}
        name="login"
      >
      <h1
        className="authform__title"
      >Вход</h1>
        <input
          className="authform__input"
          placeholder="E-mail"
          value={data.email}
          id="email"
          name="email"
          type="email"
          onChange={handleChange}
          autoComplete="on"
        />
        <input
          className="authform__input"
          id="password"
          name="password"
          type="password"
          value={data.password}
          placeholder="Пароль"
          onChange={handleChange}
          autoComplete="current-password"
        />
        <button
          type="submit"
          className="authform__button"
        >Войти
        </button>
      <div className="authform__signin"
      >
        <p
          className="authform__then-link"
        >Ещё не зарегистрированы?
        </p>
        <Link
          to="sign-up"
          className="authform__then-link hover-style"
        >Регистрация
        </Link>
      </div>
      </form>
  )
}

Login.defaultProps = {
  autoComplete: 'on',
};

export default Login;