import { useState, ChangeEvent, ChangeEventHandler, MouseEventHandler } from 'react'
import './login_form_modal.scss'
import FormInput from '../FormInput/FormInput'
import { FormInputData } from '../../types/InputTypes'

interface LoginFormModalProps {
  toggleForm: MouseEventHandler
  modalActive: boolean
  toggleModalActive: MouseEventHandler
}

const LoginFormModal = ({ toggleForm, toggleModalActive, modalActive }: LoginFormModalProps) => {
  const [loginFormData, setLoginFormData] = useState({
    username: '',
    password: ''
  })

  const loginFormInputData: FormInputData[] = [
    {
      id: 1,
      name: 'username',
      type: 'text',
      placeholder: 'Username',
      label: 'Username'
    },
    {
      id: 2,
      name: 'password',
      type: 'password',
      placeholder: 'Password',
      label: 'Password'
    }
  ]


  const handleChange: ChangeEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setLoginFormData({ ...loginFormData, [e.target.name]: e.target.value })
  }

  return (
    <div>
      {
        modalActive && (
          <div className='login-form-modal'>
            <div className='login-form-modal__overlay' onClick={toggleModalActive}></div>
            <div className='login-form-modal__content'>
              <svg className='login-form-modal__close' onClick={toggleModalActive} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" /></svg>
              <p className='login-form-modal__title'>Login</p>
              <div className='login-form-modal__form-container'>
                <form action="">
                  {loginFormInputData.map(input => (
                    <FormInput key={input.id} inputData={input} onChange={handleChange} />
                  ))}
                  <button className='login-form-modal__submit' type='submit'>Submit</button>
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
