// test-utils.js
import * as React from 'react';
import { render } from '@testing-library/react';
import { RecoilRoot } from 'recoil';

const customRender = (ui, recoilInitializer?, options?) => {
  const AllTheProviders = ({ children }) => {
    return (
      <RecoilRoot initializeState={recoilInitializer}>
        {children}
      </RecoilRoot>
    );
  };
  return render(ui, { wrapper: AllTheProviders, ...options });
};

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };
