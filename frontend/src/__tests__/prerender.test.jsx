import { act } from 'react';
import { renderToString } from 'react-dom/server';
import { hydrateRoot } from 'react-dom/client';
import { afterEach, expect, it, vi } from 'vitest';
import App from '../App.jsx';

afterEach(() => {
  vi.unstubAllGlobals();
  document.body.innerHTML = '';
});

it('ships readable content and hydrates the mobile menu without replacing the page', async () => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
  const container = document.createElement('div');
  container.innerHTML = renderToString(<App />);
  document.body.append(container);
  const heading = container.querySelector('h1');
  expect(heading.textContent).toContain('ЛЭТИ — победа');
  expect(container.querySelector('#why-leti').textContent).toContain('Почему ЛЭТИ');
  expect(container.querySelector('#why-leti .opacity-0')).toBeNull();

  const onRecoverableError = vi.fn();
  let root;
  await act(async () => {
    root = hydrateRoot(container, <App />, { onRecoverableError });
  });
  expect(onRecoverableError).not.toHaveBeenCalled();
  expect(container.querySelector('h1')).toBe(heading);
  await act(async () => {
    container.querySelector('[aria-controls="mobile-menu"]').click();
  });
  expect(container.querySelector('#mobile-menu')).not.toBeNull();
  await act(async () => root.unmount());
});
