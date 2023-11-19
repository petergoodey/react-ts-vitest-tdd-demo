import App from './App'
import { render, screen, userEvent } from './test/test-utils'

describe('Simple working test', () => {

  it('should increment count on click', async () => {
    render(<App />)
    userEvent.click(screen.getByRole('button'))
    expect(await screen.findByText(/count is 1/i)).toBeVisible()
  })
})