import { useContext, useState, useEffect, useCallback } from "react";
import "../index.css";
import PopupWithForm from "./PopupWithForm";
import CurrentUserContext from "../contexts/CurrentUserContext";

function EditProfilePopup(props) {
  const user = useContext(CurrentUserContext);
 
  const [formValues, setFormValues] = useState({
    name: '',
    about: ''
  });

  const [formValidity, setFormValidity] = useState({
    nameValid: false,
    aboutValid: false
  });

  const { name, about } = formValues;
  const { nameValid, aboutValid } = formValidity;
  //const isSubmitDesabled = !nameValid && !aboutValid;

  useEffect(() => {
    setFormValues({
      name: user.name,
      about: user.about
    })
  }, [user, props.isOpened]);

  //валидация инпутов
  useEffect(function validateInputs () {
    if (props.isOpened) {
      const isNameValid = name.length > 2 && formValues.name.length < 40;
      const isAboutValid = about.length > 2 && formValues.name.length < 200;
      console.log(isNameValid, isAboutValid) 
      setFormValidity((prevValidity) => ({
        nameValid: isNameValid,
        aboutValid: isAboutValid
      }))
  }}, [formValues, setFormValidity])

  const handleChangeValues = useCallback((e) => {
    const { name, value } = e.target
    setFormValues(prevState => ({...prevState, [name]: value }))
  }, [setFormValues]);

  function handleSubmit(e) {
    e.preventDefault();
    props.onUpdateUser({
      name: formValues.name,
      about: formValues.about,
    });
  }

  return (
    <PopupWithForm
      name="edit"
      title="Редактировать профиль"
      isOpened={props.isOpened}
      onClose={props.onClose}
      onSubmit={handleSubmit}
      textButton={props.isLoading ? "Сохранение..." : "Сохранить"}
    >
      <label className="popup__label">
        <input
          className="popup__input popup__input_type_name"
          id="name"
          type="text"
          name="name"
          value={formValues.name || ''}
          onChange={handleChangeValues}
          placeholder={user.name}
          required
        />
        <span className={`popup__form-error name-error ${nameValid ? "" : 'popup__form-error_visible'}`}>Введите значение от 2 до 40 символов</span>
      </label>
      <label className="popup__label">
        <input
          className="popup__input popup__input_type_role"
          id="role"
          type="text"
          name="about"
          value={formValues.about || ''}
          onChange={handleChangeValues}
          placeholder={user.about}
          required
          minLength="2"
          maxLength="200"
        />
        <span className={`popup__form-error role-error ${aboutValid ? "" : 'popup__form-error_visible'}`}>Введите значение от 2 до 200 символов</span>
      </label>
    </PopupWithForm>
  );
}

export default EditProfilePopup;
