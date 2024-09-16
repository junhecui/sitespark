import React from 'react';
import { render, screen } from '@testing-library/react';
import TextWidget from '../../src/components/widgets/TextWidget.js';
import '@testing-library/jest-dom';

test('renders the text widget with correct text', () => {
  const data = { text: 'Sample Text', fontSize: 18 };

  render(<TextWidget data={data} />);

  const textElement = screen.getByText(/Sample Text/i);
  expect(textElement).toBeInTheDocument();
  expect(textElement).toHaveStyle('font-size: 18px');
});

test('renders clickable text widget with correct link', () => {
  const data = { text: 'Click Me', clickable: true, link: 'https://example.com' };

  render(<TextWidget data={data} />);

  const linkElement = screen.getByText(/Click Me/i);
  expect(linkElement).toBeInTheDocument();
  expect(linkElement.closest('a')).toHaveAttribute('href', 'https://example.com');
});

test('applies correct styles to the text widget', () => {
  const data = {
    text: 'Styled Text',
    fontSize: 20,
    fontFamily: 'Verdana',
    fontColor: '#ff0000',
    bold: true,
    italic: true,
    textAlign: 'center'
  };

  render(<TextWidget data={data} />);

  const textElement = screen.getByText(/Styled Text/i);
  expect(textElement).toBeInTheDocument();
  expect(textElement).toHaveStyle({
    fontSize: '20px',
    fontFamily: 'Verdana',
    color: '#ff0000',
    fontWeight: 'bold',
    fontStyle: 'italic',
    textAlign: 'center'
  });
});