import React from 'react'
import { render, screen } from '@testing-library/react'
import { Spinner } from './spinner'
import { faker } from '@faker-js/faker'

describe('spinner', () => {
  it('Should include external class', () => {
    const className = faker.random.word()
    render(<Spinner className={className} />)
    const spinner = screen.getByLabelText('spinner')
    expect(spinner).toHaveClass(className)
  })
})
