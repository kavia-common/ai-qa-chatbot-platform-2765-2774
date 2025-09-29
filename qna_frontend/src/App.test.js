import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app stub', () => {
  render(<App />);
  const element = screen.getByText(/App/i);
  expect(element).toBeInTheDocument();
});
