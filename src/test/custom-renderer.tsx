import { cleanup, render } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(() => {
  cleanup()
})

function customRenderer(ui: React.ReactElement, options = {}) {
  return render(ui, {
    // wrap provider(s) here if needed
    wrapper: ({ children }) => children,
    ...options,
  })
}

export { screen } from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'
// override render export
export { customRenderer as render }