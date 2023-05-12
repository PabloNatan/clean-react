import { mockSurveyModel } from '@/domain/test'
import { IconName } from '@/presentation/components'
import user from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { SurveyItem } from './item'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'

type SutTypes = {
  history: ReturnType<typeof createMemoryRouter>
}

const makeSut = (survey = mockSurveyModel()): SutTypes => {
  const history = createMemoryRouter(
    [
      { path: '/surveys', element: <SurveyItem survey={survey} /> },
      { path: `/surveys/${survey.id}`, element: <></> }
    ],
    {
      initialEntries: ['/surveys'],
      initialIndex: 0
    }
  )
  render(<RouterProvider router={history} />)
  return { history }
}

describe('SurveyItem Component', () => {
  it('Should render with correct values', async () => {
    const survey = Object.assign(mockSurveyModel(), {
      didAnswer: true,
      date: new Date('2020-01-10T00:00:00')
    })
    makeSut(survey)
    expect(screen.getByRole('icon')).toHaveAttribute('src', IconName.thumbUp)
    expect(screen.getByRole('paragraph')).toHaveTextContent(survey.question)
    expect(screen.getByTestId('day')).toHaveTextContent('10')
    expect(screen.getByTestId('month')).toHaveTextContent('jan')
    expect(screen.getByTestId('year')).toHaveTextContent('2020')
  })

  it('Should render with correct values', async () => {
    const survey = Object.assign(mockSurveyModel(), {
      didAnswer: false,
      date: new Date('2019-05-03T00:00:00')
    })
    makeSut(survey)
    expect(screen.getByRole('icon')).toHaveAttribute('src', IconName.thumbDown)
    expect(screen.getByRole('paragraph')).toHaveTextContent(survey.question)
    expect(screen.getByTestId('day')).toHaveTextContent('03')
    expect(screen.getByTestId('month')).toHaveTextContent('mai')
    expect(screen.getByTestId('year')).toHaveTextContent('2019')
  })

  it('Should render with correct values', async () => {
    const survey = mockSurveyModel()
    const { history } = makeSut(survey)
    const showResultButton = screen.getByRole('link')
    await user.click(showResultButton)
    expect(history.state.location.pathname).toBe(`/surveys/${survey.id}`)
  })
})
