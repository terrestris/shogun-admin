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

import { shogunInfoModalVisibleAtom, userInfoAtom, userProfileModalVisibleAtom } from '../../../State/atoms';

import UserService from '../../../Service/UserService/UserService';

import './User.less';
import Avatar from 'antd/lib/avatar/avatar';
import UserUtil from '../../../Util/UserUtil';

interface OwnProps {}

type UserProps = OwnProps;

export const User: React.FC<UserProps> = (props) => {

  let history = useHistory();

  const [userInfo] = useRecoilState(userInfoAtom);
  const [,setProfileVisible] = useRecoilState(userProfileModalVisibleAtom);
  const [,setInfoVisible] = useRecoilState(shogunInfoModalVisibleAtom);

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
      case 'info':
        setInfoVisible(true);
        break;
      case 'settings':
        setProfileVisible(true);
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
              {userInfo?.providerDetails?.email}
            </span>
          </div>
          <Menu.Divider />
          <Menu.Item
            key="settings"
            icon={<SettingOutlined />}
          >
            Profil Einstellungen
          </Menu.Item>
          <Menu.Item
            key="info"
            icon={<InfoCircleOutlined />}
          >
            Info
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item
            key="logout"
            icon={<LogoutOutlined />}
          >
            Ausloggen
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
          {userInfo?.providerDetails?.username}
        </span>
      </div>
    </Dropdown>
  );
};

export default User;
