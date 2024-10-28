import { useState } from "react"
import LoginForm from "@/components/LoginForm"
import RegisterForm from "@/components/RegisterForm"
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog"
import { LogIn } from 'lucide-react'

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
          <div className='flex items-center gap-2'>
            <LogIn size={20} />
            <button onClick={loginButtonToggle}>Login</button>
          </div>
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
