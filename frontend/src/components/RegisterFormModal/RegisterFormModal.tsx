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
    registerUsername: '',
    registerPassword: '',
    registerConfirmPassword: '',
    registerEmail: ''
  })

  // FormInput Props
  const registerFormInputs: FormInputData[] = [
    {
      id: 1,
      name: 'registerUsername',
      type: 'text',
      placeholder: 'Username',
      minLength: 4,
      label: 'Username',
      pattern: '^[a-zA-Z0-9]{4,}$',
      required: true,
      errorMessage: 'Username must be at least 4 characters long without special characters'
    },
    {
      id: 2,
      name: 'registerPassword',
      type: 'password',
      placeholder: 'Password',
      minLength: 8,
      label: 'Password',
      pattern: '^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$',
      required: true,
      errorMessage: 'Password must include at least 1 uppercase and lowercase letter, 1 number, and 1 special character'
    },
    {
      id: 3,
      name: 'registerConfirmPassword',
      type: 'password',
      placeholder: 'Confirm Password',
      minLength: 8,
      label: 'Confirm Password',
      pattern: registerFormData.registerPassword,
      required: true,
      errorMessage: 'Passwords do not match'
    },
    {
      id: 4,
      name: 'registerEmail',
      type: 'email',
      placeholder: 'Email',
      label: 'Email',
      pattern: '[^\\s@]+@[^\\s@]+\\.[^\\s@]+',
      required: true,
      errorMessage: 'Invalid email address'
    }
  ]

  const handleChange: ChangeEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(registerFormData)
    setRegisterFormData({ ...registerFormData, [e.target.name]: e.target.value })
  }

  // Validation for each input, returns boolean validity status
  const validateInput = (input: FormInputData): boolean => {
    // When user inputs check if pattern conditions are being fulfilled
    const inputElement = document.getElementsByName(input.name)[0] as HTMLInputElement

    // If input is not required, skip checking
    if (!input.required) {
      return true
    }

    // checks if set constraints have passed validation, returns true if valid
    if (inputElement.checkValidity()) {
      return true
    }
    return false
  }

  const validateForm = () => {
    const isValid = registerFormInputs.every(input => {
      return validateInput(input)
    })
    return isValid
  }

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault()
    try {
      if (validateForm()) {
        //
        const response = await axios.post('http://localhost:8000/user/register', registerFormData, {
          headers: {
            "Content-Type": "application/json"
          }
        })
        console.log("VALIDATED SUBMITTED", registerFormData)
        console.log(response)
      }
      else {
        console.log("FORM IS INVALID")
      }
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
              <svg className='register-form-modal__close'
                onClick={toggleRegisterModal}
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#e8eaed"
              >
                <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
              </svg>
              <p className='register-form-modal__title'>Create Account</p>
              <div className="register-form-modal__form-container">
                <form>
                  {
                    registerFormInputs.map(input => (
                      <FormInput key={input.id} inputData={input} onChange={handleChange} />
                    ))
                  }
                  <button className='register-form-modal__submit' type="submit" onClick={handleSubmit}>Submit</button>
                </form>
              </div>
              <p className='register-form-modal__login-toggle'>Already have an account?
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
