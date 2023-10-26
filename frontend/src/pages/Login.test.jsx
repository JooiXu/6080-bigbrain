import React from 'react';
import { render, act } from '@testing-library/react';
import Login from './Login';
import { BrowserRouter } from 'react-router-dom';

import axios from 'axios';

jest.mock('react-redux');
jest.mock('axios');

describe('Login', function () {
  it('render root element', () => {
    const { container } = render(<BrowserRouter><Login/></BrowserRouter>);
    const element = container.querySelector('form');
    expect(element).not.toBeNull();
  });

  it('submit form (success)', async () => {
    const { container } = render(<BrowserRouter><Login/></BrowserRouter>);
    await act(() => {
      container.querySelector('input[name=email]').value = 'email';
      container.querySelector('input[name=password]').value = '123';
      const btn = container.querySelector('button');
      axios.post.mockImplementation(() => Promise.resolve({ data: { email: 'email', token: '123' } }));
      btn.click();
      expect(axios.post).toBeCalledWith('/admin/auth/login', { email: 'email', password: '123' });
      expect(container.querySelector('.alert')).toBeNull();
    })
  });

  it('submit form (fail)', async () => {
    const { container } = render(<BrowserRouter><Login/></BrowserRouter>);
    await act(() => {
      container.querySelector('input[name=email]').value = 'email';
      container.querySelector('input[name=password]').value = '123';
      const btn = container.querySelector('button');
      axios.post.mockImplementation(() => Promise.reject(new Error({ response: { data: { error: '123123' } } })));
      btn.click();
      expect(axios.post).toBeCalledWith('/admin/auth/login', { email: 'email', password: '123' });
    })
    expect(container.querySelector('.alert')).not.toBeNull();
  });
});
