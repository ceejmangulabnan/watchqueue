import { useState, useEffect, useRef, ChangeEvent, ChangeEventHandler, MouseEventHandler, } from 'react'
import './login_form_modal.scss'
import FormInput from '../FormInput/FormInput'
import { FormInputData } from '../../types/InputTypes'
import { AxiosError } from 'axios'
import { useAuth } from '../../hooks/useAuth'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'

interface LoginFormModalProps {
  toggleForm: MouseEventHandler
  modalActive: boolean
  toggleLoginForm: () => void
}

const LoginFormModal = ({ toggleForm, toggleLoginForm, modalActive }: LoginFormModalProps) => {
  const [loginFormIsValid, setLoginFormIsValid] = useState(false)
  const [loginFormData, setLoginFormData] = useState({
    username: '',
    password: ''
  })
  const inputRef = useRef<HTMLInputElement>(null)
  const { auth, setAuth } = useAuth()
  const axiosPrivate = useAxiosPrivate()

  useEffect(() => {
    validateForm()
  }, [loginFormData])

  const loginFormInputData: FormInputData[] = [
    {
      id: 1,
      name: 'username',
      type: 'text',
      placeholder: 'Username',
      label: 'Username',
      required: true,
      pattern: '^[a-zA-Z0-9]{4,}$',
      errorMessage: 'Username must be at least 4 characters long without special characters'
    },
    {
      id: 2,
      name: 'password',
      type: 'password',
      placeholder: 'Password',
      label: 'Password',
      pattern: '^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$',
      required: true,
      errorMessage: 'Password must include at least 1 uppercase and lowercase letter, 1 number, and 1 special character'
    }
  ]


  const handleChange: ChangeEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setLoginFormData({ ...loginFormData, [e.target.name]: e.target.value })
  }

  // Validation for each input, returns boolean validity status
  const validateInput = (input: FormInputData): boolean => {
    const inputElement = document.getElementsByName(input.name)[0] as HTMLInputElement

    if (!input.required) {
      return true
    }

    if (inputElement.checkValidity()) {
      return true
    }
    return false
  }

  // Validates all inputs in a form, if all true, returns true
  const validateForm = () => {
    const isValid = loginFormInputData.every(input => {
      return validateInput(input)
    })
    setLoginFormIsValid(isValid)
  }

  // Submit Form
  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault()
    const loginForm = document.getElementById('login-form') as HTMLFormElement
    try {
      validateForm()
      if (loginFormIsValid) {
        const response = await axiosPrivate.post('/users/token', loginFormData, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        })
        const data = await response.data
        const userData = await axiosPrivate.get('/users/me')
        console.log(response)
        setAuth({ ...auth, username: userData.data.username, id: userData.data.id, accessToken: data.access_token })

        loginForm.reset()
        toggleLoginForm()

      }
    } catch (e) {
      const error = e as AxiosError
      if (error.response) {
        console.log(error.toJSON())
      }
    }
  }

  return (
    <div>
      {
        modalActive && (
          <div className='login-form-modal'>
            <div className='login-form-modal__overlay' onClick={toggleLoginForm}></div>
            <div className='login-form-modal__content'>
              <svg className='login-form-modal__close'
                onClick={toggleLoginForm}
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#e8eaed">
                <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
              </svg>
              <p className='login-form-modal__title'>Login</p>
              <div className='login-form-modal__form-container'>
                <form id='login-form'>
                  {loginFormInputData.map(input => (
                    <FormInput key={input.id} inputData={input} onChange={handleChange} inputRef={inputRef} />
                  ))}
                  <button className='login-form-modal__submit' type='submit' onClick={handleSubmit} disabled={!loginFormIsValid}>Submit</button>
                </form>
              </div>
              <p>Don't have an account?
                <span className='toggle-signup' onClick={toggleForm}> Signup</span>
              </p>
            </div>
          </div>
        )
      }
    </div>
  )
}

export default LoginFormModal
