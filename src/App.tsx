import React, { useCallback, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import * as antd from 'antd/lib/index';
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

import Portal from './Page/Portal/Portal';
import AppInfoService from './Service/AppInfoService/AppInfoService';
import UserService from './Service/UserService/UserService';
import Logger from 'js-logger';
import { appInfoAtom, userInfoAtom } from './State/atoms';
import { setSwaggerDocs } from './State/static';
import _isEmpty from 'lodash/isEmpty';
import './App.less';

import config from 'shogunApplicationConfig';

const userService = new UserService(config.path.user);

const App: React.FC = () => {
  const [, setUserInfo] = useRecoilState(userInfoAtom);
  const [, setAppInfo] = useRecoilState(appInfoAtom);
  const [ extensions, setExtensions ] = useState({});
  const [loadingState, setLoadingState] = useState<'failed' | 'loading' | 'done'>();

  useEffect(() => {
    window.React = React;
    window.ReactDOM = ReactDOM;
    // @ts-ignore
    window.antd = antd;
    import(/* webpackIgnore: true */ `${window.location.origin}/assets/extra.js`).then(() => {
      setExtensions(window['admin-extension'].default);
    });
  }, [extensions]);

  // Fetch initial data:
  // - swagger docs
  // - applicationInfo
  // - logged in User
  const getInitialData = useCallback(async () => {
    try {
      setLoadingState('loading');
      const swaggerDoc = await AppInfoService.getSwaggerDocs();
      setSwaggerDocs(swaggerDoc);
      const appInfo = await AppInfoService.getAppInfo();
      setAppInfo(appInfo);
      if (appInfo?.userId) {
        const userInfo = await userService.findOne(appInfo.userId);
        setUserInfo(userInfo);
      }
      setLoadingState('done');
    } catch (error) {
      setLoadingState('failed');
      Logger.error(error);
    }
  }, [setAppInfo, setUserInfo]);

  useEffect(() => {
    getInitialData();
  }, [getInitialData]);

  if (loadingState === 'loading') {
    return (
      <Result
        icon={<LoadingOutlined spin />}
        title="Loading."
      />
    );
  }
  if (loadingState === 'failed') {
    if (!UserService.userIsLoggedIn() && config?.path?.auth?.login) {
      window.location.href = config.path.auth.login;
    } else {
      return (
        <Result
          status="warning"
          title="Failed to load the initial data. Check your console."
        />
      );
    }
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
          <Route path={`${config.appPrefix}/portal`}>
            <Portal extensions={extensions} />
          </Route>
          <Redirect
            exact
            from={`${config.appPrefix}/`}
            to={`${config.appPrefix}/portal`}
          />
        </Switch>
      </React.Suspense>
    </Router>
  );
};

export default App;
