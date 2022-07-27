import React from 'react';

import { Link } from 'react-router-dom';

import { PageHeader } from 'antd';

import User from '../Menu/User/User';

import defaultLogo from '../../../assets/img/shogun_logo.png';

import config from 'shogunApplicationConfig';

import './Header.less';
import LanguageSelect from '../LanguageSelector';

interface OwnProps {
  onContactClick?: (event: React.MouseEvent<HTMLElement>) => void;
}

type HeaderProps = OwnProps;

export const Header: React.FC<HeaderProps> = () => {

  const logo = config.path?.logo|| defaultLogo;

  return (
    <header>
      <PageHeader
        className="page-header"
        title={
          <Link
            to={`${config.appPrefix}/portal`}
            className="header-logo-a"
          >
            <img
              className="header-logo-img"
              src={logo}
            />
            SHOGun Admin
          </Link>
        }
        extra={[
          <LanguageSelect />,
          <User key="user" />
        ]}
      >
      </PageHeader>
    </header>
  );
};

export default Header;
