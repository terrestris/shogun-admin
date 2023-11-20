import './ApplicationInfo.less';

import React from 'react';

import {
  Modal,
  Statistic
} from 'antd';
import { ModalProps } from 'antd/lib/modal';
import { useTranslation } from 'react-i18next';
import { useRecoilState } from 'recoil';

import defaultLogo from '../../../../assets/img/shogun_logo.png';
import {
  useClientVersion
} from '../../../Hooks/useClientVersion';
import { appInfoAtom, shogunInfoModalVisibleAtom } from '../../../State/atoms';

export interface ApplicationInfoProps extends ModalProps { }

export const ApplicationInfo: React.FC<ApplicationInfoProps> = ({
  ...passThroughProps
}) => {

  const {
    t
  } = useTranslation();

  const [isVisible, setVisible] = useRecoilState(shogunInfoModalVisibleAtom);
  const [appInfo] = useRecoilState(appInfoAtom);

  const toggleVisibility = () => {
    setVisible(!isVisible);
  };

  return (
    <Modal
      className="application-info-modal"
      title={t('ApplicationInfoModal.title')}
      centered={true}
      open={isVisible}
      onOk={toggleVisibility}
      onCancel={toggleVisibility}
      footer={null}
      {...passThroughProps}
    >
      <img
        className="shogun-logo"
        src={defaultLogo}
      />
      <Statistic
        title={t('ApplicationInfoModal.clientVersion')}
        value={useClientVersion()}
      />
      <Statistic
        title={t('ApplicationInfoModal.backendVersion')}
        value={appInfo.version}
      />
      <Statistic
        title={t('ApplicationInfoModal.buildTime')}
        value={appInfo.buildTime}
      />
    </Modal>
  );
};

export default ApplicationInfo;
