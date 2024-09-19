import { ChangeEventHandler, useEffect, useState } from "react"
import { FormInputData } from "../../types/InputTypes"
import './form_input.scss'

interface FormInputProps {
  inputData: FormInputData
  onChange: ChangeEventHandler
  inputRef: React.RefObject<HTMLInputElement>
}

const FormInput = ({ inputData, onChange, inputRef }: FormInputProps) => {
  const [focus, setFocus] = useState(false)

  const handleFocus = () => {
    setFocus(true)
  }

  useEffect(() => {
    if (inputData.id === 1) {
      inputRef.current?.focus()
    }
  }, [])

  return (
    <div className="form-input">
      <label htmlFor={inputData.name}>
        {inputData.label}
      </label>
      {
        inputData.id === 1 ? (

          <input
            ref={inputRef}
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

        ) : (

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
        )
      }
      <span>{inputData.errorMessage}</span>
    </div>
  )
}

export default FormInput
