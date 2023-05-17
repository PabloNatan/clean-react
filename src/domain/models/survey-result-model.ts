export type SurveyResultAnswerModel = {
  image?: string
  answer: string
  count: number
  percent: number
  isCurrenctAccountAnswer: boolean
}

export type SurveyResultModel = {
  question: string
  date: Date
  answers: SurveyResultAnswerModel[]
}
