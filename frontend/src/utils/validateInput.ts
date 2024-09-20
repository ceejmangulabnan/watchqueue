import { FormInputData } from "../types/InputTypes"

export const validateInput = (input: FormInputData): boolean => {
  const inputElement = document.getElementsByName(input.name)[0] as HTMLInputElement

  if (!input.required) {
    return true
  }

  if (inputElement.checkValidity()) {
    return true
  }
  return false
}
