import React from 'react'
import { render, screen } from '@testing-library/react'
import { Spinner } from './spinner'
import { faker } from '@faker-js/faker'

jest.mock('./spinner.styles.scss', () => {
  return { spinner: 'default-class' }
})

describe('spinner', () => {
  it('Should renders without errors', () => {
    render(<Spinner />)
    const spinner = screen.getByLabelText('spinner')
    expect(spinner).toBeInTheDocument()
  })

  it('Should include external class', () => {
    const className = faker.random.word()
    render(<Spinner className={className} />)
    const spinner = screen.getByLabelText('spinner')
    expect(spinner).toHaveClass(className)
    expect(spinner).toHaveClass('default-class')
  })
})
