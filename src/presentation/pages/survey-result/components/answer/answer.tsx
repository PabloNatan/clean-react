import { type LoadSurveyResult } from '@/domain/usecases'
import React from 'react'
import Styles from './result-styles.scss'

type Props = {
  answer: LoadSurveyResult.Answer
}

export const Answer: React.FC<Props> = ({ answer }: Props) => {
  const answerWrapClasses = [Styles.answerWrap]

  if (answer.isCurrenctAccountAnswer) {
    answerWrapClasses.push(Styles.active)
  }
  return (
    <li className={answerWrapClasses.join(' ')}>
      {answer.image && <img src={answer.image} />}
      <span className={Styles.answer} data-testid="answer">
        {answer.answer}
      </span>
      <span className={Styles.percent} data-testid="percent">
        {answer.percent}%
      </span>
    </li>
  )
}
