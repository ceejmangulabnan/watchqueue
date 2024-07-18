import { ChangeEventHandler } from "react"
import { FormInputData } from "../../types/InputTypes"
import './form_input.scss'

interface FormInputProps {
  inputData: FormInputData
  onChange: ChangeEventHandler
}

const FormInput = ({ inputData, onChange }: FormInputProps) => {
  return (
    <div className="form-input">
      <label htmlFor={inputData.name}>
        {inputData.label}
      </label>
      <input
        name={inputData.name}
        type={inputData.type}
        placeholder={inputData.placeholder}
        min={inputData.minLength}
        onChange={onChange}
      />
    </div>
  )
}

export default FormInput
