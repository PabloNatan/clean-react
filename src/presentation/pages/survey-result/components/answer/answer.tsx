import { type SurveyResultAnswerModel } from '@/domain/models'
import React from 'react'
import Styles from './answer-styles.scss'

type Props = {
  answer: SurveyResultAnswerModel
}

export const Answer: React.FC<Props> = ({ answer }: Props) => {
  const answerWrapClasses = [Styles.answerWrap]

  if (answer.isCurrenctAccountAnswer) {
    answerWrapClasses.push('active')
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
