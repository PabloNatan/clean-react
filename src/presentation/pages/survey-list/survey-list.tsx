import React from 'react'
import Styles from './survey-list-styles.scss'
import IconThumbsUP from '@/presentation/assets/icon-thumb-up.png'
// import IconThumbsDown from '@/presentation/assets/icon-thumb-down.png'
import { Footer, Logo } from '@/presentation/components'

export const SurveyList: React.FC = () => {
  return (
    <div className={Styles.surveyListWrap}>
      <header className={Styles.headerWrap}>
        <div className={Styles.headerContent}>
          <Logo />
          <div className={Styles.logoutWrap}>
            <span>Pablo</span>
            <a href="#">Sair</a>
          </div>
        </div>
      </header>

      <div className={Styles.contentWrap}>
        <h2>Enquetes</h2>
        <ul>
          <li>
            <div className={Styles.surveyContent}>
              <div className={[Styles.iconWrap, Styles.up].join(' ')}>
                <img src={IconThumbsUP} />
              </div>
              <time>
                <span className={Styles.day}>22</span>
                <span className={Styles.month}>03</span>
                <span className={Styles.year}>2020</span>
              </time>
              <p>Qual é seu framework web favorito?</p>
            </div>
            <footer>Ver Reseultado</footer>
          </li>
        </ul>
      </div>

      <Footer />
    </div>
  )
}
