import React from 'react';
import { Link } from 'react-router-dom';

import logo from '../../../assets/img/shogun_logo.png';
import User from '../Menu/User/User';

import './Header.less';

interface OwnProps {
  onContactClick?: (event: React.MouseEvent<HTMLElement>) => void;
}

type HeaderProps = OwnProps;

export const Header: React.FC<HeaderProps> = props => {

  return (
    <header>
      <div className="container left">
        <Link
          to={'/portal'}
          className="header-logo-a"
        >
          <img
            className="header-logo-img"
            src={logo}
          />
        </Link>
      </div>
      <div
        className="container center"
      >
      </div>
      <div className="container right">
        <User />
      </div>
    </header>
  );
};

export default Header;
