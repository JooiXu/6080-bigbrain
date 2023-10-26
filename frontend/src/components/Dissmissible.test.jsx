import React from 'react';
import { render } from '@testing-library/react';
import { DismissibleAlert } from './DismissibleAlert';

describe('Login', function () {
  it('render nothing if not content provided', () => {
    const { container } = render(<DismissibleAlert/>);
    const element = container.querySelector('.alert');
    expect(element).toBeNull();
  });

  it('render text if only text provided', () => {
    const t = '123';
    const { container } = render(<DismissibleAlert text={t}/>);
    const element = container.querySelector('.alert');
    expect(element).not.toBeNull();
    expect(element.textContent).toEqual('123');
  });

  it('render children if only children provided', () => {
    // let t = '123'
    const { container } = render(<DismissibleAlert>
      <p id={'pid'}>Hello <b>World!</b></p>
    </DismissibleAlert>);
    const element = container.querySelector('.alert');
    expect(element).not.toBeNull();
    expect(element.textContent).toEqual('Hello World!');
    expect(element.querySelector('#pid')).not.toBeNull();
    expect(element.querySelector('#pid b')).not.toBeNull();
  });

  it('render children if both children and text provided', () => {
    const t = '123';
    const { container } = render(<DismissibleAlert text={t}>
      <p id={'pid'}>Hello <b>World!</b></p>
    </DismissibleAlert>);
    const element = container.querySelector('.alert');
    expect(element).not.toBeNull();
    expect(element.textContent).toEqual('Hello World!');
    expect(element.querySelector('#pid')).not.toBeNull();
    expect(element.querySelector('#pid b')).not.toBeNull();
  });
});
