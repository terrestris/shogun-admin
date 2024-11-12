// test-utils.js
import * as React from 'react';

import { render,RenderOptions } from '@testing-library/react';
import { MutableSnapshot, RecoilRoot } from 'recoil';

// A type to make all properties - except of the specified ones - of
// an input object optional.
// Example: PartialOmit<SHOGunAPIClient, 'group'>
export type PartialOmit<T, K extends keyof T> = Pick<T, K> & Omit<Partial<T>, K>;

const customRender = (ui: React.ReactElement<any, string | React.JSXElementConstructor<any>>,
  recoilInitializer?: ((mutableSnapshot: MutableSnapshot) => void) | undefined,
  options?: RenderOptions<typeof import('@testing-library/dom/types/queries'), HTMLElement, HTMLElement>) => {
  const AllTheProviders = ({ children }: any) => {
    return (
      <RecoilRoot initializeState={recoilInitializer}>
        {children}
      </RecoilRoot>
    );
  };
  return render(ui, {
    wrapper: AllTheProviders,
    ...options
  });
};

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };
