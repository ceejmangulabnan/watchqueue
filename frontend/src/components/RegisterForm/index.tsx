import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
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

interface RegisterFormProps {
  toggleForm: () => void
}

const RegisterForm = ({ toggleForm }: RegisterFormProps) => {
  const axiosPrivate = useAxiosPrivate()
  const { auth, setAuth } = useAuth()
  const navigate = useNavigate()
  const registerFormSchema = z.object({
    username: z.string().min(4).regex(/^[a-zA-Z0-9]{4,}$/, 'Username must be at least 4 characters long without special characters'),
    password: z.string().min(8).regex(/^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/, 'Password must include at least 1 uppercase and lowercase letter, 1 number, and 1 special character'),
    confirmPassword: z.string().min(8).regex(/^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/, 'Password must include at least 1 uppercase and lowercase letter, 1 number, and 1 special character'),
    email: z.string().regex(/[^\s@]+@[^\s@]+\.[^\s@]+/, 'Please enter a valid email address')
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match"
  })

  const registerForm = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      email: ""
    }
  })

  const onSubmit = async (registerValues: z.infer<typeof registerFormSchema>) => {
    try {
      await axiosPrivate.post('/users/register', registerValues)
      const login = await axiosPrivate.post('/users/token', { username: registerValues.username, password: registerValues.password }, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      })
      const userData = await axiosPrivate.get('/users/me')

      setAuth({ ...auth, accessToken: login.data.access_token, id: userData.data.id, username: userData.data.username })
    } catch (error) {
      console.error(error)
    } finally {
      registerForm.reset()
      navigate(0)
    }
  }

  return (
    <Form {...registerForm}>
      <form onSubmit={registerForm.handleSubmit(onSubmit)} className="space-y-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Create Account</DialogTitle>
          <DialogDescription className="hidden">Register Form</DialogDescription>
        </DialogHeader>
        <FormField
          control={registerForm.control}
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
          control={registerForm.control}
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
        <FormField
          control={registerForm.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Confirm Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={registerForm.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
      <p className="italic">
        Already have an account?
        <span className='not-italic text-md font-semibold cursor-pointer' onClick={toggleForm}> Login</span>
      </p>
    </Form>
  )
}

export default RegisterForm
