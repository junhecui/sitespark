import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ButtonWidget from '../../src/components/widgets/ButtonWidget.js';
import '@testing-library/jest-dom';

test('renders the button with correct text', () => {
  const data = { text: 'Click Me' };

  render(<ButtonWidget data={data} />);

  const buttonElement = screen.getByText(/Click Me/i);
  expect(buttonElement).toBeInTheDocument();
});

test('calls onDelete when delete button is clicked', () => {
  const mockDelete = jest.fn();

  render(<ButtonWidget id="1" data={{ text: 'Click Me' }} onDelete={mockDelete} />);
  fireEvent.click(screen.getByText('X'));

  expect(mockDelete).toHaveBeenCalledWith('1');
});