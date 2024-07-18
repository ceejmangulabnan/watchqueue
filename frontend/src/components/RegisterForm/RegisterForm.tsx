import './register_form.scss'
import axios, { AxiosError } from 'axios'
import FormInput from "../FormInput/FormInput"
import { FormInputData } from "../../types/InputTypes"
import { ChangeEvent, ChangeEventHandler, useState } from 'react'


const RegisterForm = () => {
  const [registerFormData, setRegisterFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: ''
  })

  // To be mapped over and passed to FormInput Component as Props
  const registerFormInputs: FormInputData[] = [
    {
      id: 1,
      name: 'username',
      type: 'text',
      placeholder: 'Username',
      minLength: 4,
      label: 'Username'
    },
    {
      id: 2,
      name: 'password',
      type: 'password',
      placeholder: 'Password',
      minLength: 8,
      label: 'Password'
    },
    {
      id: 3,
      name: 'confirmPassword',
      type: 'password',
      placeholder: 'Confirm Password',
      minLength: 8,
      label: 'Confirm Password'
    },
    {
      id: 4,
      name: 'email',
      type: 'email',
      placeholder: 'Email',
      label: 'Email'
    }
  ]

  // TODO: Add data validation before submitting

  const handleChange: ChangeEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(registerFormData)
    setRegisterFormData({ ...registerFormData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault()
    try {
      const response = await axios.post('http://localhost:8000/register', registerFormData, {
        headers: {
          "Content-Type": "application/json"
        }
      })
      const data = await response.data
      console.log(data)

    } catch (e) {
      const error = e as AxiosError
      console.log(error)
    }
  }

  return (
    <div className='register-form'>
      Register Form
      <form action="">
        {
          registerFormInputs.map(input => (
            <FormInput key={input.id} inputData={input} onChange={handleChange} />
          ))
        }
        <button type="submit" onClick={handleSubmit}>Submit</button>
      </form>
    </div>
  )
}

export default RegisterForm
