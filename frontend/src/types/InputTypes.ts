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
