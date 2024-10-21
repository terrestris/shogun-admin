import React from 'react';

import BaseEntity from '@terrestris/shogun-util/dist/model/BaseEntity';

export interface ContextValue<T extends BaseEntity> {
  entityType?: string;
  entityName?: string;
  fetchEntities?: () => Promise<void>;
  entities?: T[];
}

export interface GeneralEntityRootProps<T extends BaseEntity> {
  value: ContextValue<T>;
  children: JSX.Element;
}

// Typing the context here with a generic type T is not possible (or at least I didn't find
// a proper way to do so). As a workaround, one must type it while using the context, e.g.:
// const context = useContext<ContextValue<Layer> | undefined>(GeneralEntityRootContext);
export const GeneralEntityRootContext = React.createContext<(ContextValue<any> | undefined)>(undefined);

export const GeneralEntityRootProvider = <T extends BaseEntity,>({
  value,
  children
}: GeneralEntityRootProps<T>): JSX.Element => {
  return (
    <GeneralEntityRootContext.Provider
      value={value}
    >
      {children}
    </GeneralEntityRootContext.Provider>
  );
};

export default GeneralEntityRootContext;
