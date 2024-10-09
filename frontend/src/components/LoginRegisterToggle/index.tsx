import { useState } from "react"
import LoginForm from "@/components/LoginForm"
import RegisterForm from "@/components/RegisterForm"
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

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
      <Dialog>
        <DialogTrigger asChild>
          <Button onClick={loginButtonToggle}>Login</Button>
        </DialogTrigger>
        <DialogContent>
          {
            loginButtonClicked &&
            (
              isLogin
                ?
                <LoginForm toggleForm={toggleForm} modalActive={loginFormModalActive} toggleLoginForm={toggleLoginForm} />
                : <RegisterForm toggleForm={toggleForm} />
            )
          }
        </DialogContent>
      </Dialog>
    </div >
  )
}

export default LoginRegisterToggle
