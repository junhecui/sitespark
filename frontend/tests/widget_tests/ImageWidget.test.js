import React from 'react';
import { render, screen } from '@testing-library/react';
import ImageWidget from '../../src/components/widgets/ImageWidget.js';
import '@testing-library/jest-dom';

test('renders image widget with image', () => {
  const data = { imageUrl: 'https://example.com/image.jpg' };

  render(<ImageWidget data={data} />);

  const imgElement = screen.getByRole('img');
  expect(imgElement).toHaveAttribute('src', 'https://example.com/image.jpg');
});

test('renders clickable image widget with correct link', () => {
  const data = { imageUrl: 'https://example.com/image.jpg', clickable: true, link: 'https://example.com' };

  render(<ImageWidget data={data} />);

  const linkElement = screen.getByRole('img').closest('a');
  expect(linkElement).toHaveAttribute('href', 'https://example.com');
});

test('renders fallback text when no image is provided', () => {
  const data = {};

  render(<ImageWidget data={data} />);

  const textElement = screen.getByText(/Upload Image:/i);
  expect(textElement).toBeInTheDocument();
});