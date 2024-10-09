import { useState } from "react"
import LoginForm from "@/components/LoginForm"
import RegisterForm from "@/components/RegisterForm"
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

// Handles the switching between the login and register forms
const LoginRegisterToggle = () => {
  const [isLogin, setIsLogin] = useState(false)
  const [loginButtonClicked, setLoginButtonClicked] = useState(false)

  const toggleForm = () => {
    setIsLogin(!isLogin)
  }

  const loginButtonToggle = () => {
    setLoginButtonClicked(true)
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
            (loginButtonClicked && isLogin)
              ? <LoginForm toggleForm={toggleForm} />
              : <RegisterForm toggleForm={toggleForm} />
          }
        </DialogContent>
      </Dialog>
    </div >
  )
}

export default LoginRegisterToggle
