import React from 'react';

import { Switch, Route } from 'react-router-dom';
import ApplicationTable from './ApplicationTable/ApplicationTable';

interface OwnProps { }

type ApplicationProps = OwnProps;

export const ApplicationRoot: React.FC<ApplicationProps> = props => {

  return (
    <Switch>
      <Route
        component={ApplicationTable}
      />
    </Switch>
  );
};

export default ApplicationRoot;
