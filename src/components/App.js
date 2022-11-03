import { useState, useEffect } from "react";
import {
  Route,
  Switch,
  Redirect,
  Link,
  NavLink,
  useHistory,
} from "react-router-dom";
import "../index.css";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import ImagePopup from "./ImagePopup";
import CurrentUserContext from "../contexts/CurrentUserContext";
import api from "../utils/api";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import DeletePopup from "./DeletePopup";
import Register from "./Register";
import Login from "./Login";
import InfoTooltip from "./InfoTooltip";
import ProtectedRoute from "./ProtectedRoute";
import { register, login, getMail } from "../utils/auth";

function App() {
  const [isEditPopupOpened, setIsEditPopupOpened] = useState(false);
  const [isImagePopupOpened, setIsImagePopupOpened] = useState(false);
  const [isAddPopupOpened, setIsAddPopupOpened] = useState(false);
  const [isEditAvatarPopupOpened, setIsEditAvatarPopupOpened] = useState(false);
  const [isCardDeletePopupOpened, setIsCardDeletePopupOpened] = useState(false);
  const [isInfoToolPopupOpen, setIsInfoToolPopupOpen] = useState("");
  const [selectedCard, setSelectedCard] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userMail, setUserMail] = useState("");
  const history = useHistory();

  useEffect(() => {
    if (isLoggedIn) {
      history.push("/");
      api
        .getUserInfo()
        .then((data) => {
          setCurrentUser(data);
        })
        .catch((err) => console.log(`Ошибка: ${err}`));
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) {
      history.push("/");
      api
        .getInitialCard()
        .then((data) => {
          setCards(data);
        })
        .catch((err) => console.log(`Ошибка: ${err}`));
    }
  }, [isLoggedIn]);

  useEffect(() => {
    checkToken();
  }, []);

  //регистрация
  function handleRegister(password, email) {
    register(password, email)
      .then((res) => {
        setIsInfoToolPopupOpen("success");
        history.push("/sign-in");
      })
      .catch((err) => {
        setIsInfoToolPopupOpen("error");
      });
  }

  //вход
  function handleLogin(password, email) {
    login(password, email)
      .then((data) => {
        if (data.token) {
          localStorage.setItem("jwt", data.token);
          setIsLoggedIn(true);
          history.push("/");
        }
      })
      .catch((err) => {
        setIsLoggedIn(false);
        history.push("/sign-in");
      });
  }

  //проверка токена
  function checkToken() {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      getMail(jwt)
        .then((res) => {
          if (res) {
            setUserMail(res.data.email);
            setIsLoggedIn(true);
          }
        })
        .catch((err => {
          console.log(err);
        }))
    }
    
  }

  function handleEditProfileClick() {
    setIsEditPopupOpened(true);
  }

  function handleAddPlaceClick() {
    setIsAddPopupOpened(true);
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpened(true);
  }

  function handleCardClick(card) {
    setIsImagePopupOpened(true);
    setSelectedCard(card);
  }

  function handleDeleteButtonClick(card) {
    setIsCardDeletePopupOpened(true);
    setSelectedCard(card);
  }

  function closeAllPopups() {
    setIsEditPopupOpened(false);
    setIsAddPopupOpened(false);
    setIsEditAvatarPopupOpened(false);
    setIsCardDeletePopupOpened(false);
    setIsImagePopupOpened(false);
    setIsInfoToolPopupOpen("");
    setSelectedCard({});
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => console.log(`Ошибка: ${err}`));
  }

  function handleCardDelete(card) {
    setIsLoading(true);
    api
      .deleteCard(card._id)
      .then(() => {
        setCards((state) => state.filter((c) => c._id !== card._id));
        closeAllPopups();
      })
      .catch((err) => console.log(`Ошибка: ${err}`))
      .finally(() => setIsLoading(false));
  }

  function handleUpdateUser(userInfo) {
    setIsLoading(true);
    api
      .editProfile(userInfo)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => console.log(`Ошибка: ${err}`))
      .finally(() => setIsLoading(false));
  }

  function handleUpdateAvatar(link) {
    setIsLoading(true);
    api
      .changeAvatar(link)
      .then((res) => {
        setCurrentUser(res);
        console.log("ddd");
        closeAllPopups();
        console.log("ddd");
      })
      .catch((err) => console.log(`Ошибка: ${err}`))
      .finally(() => setIsLoading(false));
  }

  function handleAddPlaceSubmit(card) {
    setIsLoading(true);
    api
      .addNewCard(card)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => console.log(`Ошибка: ${err}`))
      .finally(() => setIsLoading(false));
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header userMail={userMail} />
        <Switch>
          <ProtectedRoute
            exact
            path="/"
            isLoggedIn={isLoggedIn}
            component={Main}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onEditAvatar={handleEditAvatarClick}
            onCardClick={handleCardClick}
            onCardLike={handleCardLike}
            onCardDelete={handleDeleteButtonClick}
            cards={cards}
          />
          <Route path="/sign-up">
            <Register isLoggedIn={isLoggedIn} handleRegister={handleRegister} />
          </Route>
          <Route path="/sign-in">
            <Login isLoggedIn={isLoggedIn} handleLogin={handleLogin} />
          </Route>
          <Route path="*">
            {isLoggedIn ? <Redirect to="/" /> : <Redirect to="/sign-in" />}
          </Route>
        </Switch>

        <EditProfilePopup
          isOpened={isEditPopupOpened}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
          isLoading={isLoading}
        />

        <EditAvatarPopup
          isOpened={isEditAvatarPopupOpened}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
          isLoading={isLoading}
        />

        <AddPlacePopup
          isOpened={isAddPopupOpened}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
          isLoading={isLoading}
        />

        <ImagePopup
          isOpened={isImagePopupOpened}
          card={selectedCard}
          onClose={closeAllPopups}
        />

        <DeletePopup
          isOpened={isCardDeletePopupOpened}
          onClose={closeAllPopups}
          card={selectedCard}
          onDeleteCard={handleCardDelete}
          isLoading={isLoading}
        />

        <InfoTooltip isOpened={isInfoToolPopupOpen} onClose={closeAllPopups} />

        <Footer />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
