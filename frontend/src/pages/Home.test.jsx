import React from 'react';
import { render } from '@testing-library/react';
import Home from './Home';
import { BrowserRouter } from 'react-router-dom';

describe('Home', function () {
  it('render root element', () => {
    const { container } = render(<BrowserRouter><Home/></BrowserRouter>);
    const element = container.querySelector('.bg-warning .container-fluid');
    expect(element).not.toBeNull();
  });

  it('render links', () => {
    const { container } = render(<BrowserRouter><Home/></BrowserRouter>);
    const element = container.querySelectorAll('a');
    expect(element.length).toEqual(3);
  });

  it('render login link', () => {
    const { container } = render(<BrowserRouter><Home/></BrowserRouter>);
    const element = container.querySelectorAll('a')[0];
    expect(element.getAttribute('href')).toEqual('/login');
  });

  it('render register link', () => {
    const { container } = render(<BrowserRouter><Home/></BrowserRouter>);
    const element = container.querySelectorAll('a')[1];
    expect(element.getAttribute('href')).toEqual('/register');
  });

  it('render join link', () => {
    const { container } = render(<BrowserRouter><Home/></BrowserRouter>);
    const element = container.querySelectorAll('a')[2];
    expect(element.getAttribute('href')).toEqual('/join');
  });
});
