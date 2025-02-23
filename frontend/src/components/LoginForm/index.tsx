import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import axiosBase from '@/api/axios'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import useAxiosPrivate from "@/hooks/useAxiosPrivate"
import { useAuth } from "@/hooks/useAuth"
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/hooks/use-toast'

interface LoginFormProps {
  toggleForm: () => void
}

const LoginForm = ({ toggleForm }: LoginFormProps) => {
  const axiosPrivate = useAxiosPrivate()
  const { auth, setAuth } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()
  const loginFormSchema = z.object({
    username: z.string().min(4).regex(/^[a-zA-Z0-9]{4,}$/, 'Username must be at least 4 characters long without special characters'),
    password: z.string().min(8).regex(/^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/, 'Password must include at least 1 uppercase and lowercase letter, 1 number, and 1 special character')
  })

  const loginForm = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      password: ""
    }
  })

  const onSubmit = async (loginValues: z.infer<typeof loginFormSchema>) => {
    try {
      const response = await axiosBase.post('/users/token', loginValues, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      })
      const userData = await axiosPrivate.get('/users/me')

      setAuth({ ...auth, accessToken: response.data.access_token, id: userData.data.id, username: userData.data.username })
      toast({
        title: "Login Successful",
        description: `Welcome back, ${userData.data.username}!`,
        variant: "success"
      })

    } catch (error) {
      console.error(error)
      toast({
        title: "Login Failed",
        description: "Incorrect username or password. Please try again.",
        variant: "destructive"
      })

      loginForm.reset()
      // navigate(0)
    } finally {

    }
  }

  return (
    <Form {...loginForm}>
      <form onSubmit={loginForm.handleSubmit(onSubmit)} className="space-y-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Login</DialogTitle>
          <DialogDescription className="hidden">Login Form</DialogDescription>
        </DialogHeader>
        <FormField
          control={loginForm.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={loginForm.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
      <p className="italic">
        Don't have an account?
        <span className='not-italic text-md font-semibold cursor-pointer' onClick={toggleForm}> Signup</span>
      </p>
    </Form>

  )
}

export default LoginForm
