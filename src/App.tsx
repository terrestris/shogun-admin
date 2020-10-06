import React, { useEffect } from 'react';
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

const userService = new UserService();

const App: React.FC = props => {

  const [, setUserInfo] = useRecoilState(userInfoAtom);
  const [, setAppInfo] = useRecoilState(appInfoAtom);

  // Fetch initial data:
  // - applicationInfo
  // - logged in User
  const getInitialData = async () => {
    try {
      const appInfo = await AppInfoService.getAppInfo();
      setAppInfo(appInfo);
      const userInfo = await userService.findOne(appInfo.userId);
      setUserInfo(userInfo);
    } catch (error) {
      Logger.error(error);
    }
  };

  useEffect(() => {
    getInitialData();
  }, []);

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
