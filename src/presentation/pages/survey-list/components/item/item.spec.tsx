import { mockSurveyModel } from '@/domain/test'
import { IconName } from '@/presentation/components'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { SurveyItem } from './item'

describe('SurveyItem Component', () => {
  it('Should render with correct values', async () => {
    const survey = Object.assign(mockSurveyModel(), {
      didAnswer: true
    })
    render(<SurveyItem survey={survey} />)
    expect(screen.getByRole('icon')).toHaveAttribute('src', IconName.thumbUp)
    expect(screen.getByRole('paragraph')).toHaveTextContent(survey.question)
  })

  it('Should render with correct values', async () => {
    const survey = Object.assign(mockSurveyModel(), {
      didAnswer: false
    })
    render(<SurveyItem survey={survey} />)
    expect(screen.getByRole('icon')).toHaveAttribute('src', IconName.thumbDown)
    expect(screen.getByRole('paragraph')).toHaveTextContent(survey.question)
  })
})
