import { type SurveyResultAnswerModel } from '@/domain/models'
import React, { useContext } from 'react'
import Styles from './answer-styles.scss'
import { SurveyResultContext } from '../context/suvery-result-context'

type Props = {
  answer: SurveyResultAnswerModel
}

export const Answer: React.FC<Props> = ({ answer }: Props) => {
  const { onAnswer } = useContext(SurveyResultContext)
  const answerWrapClasses = [Styles.answerWrap]

  const handleAnswerClick = (event: React.MouseEvent): void => {
    if (event.currentTarget.classList.contains('active')) {
      return
    }
    onAnswer(answer.answer)
  }

  if (answer.isCurrenctAccountAnswer) {
    answerWrapClasses.push('active')
  }
  return (
    <li className={answerWrapClasses.join(' ')} onClick={handleAnswerClick}>
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
