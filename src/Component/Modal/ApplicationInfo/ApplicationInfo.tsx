import './ApplicationInfo.less';

import React from 'react';

import {
  Modal,
  Statistic
} from 'antd';
import { ModalProps } from 'antd/lib/modal';
import { useTranslation } from 'react-i18next';

import defaultLogo from '../../../../assets/img/shogun_logo.png';
import useAppDispatch from '../../../Hooks/useAppDispatch';
import useAppSelector from '../../../Hooks/useAppSelector';
import {
  useClientVersion
} from '../../../Hooks/useClientVersion';
import { setVisible } from '../../../store/infoModal';

export interface ApplicationInfoProps extends ModalProps { }

export const ApplicationInfo: React.FC<ApplicationInfoProps> = ({
  ...passThroughProps
}) => {

  const {
    t
  } = useTranslation();

  const isVisible = useAppSelector(state => state.infoModal);
  const appInfo = useAppSelector(state => state.appInfo);

  const dispatch = useAppDispatch();

  const toggleVisibility = () => {
    dispatch(setVisible(!isVisible));
  };

  return (
    <Modal
      className="application-info-modal"
      title={t('ApplicationInfoModal.clientAbout')}
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
        value={`${appInfo.version} (${appInfo.buildTime})`}
      />
    </Modal>
  );
};

export default ApplicationInfo;
