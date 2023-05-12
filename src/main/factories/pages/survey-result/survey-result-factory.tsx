import { SurveyResult } from '@/presentation/pages'
import React from 'react'
import { useParams } from 'react-router-dom'
import { makeRemoteLoadSurveyResult } from '../../usecases/load-survey-result/remote-load-survey-result-factory'

export const MakeSurveyResult: React.FC = () => {
  const { id } = useParams()
  return <SurveyResult loadSurveyResult={makeRemoteLoadSurveyResult(id)} />
}
