import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

test('renders the home page', () => {
  render(<App />);
  const linkElement = screen.getByText(/Pick a Puzzle/i);
  expect(linkElement).toBeInTheDocument();
});

test('solving a puzzle', () => {
  render(<App />);
  fireEvent.click(screen.getByTestId('puzzle-0'));
  fireEvent.click(screen.getByTestId('0-2'));
  fireEvent.click(screen.getByTestId('0-3'));
  fireEvent.click(screen.getByTestId('0-4'));
  fireEvent.click(screen.getByTestId('1-2'));
  fireEvent.click(screen.getByTestId('1-4'));
  fireEvent.click(screen.getByTestId('2-2'));
  fireEvent.click(screen.getByTestId('2-3'));
  fireEvent.click(screen.getByTestId('2-4'));
  fireEvent.click(screen.getByTestId('3-0'));
  fireEvent.click(screen.getByTestId('3-1'));
  fireEvent.click(screen.getByTestId('4-1'));
  fireEvent.click(screen.getByTestId('4-4'));
  fireEvent.click(screen.getByTestId('5-0'));
  fireEvent.click(screen.getByTestId('5-3'));
  fireEvent.click(screen.getByTestId('6-2'));

  // Just before solving, the victory banner is not there
  let victoryBanner = screen.queryByText(/Solved/i);
  expect(victoryBanner).toBeNull();

  // Just after solving, the victory banner is there
  fireEvent.click(screen.getByTestId('6-4'));
  victoryBanner = screen.getByText(/Solved/i);
  expect(victoryBanner).toBeInTheDocument();
});