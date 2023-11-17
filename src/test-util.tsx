// test-utils.js
import { render,RenderOptions } from '@testing-library/react';
import * as React from 'react';
import { MutableSnapshot, RecoilRoot } from 'recoil';

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
