import React from 'react';
import {
  useRecoilState
} from 'recoil';

import {
  useHistory
} from 'react-router-dom';

import {
  Dropdown,
  Menu
} from 'antd';

import {
  // DownOutlined,
  InfoCircleOutlined,
  LogoutOutlined,
  SettingOutlined
} from '@ant-design/icons';

import { userInfoAtom } from '../../../State/atoms';

// import UserChip from '@terrestris/react-geo/dist/UserChip/UserChip';

import ApplicationInfo from '../../Modal/ApplicationInfo/ApplicationInfo';
import UserProfile from '../../Modal/UserProfile/UserProfile';

import UserService from '../../../Service/UserService/UserService';

// import { AppInfoTypes } from '../../../store/appInfo/types';
// import { AppState } from '../../../store/reducer';
// import { clearAppInfo } from '../../../store/appInfo/actions';

import './User.less';
import Avatar from 'antd/lib/avatar/avatar';
import UserUtil from '../../../Util/UserUtil';

interface OwnProps {}

type UserProps = OwnProps;

export const User: React.FC<UserProps> = (props) => {

  let history = useHistory();

  const [userInfo] = useRecoilState(userInfoAtom);

  const avatarSource = '';

  const doLogout = () => {
    UserService.logout()
      .then(() => {
        // Force reloading of the login page which may be the current page.
        history.push('/notavailable');
        history.replace('/login');

        // onLogoutClick();
      });
  };

  const onMenuClick = (evt: any) => {
    switch (evt.key) {
      case 'settings':
        // Don't do anything, visible state will be handled by the modal itself.
        break;
      case 'info':
        // Don't do anything, visible state will be handled by the modal itself.
        break;
      case 'logout':
        doLogout();
        break;
      default:
        break;
    }
  };

  return (
    <Dropdown
      overlay={
        <Menu
          style={{ width: 256 }}
          onClick={onMenuClick}
          className="user-chip-menu"
        >
          <div
            className="user-name"
          >
            <span>
              {userInfo?.email}
            </span>
          </div>
          <Menu.Divider/>
          <Menu.Item
            key="settings"
          >
            <SettingOutlined />
            <UserProfile
              opener={
                <span
                  className="settings-opener"
                >
                  Profile settings
                </span>
              }
              appInfo={{}}
            />
          </Menu.Item>
          <Menu.Item
            key="info"
          >
            <InfoCircleOutlined />
            <ApplicationInfo
              opener={
                <span
                  className="info-opener"
                >
                  Info
                </span>
              }
              appInfo={{}}
            />
          </Menu.Item>
          <Menu.Divider/>
          <Menu.Item
            key="logout"
          >
            <LogoutOutlined />
            Sign out
          </Menu.Item>
        </Menu>
      }
      trigger={['click']}
    >
      <div>
        <Avatar
          src={avatarSource}
          size="large"
          className="userimage"
        >
          {
            avatarSource ? '' : UserUtil.getInitials(userInfo?.username)
          }
        </Avatar>
        <span
          className="username"
        >
          {userInfo?.username}
        </span>
      </div>
    </Dropdown>
  );
};

export default User;
