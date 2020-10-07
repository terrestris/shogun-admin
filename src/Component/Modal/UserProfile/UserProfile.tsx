import React from 'react';
import { useRecoilState } from 'recoil';

import {
  Modal
} from 'antd';

import { ModalProps } from 'antd/lib/modal';
import { userProfileModalVisibleAtom } from '../../../State/atoms';

import UserProfileForm from './UserProfileForm/UserProfileForm';

import './UserProfile.less';

interface UserProfileProps extends ModalProps {}

export const UserProfile: React.FC<UserProfileProps> = ({
  ...passThroughProps
}) => {

  const [isVisible, setVisible] = useRecoilState(userProfileModalVisibleAtom);

  const toggleVisibility = () => {
    setVisible(!isVisible);
  };

  return (
    <Modal
      className="profile-settings"
      centered={true}
      title="Profil Einstellungen"
      visible={isVisible}
      onOk={toggleVisibility}
      onCancel={toggleVisibility}
      footer={null}
      {...passThroughProps}
    >
      <UserProfileForm />
    </Modal>
  );
};

export default UserProfile;
