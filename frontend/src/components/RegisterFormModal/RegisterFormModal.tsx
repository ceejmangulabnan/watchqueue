import './register_form_modal.scss'
import axios, { AxiosError } from 'axios'
import FormInput from "../FormInput/FormInput"
import { FormInputData } from "../../types/InputTypes"
import { ChangeEvent, ChangeEventHandler, MouseEventHandler, useState } from 'react'

interface RegisterFormModalProps {
  toggleForm: MouseEventHandler
}

const RegisterFormModal = ({ toggleForm }: RegisterFormModalProps) => {
  const [registerModalActive, setRegisterModalActive] = useState(true)
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

  const toggleRegisterModal = () => {
    setRegisterModalActive(!registerModalActive)
  }

  return (
    <div>
      {
        registerModalActive && (
          <div className='register-form-modal'>
            <div className="register-form-modal__overlay" onClick={toggleRegisterModal}></div>
            <div className="register-form-modal__content">
              <svg className='register-form-modal__close' onClick={toggleRegisterModal} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" /></svg>
              <p className='register-form-modal__title'>Create Account</p>
              <div className="register-form-modal__form-container">
                <form action="">
                  {
                    registerFormInputs.map(input => (
                      <FormInput key={input.id} inputData={input} onChange={handleChange} />
                    ))
                  }
                  <button className='register-form-modal__submit' type="submit" onClick={handleSubmit}>Submit</button>
                </form>
              </div>
              <p >Already have an account?
                <span className='toggle-login' onClick={toggleForm}> Login</span>
              </p>
            </div>
          </div>
        )
      }
    </div>
  )
}

export default RegisterFormModal
