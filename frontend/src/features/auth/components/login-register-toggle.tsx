import { useState } from 'react'
import LoginForm from '@/features/auth/components/login-form'
import RegisterForm from '@/features/auth/components/register-form'
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog'
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
                    <div
                        onClick={loginButtonToggle}
                        className="tracking-tight flex gap-4 items-center py-2 px-4 rounded-none font-mono text-sm cursor-pointer hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    >
                        <LogIn size={24} />
                        Login
                    </div>
                </DialogTrigger>
                <DialogContent>
                    {loginButtonClicked && isLogin ? (
                        <LoginForm toggleForm={toggleForm} />
                    ) : (
                        <RegisterForm toggleForm={toggleForm} />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default LoginRegisterToggle
