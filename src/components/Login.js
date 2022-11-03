import React from "react";
import useValidation from "../hooks/useValidation";

function Login(props) {
  const { values, handleChange, errors, isValid, setValues, resetForm } =
    useValidation({
      email: "",
      password: "",
    });

  function handleSubmit(e) {
    e.preventDefault();
    if (isValid) {
      props.handleLogin(values.password, values.email);
    }
    resetForm();
  }

  return (
    <form className="form form__login" noValidate onSubmit={handleSubmit}>
      <h2 className="form__title">Вход</h2>
      <input
        className="form__input form__input_type_email"
        id="email"
        name="email"
        placeholder="Email"
        onChange={handleChange}
        required
        value={values.email || ""}
        minLength={4}
      />
      <span
        className={`form__input-error email-error ${
          isValid ? "" : "form__input-error_visible"
        }`}
      >
        {errors.email}
      </span>
      <input
        className="form__input form__input_type_password"
        id="password"
        name="password"
        placeholder="Пароль"
        minLength={6}
        maxLength={10}
        onChange={handleChange}
        required
        value={values.password || ""}
      />
      <span
        className={`form__input-error password-error ${
          isValid ? "" : "form__input-error_visible"
        }`}
      >
        {errors.password}
      </span>
      <button className="form__button-submit" type="submit">
        Войти
      </button>
    </form>
  );
}

export default Login;
