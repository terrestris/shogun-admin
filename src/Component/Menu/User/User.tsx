import React from 'react';
import {
  useRecoilState
} from 'recoil';

import {
  Dropdown,
  Menu
} from 'antd';

import {
  InfoCircleOutlined,
  LogoutOutlined,
  SettingOutlined
} from '@ant-design/icons';

import { shogunInfoModalVisibleAtom, userInfoAtom } from '../../../State/atoms';

import './User.less';
import Avatar from 'antd/lib/avatar/avatar';
import UserUtil from '../../../Util/UserUtil';
import useSHOGunAPIClient from '../../../Hooks/useSHOGunAPIClient';

interface OwnProps { }

type UserProps = OwnProps;

export const User: React.FC<UserProps> = (props) => {

  const [userInfo] = useRecoilState(userInfoAtom);
  const [, setInfoVisible] = useRecoilState(shogunInfoModalVisibleAtom);

  const client = useSHOGunAPIClient();

  const avatarSource = '';

  const onMenuClick = (evt: any) => {
    switch (evt.key) {
      case 'info':
        setInfoVisible(true);
        break;
      case 'settings':
        // TODO: Fix settings for non keycloak setups
        client.getKeycloak()?.accountManagement();
        break;
      case 'logout':
        // TODO: Fix logout for non keycloak setups
        client.getKeycloak()?.logout();
        break;
      default:
        break;
    }
  };

  const userName = userInfo?.providerDetails?.username || userInfo?.authProviderId;

  return (
    <Dropdown
      className="user-menu"
      overlay={
        <Menu
          style={{ width: 256 }}
          onClick={onMenuClick}
          className="user-chip-menu"
        >
          {
            userName &&
            <div
              className="user-name"
            >
              <span>
                {userName}
              </span>
            </div>
          }
          {
            userName &&
            <Menu.Divider />
          }
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
          {userName}
        </span>
      </div>
    </Dropdown>
  );
};

export default User;
