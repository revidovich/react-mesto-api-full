import React, { useState, useEffect } from "react";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import { Route, Switch, useHistory } from "react-router-dom";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { api } from "../utils/api";
import ProtectedRoute from "./ProtectedRoute";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import InfoTooltip from './InfoTooltip';
import ImagePopup from "./ImagePopup";
import Register from "./Register.jsx";
import Login from './Login.jsx';
import * as auth from '../utils/auth';

function App() {

  // окна
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = useState(false);
  const [isImgPopupOpen, setImgPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = useState(false);
  const [isInfoTooltipOpen, setInfoTooltipOpen] = useState(false);

  // объекты
  const [selectedCard, setSelectedCard] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [email, setEmail] = useState(null)
  const history = useHistory();

// ----------------------------------------------------------------------------------

  useEffect(() => {
    if (loggedIn) {
      Promise.all([
        api.getUserData(),
        api.getInitialItems()
      ])
      .then(([userInfo, cards]) => {
        setCurrentUser(userInfo);
        setCards(cards);
      })
      .catch((err) => {
        console.log('Ошибка Promise.all при loggedIn: ' + err);
      });
    }
  }, [loggedIn]);  // }, []);

  useEffect(() => {
    if (document.contains(document.querySelector('.popup_is-opened'))) {
      function handleESCclose(evt) {
        if (evt.key === "Escape") {
          console.log(`нажали`);
          closeAllPopups();
        }
      }
      document.addEventListener("keydown", handleESCclose);
      return () => {
        document.removeEventListener("keydown", handleESCclose);
      };
    }
  });

  useEffect(() => {
    if (document.contains(document.querySelector('.popup_is-opened'))) {
      function handleOverlayClose(evt) {
        if (evt.currentTarget === evt.target) {
          closeAllPopups();
        }
      }
      document.querySelector('.popup_is-opened').addEventListener('click', handleOverlayClose)
    }
  })
// ----------------------------------------------------------------------------------

  function closeAllPopups() {
    setEditAvatarPopupOpen(false);
    setEditProfilePopupOpen(false);
    setAddPlacePopupOpen(false);
    setInfoTooltipOpen(false);
    setImgPopupOpen(false);
  }
  function handleCardClick(card) {
    setSelectedCard({ ...card});
    setImgPopupOpen(true);
  }
  function handleEditAvatarClick() {
    setEditAvatarPopupOpen(true);
  }
  function handleEditProfileClick() {
    setEditProfilePopupOpen(true);
  }
  function handleAddPlaceClick() {
    setAddPlacePopupOpen(true);
  }
  function handleUpdateUser({ name, about }) {
    api
      .patchUserData({ name, about })
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`${err}`);
      });
  }
  function handleUpdateAvatar(avatar) {
    api
      .patchUserAvatar(avatar)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`${err}`);
      });
  }

  //Cards

  function handleAddPlaceSubmit({ name, link }) {
    api
      .postItem({ name, link })
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`${err}`);
      });
  }
  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        const newCards = cards.map((c) => (c._id === card._id ? newCard : c));
        setCards(newCards);//С лайками - там нужно id лайка везде удалить и заработает
      })
      .catch((err) => {
        console.log(`${err}`);
      });
  }
  function handleCardDelete(card) {
    api
      .deleteItem(card._id)
      .then(() => {
        setCards(cards.filter((item) => item !== card));
      })
      .catch((err) => console.log(err));
  }

  //Auth

  function handleLogin (email, password) {
    auth.authorize(email, password)
      .then((res) => {
        if (res.token) {
          localStorage.setItem('jwt', res.token)
          console.log('Установил токен ' + res.token);
          setEmail(email)
          setIsSuccess(true)
          setLoggedIn(true)
          history.push('/')
        }
      })
      .catch((err) => {
        if (err === 400) {
          console.log('Не передано одно из полей');
        } else if (err === 401) {
          console.log('Неправильные почта или пароль');
        }
        console.log('Ошибка логина 172: ' + err);
        setIsSuccess(false)
        setLoggedIn(false)
      })
      .finally(() =>{
        setInfoTooltipOpen(true)
      })
  }

  function handleRegister(email, password) {
    auth.register(email, password)
      .then(() => {
        setIsSuccess(true);
        history.push('/sign-in');
        console.log('Что выводит зэн?: ' + email + password)
      })
      .catch((err) => {
        if (err === 400) {
          console.log('Не передано одно из полей, либо пользователь уже существует');
        }
        console.log('Ошибка регистрации: ' + err); // при регистрации же не может быть 401 ошибки ?
        setIsSuccess(false);
      })
      .finally(() =>{
        setInfoTooltipOpen(true)
      })
  }

  function handleLogOut () {
    setEmail(null);
    setIsSuccess(false)
    setLoggedIn(false);
    localStorage.removeItem('jwt');
    history.push('/sign-in');
  }

  function tokenCheck() { // для того чтобы не регаться каждый раз
    const token = localStorage.getItem('jwt');
    console.log('tokenCheck, токен: ' + token);
    if (token) {
      auth.getContent(token)
        .then((res) => { //res.json()
          if (res) {
            setLoggedIn(true);
            setEmail(res.email);
            history.push('/');
          }
        })
        .catch((err) => {
          console.log('Ошибка проверки tokenCheck: ' + err);
          setLoggedIn(false);
          setEmail('');
        })
    } else {
      console.log('нет токена на tokenCheck: ' + token);
    }
  }

  useEffect(() => {
    tokenCheck();
  }, [localStorage]);

// ----------------------------------------------------------------------------------
  return (
    <div className="page">
  <CurrentUserContext.Provider value={currentUser}>
      <div className="page__container">
        <Header
          email={email}
          onLogOut={handleLogOut}
        />

          <Switch>
              <ProtectedRoute
                  exact path={'/'}
                  loggedIn={loggedIn}
              >
                <Main
                  cards={cards}
                  onEditAvatar={handleEditAvatarClick}
                  onEditProfile={handleEditProfileClick}
                  onAddCard={handleAddPlaceClick}
                  onCardClick={handleCardClick}
                  onCardLike={handleCardLike}
                  onCardDelete={handleCardDelete}
                  />
                <Footer />
              </ProtectedRoute>

              <Route path="/sign-up">
                <Register
                onRegister={handleRegister}
                />
              </Route>

              <Route path="/sign-in">
                  <Login
                  onLogin={handleLogin}
                  />
              </Route>
          </Switch>

              <ImagePopup
                isOpen={isImgPopupOpen}
                card={selectedCard}
                onClose={closeAllPopups}
              />
              <EditProfilePopup
                isOpen={isEditProfilePopupOpen}
                onClose={closeAllPopups}
                onUpdateUser={handleUpdateUser}
              />
              <EditAvatarPopup
                isOpen={isEditAvatarPopupOpen}
                onClose={closeAllPopups}
                onUpdateAvatar={handleUpdateAvatar}
              />
              <InfoTooltip
                isOpen={isInfoTooltipOpen}
                onClose={closeAllPopups}
                isSuccess={isSuccess}
              />
              <AddPlacePopup
                isOpen={isAddPlacePopupOpen}
                onClose={closeAllPopups}
                onAddCard={handleAddPlaceSubmit}
              />
      </div>
  </CurrentUserContext.Provider>
    </div>
  );
}
export default App;