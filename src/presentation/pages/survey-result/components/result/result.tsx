import { Calendar } from '@/presentation/components'
import FlipMove from 'react-flip-move'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { type LoadSurveyResult } from '@/domain/usecases'
import Styles from './result-styles.scss'
import { Answer } from '..'

type Props = {
  surveyResult: LoadSurveyResult.Model
}

export const Result: React.FC<Props> = ({ surveyResult }: Props) => {
  const navigate = useNavigate()
  return (
    <>
      <hgroup>
        <Calendar date={surveyResult.date} className={Styles.calendarWrap} />
        <h2>{surveyResult.question}</h2>
      </hgroup>
      <FlipMove className={Styles.answerList}>
        {surveyResult.answers.map((answer, index) => (
          <div key={index}>
            <Answer answer={answer} />
          </div>
        ))}
      </FlipMove>
      <button
        className={Styles.button}
        onClick={() => {
          navigate(-1)
        }}
      >
        Voltar
      </button>
    </>
  )
}
