import { useState } from "react"
import LoginFormModal from "../LoginFormModal/LoginFormModal"
import RegisterFormModal from "../RegisterFormModal/RegisterFormModal"

// Handles the switching between the login and register forms
const LoginRegisterToggle = () => {

  const [loginFormModalActive, setLoginFormModalActive] = useState(false)
  const [isLogin, setIsLogin] = useState(false)
  const [loginButtonClicked, setLoginButtonClicked] = useState(false)

  const toggleLoginForm = () => {
    console.log("Login Form Active Toggle", !loginFormModalActive)
    setLoginFormModalActive(!loginFormModalActive)
  }

  const toggleForm = () => {
    setIsLogin(!isLogin)
  }

  const loginButtonToggle = () => {
    setLoginButtonClicked(true)
    setLoginFormModalActive(true)
    setIsLogin(true)
  }


  return (
    <div>
      <button className='login-form-modal__button' onClick={loginButtonToggle}>
        Login
      </button>

      {loginButtonClicked && (
        isLogin
          ? <LoginFormModal toggleForm={toggleForm} modalActive={loginFormModalActive} toggleLoginForm={toggleLoginForm} />
          : <RegisterFormModal toggleForm={toggleForm} />
      )}
    </div >
  )
}

export default LoginRegisterToggle
