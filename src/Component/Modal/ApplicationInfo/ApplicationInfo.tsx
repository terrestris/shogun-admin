import React, {
  useState, ReactElement
} from 'react';

import {
  Modal,
  Statistic
} from 'antd';

import { ModalProps } from 'antd/lib/modal';

import logo from '../../../../assets/img/shogun_logo.png';

import './ApplicationInfo.less';
import { appInfoAtom } from '../../../State/atoms';
import { useRecoilState } from 'recoil';

export interface ApplicationInfoProps extends ModalProps {
  opener?: ReactElement;
}

export const ApplicationInfo: React.FC<ApplicationInfoProps> = props => {

  const [isVisible, setVisible] = useState<boolean>(false);
  const [appInfo] = useRecoilState(appInfoAtom);

  const toggleVisibility = () => {
    setVisible(!isVisible);
  };

  const {
    opener,
    ...restProps
  } = props;

  let Opener;
  if (opener) {
    Opener = React.cloneElement(
      opener,
      {
        onClick: toggleVisibility
      }
    );
  } else {
    Opener = <button onClick={toggleVisibility}>Open</button>;
  }

  return (
    <>
      {
        Opener
      }
      <Modal
        className="application-info-modal"
        title="Application Info"
        centered={true}
        visible={isVisible}
        onOk={toggleVisibility}
        onCancel={toggleVisibility}
        footer={null}
        {...restProps}
      >
        <img
          className="shogun-logo"
          src={logo}
        />
        <Statistic
          title="SHOGun Version"
          value={appInfo.version}
        />
        <Statistic
          title="Build Zeit"
          value={appInfo.buildTime}
        />
      </Modal>
    </>
  );
};

export default ApplicationInfo;
