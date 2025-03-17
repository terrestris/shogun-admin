import './User.less';

import React from 'react';

import {
  InfoCircleOutlined,
  LogoutOutlined,
  SettingOutlined
} from '@ant-design/icons';
import {
  Dropdown,
  Avatar
} from 'antd';
import { ItemType } from 'antd/lib/menu/interface';
import _isNil from 'lodash/isNil';
import { useTranslation } from 'react-i18next';
import config from 'shogunApplicationConfig';

import useAppDispatch from '../../../Hooks/useAppDispatch';
import useAppSelector from '../../../Hooks/useAppSelector';
import useSHOGunAPIClient from '../../../Hooks/useSHOGunAPIClient';
import { setVisible } from '../../../store/infoModal';
import UserUtil from '../../../Util/UserUtil';

interface OwnProps { }

type UserProps = OwnProps;

export const User: React.FC<UserProps> = () => {

  const userInfo = useAppSelector(state => state.userInfo);

  const dispatch = useAppDispatch();

  const {
    t
  } = useTranslation();

  const client = useSHOGunAPIClient();

  if (_isNil(client)) {
    return null;
  }

  const avatarSource = UserUtil.getGravatarUrl({
    // @ts-expect-error email is not part of the ProviderUserDetails
    email: userInfo.providerDetails?.email || '',
    size: 38
  });

  const onMenuClick = (evt: any) => {

    switch (evt.key) {
      case 'info':
        dispatch(setVisible(true));
        break;
      case 'settings':
        // TODO: Fix settings for non keycloak setups
        client?.getKeycloak()?.accountManagement();
        break;
      case 'logout': {
        const keycloak = client.getKeycloak();
        if (keycloak) {
          keycloak.logout();
        } else {
          fetch('/auth/logout', {
            method: 'POST',
            credentials: 'same-origin'
          }).then(response => {
            if (response.status === 200 && !_isNil(config?.security?.tokenName)) {
              localStorage.removeItem(config?.security?.tokenName);
              window.location.href = '/';
            }
          });
        }
        break;
      }
      default:
        break;
    }
  };

  // @ts-expect-error username is not part of the ProviderUserDetails
  const userName = userInfo?.providerDetails?.username || userInfo?.authProviderId;

  const userMenuItems: ItemType[] = [];

  if (userName) {
    userMenuItems.push({
      label: (
        <div
          className='user-name'
        >
          <span>
            {userName}
          </span>
        </div>
      ),
      key: 'username'
    }, {
      type: 'divider'
    });
  }

  if (client.getKeycloak()) {
    userMenuItems.push({
      label: t('User.settings'),
      icon: <SettingOutlined />,
      key: 'settings'
    });
  }

  userMenuItems.push({
    label: t('User.info'),
    icon: <InfoCircleOutlined />,
    key: 'info'
  }, {
    type: 'divider'
  });

  userMenuItems.push({
    label: t('User.logout'),
    icon: <LogoutOutlined />,
    key: 'logout'
  });

  return (
    <Dropdown
      className='user-menu'
      menu={{
        style: { width: 256 },
        className: 'user-chip-menu',
        items: userMenuItems,
        onClick: onMenuClick
      }}
      trigger={['click']}
    >
      <div>
        <Avatar
          src={avatarSource}
          size='large'
          className='userimage'
        >
          {
            avatarSource ? '' : UserUtil.getInitials(userInfo)
          }
        </Avatar>
        <span
          className='username'
        >
          {userName}
        </span>
      </div>
    </Dropdown>
  );
};

export default User;
