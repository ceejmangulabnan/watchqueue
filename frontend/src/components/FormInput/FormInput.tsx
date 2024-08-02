import { ChangeEventHandler, useState } from "react"
import { FormInputData } from "../../types/InputTypes"
import './form_input.scss'

interface FormInputProps {
  inputData: FormInputData
  onChange: ChangeEventHandler
}

const FormInput = ({ inputData, onChange }: FormInputProps) => {
  const [focus, setFocus] = useState(false)

  const handleFocus = () => {
    setFocus(true)
  }

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
        pattern={inputData.pattern}
        required={inputData.required}
        onChange={onChange}
        onBlur={handleFocus}
        data-focused={focus.toString()}
      />
      <span>{inputData.errorMessage}</span>
    </div>
  )
}

export default FormInput
