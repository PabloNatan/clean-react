import { Footer, Header } from '@/presentation/components'
import React, { useEffect } from 'react'
import { SurveyItemEmpty } from './components'
import Styles from './survey-list-styles.scss'
import { type LoadSurveyList } from '@/domain/usecases'

type Props = {
  loadSurveyList: LoadSurveyList
}

export const SurveyList: React.FC<Props> = ({ loadSurveyList }: Props) => {
  useEffect(() => {
    ;(async function () {
      loadSurveyList.loadAll()
    })()
  }, [])
  return (
    <div className={Styles.surveyListWrap}>
      <Header />

      <div className={Styles.contentWrap}>
        <h2>Enquetes</h2>
        <ul>
          <SurveyItemEmpty />
        </ul>
      </div>

      <Footer />
    </div>
  )
}
