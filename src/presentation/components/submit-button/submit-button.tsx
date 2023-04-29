import { FormContext } from '@/presentation/contexts/form/form-context'
import React, { useContext } from 'react'

type Props = {
  text: string
}

export const SubmitButton: React.FC<Props> = (props) => {
  const { state } = useContext(FormContext)

  return (
    <button type="submit" disabled={!state.isFormValid}>
      {props.text}
    </button>
  )
}
