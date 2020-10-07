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
  InfoCircleOutlined,
  LogoutOutlined,
  SettingOutlined
} from '@ant-design/icons';

import { userInfoAtom } from '../../../State/atoms';

import ApplicationInfo from '../../Modal/ApplicationInfo/ApplicationInfo';
import UserProfile from '../../Modal/UserProfile/UserProfile';

import UserService from '../../../Service/UserService/UserService';

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
      });
  };

  const onMenuClick = (evt: any) => {
    switch (evt.key) {
      case 'logout':
        doLogout();
        break;
      default:
        break;
    }
  };

  return (
    <Dropdown
      className="user-menu"
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
              {userInfo?.keycloakRepresentation?.email}
            </span>
          </div>
          <Menu.Divider/>
          <Menu.Item
            key="settings"
          >
            <UserProfile
              opener={
                <span
                  className="settings-opener"
                >
                  <SettingOutlined />
                  Profile settings
                </span>
              }
            />
          </Menu.Item>
          <Menu.Item
            key="info"
          >
            <ApplicationInfo
              opener={
                <span
                  className="info-opener"
                >
                  <InfoCircleOutlined />
                  Info
                </span>
              }
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
            avatarSource ? '' : UserUtil.getInitials(userInfo)
          }
        </Avatar>
        <span
          className="username"
        >
          {userInfo?.keycloakRepresentation?.username}
        </span>
      </div>
    </Dropdown>
  );
};

export default User;
