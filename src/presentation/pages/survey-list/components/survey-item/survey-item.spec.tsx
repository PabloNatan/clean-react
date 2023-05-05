import { mockSurveyModal } from '@/domain/test'
import { IconName } from '@/presentation/components'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { SurveyItem } from './survey-item'

describe('SurveyItem Component', () => {
  it('Should render with correct values', async () => {
    const survey = Object.assign(mockSurveyModal(), {
      didAnswer: true,
      date: new Date('2020-01-10T00:00:00')
    })
    render(<SurveyItem survey={survey} />)
    expect(screen.getByRole('icon')).toHaveAttribute('src', IconName.thumbUp)
    expect(screen.getByRole('paragraph')).toHaveTextContent(survey.question)
    expect(screen.getByTestId('day')).toHaveTextContent('10')
    expect(screen.getByTestId('month')).toHaveTextContent('jan')
    expect(screen.getByTestId('year')).toHaveTextContent('2020')
  })

  it('Should render with correct values', async () => {
    const survey = Object.assign(mockSurveyModal(), {
      didAnswer: false,
      date: new Date('2019-05-03T00:00:00')
    })
    render(<SurveyItem survey={survey} />)
    expect(screen.getByRole('icon')).toHaveAttribute('src', IconName.thumbDown)
    expect(screen.getByRole('paragraph')).toHaveTextContent(survey.question)
    expect(screen.getByTestId('day')).toHaveTextContent('03')
    expect(screen.getByTestId('month')).toHaveTextContent('mai')
    expect(screen.getByTestId('year')).toHaveTextContent('2019')
  })
})
