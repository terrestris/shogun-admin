import React from 'react';

import {
  Router,
  Switch,
  Redirect,
  Route
} from 'react-router-dom';
import { createBrowserHistory } from 'history';
import Header from './Component/Header/Header';

import {
  Spin
} from 'antd';

import {
  LoadingOutlined
} from '@ant-design/icons';

import './App.less';
import Portal from './Page/Portal/Portal';

const App: React.FC = props => {

  const history = createBrowserHistory();

  return (
    <Router history={history}>
      <Header />
      <React.Suspense
        fallback={
          <Spin
            className="suspense-spin"
            indicator={
              <LoadingOutlined
                className="suspense-spin-icon"
                spin
              />
            }
          />
        }
      >
        <Switch>
          <Route
            path="/portal"
            component={Portal}
          />
          <Redirect
            exact
            from="/"
            to="/portal"
          />
        </Switch>
      </React.Suspense>
    </Router>
  );
};

export default App;
