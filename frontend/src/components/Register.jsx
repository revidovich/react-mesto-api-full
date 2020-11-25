import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Register = (props) => {
  const [data, setData] = useState( {
    email: '',
    password: ''
  });

  function handleChange (e) {
    const {name, value} = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  function handleSubmit (e) {
    e.preventDefault();
    props.onRegister(data.email, data.password);
    setData({email: '', password: ''});
  }

  return(
    <form
      className="authform"
      onSubmit={handleSubmit}
      name="register"
    >
    <h1
      className="authform__title"
    >Регистрация
    </h1>
      <input
        className="authform__input"
        id="email"
        name="email"
        value={data.email}
        type="email"
        placeholder="E-mail"
        onChange={handleChange}
        autoComplete="on"
      />
      <input
        className="authform__input"
        id="password"
        name="password"
        value={data.password}
        type="password"
        placeholder="Пароль"
        onChange={handleChange}
        autoComplete="current-password"
      />
        <button
          type="submit"
          className="authform__button"
        >Зарегистрироваться
        </button>
    <div className="authform__signin">
      <p className="authform__then-link">Уже зарегистрированы?</p>
      <Link to="sign-in" className="authform__then-link hover-style">Войти</Link>
    </div>
    </form>
  )
}

Register.defaultProps = {
  autoComplete: 'on',
};

export default Register;
