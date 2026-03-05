import { render, screen } from '@testing-library/react';
import App from './App';

test('renders portfolio hero heading', () => {
  render(<App />);
  const headingElement = screen.getByRole('heading', { name: /nihar ranjan/i });
  expect(headingElement).toBeInTheDocument();
});
