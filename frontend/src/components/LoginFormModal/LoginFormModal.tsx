import { useState, useEffect, useRef, ChangeEvent, ChangeEventHandler, MouseEventHandler, } from 'react'
import './login_form_modal.scss'
import FormInput from '../FormInput/FormInput'
import { loginFormInputData } from '../../types/InputTypes'
import { AxiosError } from 'axios'
import { useAuth } from '../../hooks/useAuth'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { validateForm } from '../../utils/validateForm'

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
  const formRef = useRef<HTMLFormElement>(null)
  const { auth, setAuth } = useAuth()
  const axiosPrivate = useAxiosPrivate()

  useEffect(() => {
    validateForm(loginFormInputData, setLoginFormIsValid)
  }, [loginFormData])

  const handleChange: ChangeEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setLoginFormData({ ...loginFormData, [e.target.name]: e.target.value })
  }


  // Submit Form
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      validateForm(loginFormInputData, setLoginFormIsValid)
      if (loginFormIsValid) {
        const response = await axiosPrivate.post('/users/token', loginFormData, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        })
        const data = await response.data

        const userDataResponse = await axiosPrivate.get('/users/me')
        const userData = await userDataResponse.data

        setAuth({ ...auth, accessToken: data.access_token, id: userData.id, username: userData.username })
        formRef.current?.reset()
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
                <form id='login-form' ref={formRef} onSubmit={handleSubmit}>
                  {loginFormInputData.map(input => (
                    <FormInput key={input.id} inputData={input} onChange={handleChange} inputRef={inputRef} />
                  ))}
                  <button className='login-form-modal__submit' type='submit' disabled={!loginFormIsValid}>Submit</button>
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
