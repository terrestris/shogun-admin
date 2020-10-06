import React, { useEffect, useState } from 'react';
import {
  useRecoilState
} from 'recoil';

import {
  BrowserRouter as Router,
  Switch,
  Redirect,
  Route
} from 'react-router-dom';
import Header from './Component/Header/Header';

import {
  Result,
  Spin
} from 'antd';

import {
  LoadingOutlined
} from '@ant-design/icons';

import './App.less';
import Portal from './Page/Portal/Portal';
import AppInfoService from './Service/AppInfoService/AppInfoService';
import UserService from './Service/UserService/UserService';
import Logger from 'js-logger';
import { appInfoAtom, userInfoAtom } from './State/atoms';
import { setSwaggerDocs } from './State/static';

const userService = new UserService();

const App: React.FC = props => {

  const [, setUserInfo] = useRecoilState(userInfoAtom);
  const [, setAppInfo] = useRecoilState(appInfoAtom);
  const [loadingState, setLoadingState] = useState<'failed' | 'loading' | 'done'>();

  // Fetch initial data:
  // - swagger docs
  // - applicationInfo
  // - logged in User
  const getInitialData = async () => {
    try {
      setLoadingState('loading');
      const swaggerDoc = await AppInfoService.getSwaggerDocs();
      setSwaggerDocs(swaggerDoc);
      const appInfo = await AppInfoService.getAppInfo();
      setAppInfo(appInfo);
      const userInfo = await userService.findOne(appInfo.userId);
      setUserInfo(userInfo);
      setLoadingState('done');
    } catch (error) {
      setLoadingState('failed');
      Logger.error(error);
    }
  };

  useEffect(() => {
    getInitialData();
  }, []);

  if(loadingState === 'loading') {
    return (
      <Result
        icon={<LoadingOutlined spin/>}
        title="Loading."
      />
    );
  }

  if(loadingState === 'failed') {
    return (
      <Result
        status="warning"
        title="Failed to load the initial data. Check your console."
      />
    );
  }

  return (
    <Router>
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
