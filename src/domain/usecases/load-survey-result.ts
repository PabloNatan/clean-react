export interface LoadSurveyResult {
  load: () => Promise<LoadSurveyResult.Model>
}

export namespace LoadSurveyResult {
  export type Answer = {
    image?: string
    answer: string
    count: number
    percent: number
    isCurrenctAccountAnswer: boolean
  }
  export type Model = {
    question: string
    date: Date
    answers: Answer[]
  }
}
