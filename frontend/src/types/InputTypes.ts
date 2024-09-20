export interface FormInputData {
  id: number
  name: string
  type: string
  placeholder: string
  minLength?: number
  label: string
  required: boolean
  pattern: string
  errorMessage?: string
}

export const loginFormInputData: FormInputData[] = [
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
