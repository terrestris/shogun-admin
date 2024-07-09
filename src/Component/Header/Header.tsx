import './Header.less';

import React from 'react';

import { PageHeader } from '@ant-design/pro-components';
import { Link } from 'react-router-dom';
import config from 'shogunApplicationConfig';

import defaultLogo from '../../../resources/public/img/shogun_logo.png';

import LanguageSelect from '../LanguageSelector';
import User from '../Menu/User/User';

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
            className="header-link"
          >
            <img
              className="header-logo"
              src={logo}
            />
            SHOGun Admin
          </Link>
        }
        extra={[
          <LanguageSelect key="languageselect" />,
          <User key="user" />
        ]}
      >
      </PageHeader>
    </header>
  );
};

export default Header;
