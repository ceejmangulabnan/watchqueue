import { FormInputData } from "../types/InputTypes"
import { validateInput } from "./validateInput"


export const validateForm = (formInputs: FormInputData[], setFormIsValid: React.Dispatch<React.SetStateAction<boolean>>) => {
  const isValid = formInputs.every(input => {
    return validateInput(input)
  })
  setFormIsValid(isValid)
}
