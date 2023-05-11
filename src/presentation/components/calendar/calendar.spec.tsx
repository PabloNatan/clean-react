import { render, screen } from '@testing-library/react'
import React from 'react'
import { Calendar } from './calendar'

const makeSut = (date: Date): void => {
  render(<Calendar date={date} />)
}

describe('Calendar Component', () => {
  it('Should render with correct values', async () => {
    const date = new Date('2020-01-10T00:00:00')
    makeSut(date)
    expect(screen.getByTestId('day')).toHaveTextContent('10')
    expect(screen.getByTestId('month')).toHaveTextContent('jan')
    expect(screen.getByTestId('year')).toHaveTextContent('2020')
  })

  it('Should render with correct values', async () => {
    const date = new Date('2019-05-03T00:00:00')
    makeSut(date)
    expect(screen.getByTestId('day')).toHaveTextContent('03')
    expect(screen.getByTestId('month')).toHaveTextContent('mai')
    expect(screen.getByTestId('year')).toHaveTextContent('2019')
  })
})
