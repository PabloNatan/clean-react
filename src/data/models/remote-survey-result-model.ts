export type RemoteSurveyResultModel = {
  question: string
  date: string
  answers: Array<{
    image?: string
    answer: string
    count: number
    percent: number
    isCurrenctAccountAnswer: boolean
  }>
}
