import React, {
  useContext
} from 'react';

import User from '@terrestris/shogun-util/dist/model/User';

import GeneralEntityRootContext, {
  ContextValue
} from '../../../../Context/GeneralEntityRootContext';
import CreateAllUsersButton, {
  CreateAllUsersButtonProps
} from '../../../CreateAllUsersButton/CreateAllUsersButton';


export const ToolbarCreateAllUsersButton: React.FC<CreateAllUsersButtonProps> = () => {
  const generalEntityRootContext = useContext<ContextValue<User> | undefined>(GeneralEntityRootContext);

  const onSuccess = () => {
    generalEntityRootContext?.fetchEntities?.();
  };

  return (
    <CreateAllUsersButton
      onSuccess={onSuccess}
    />
  );
};

export default ToolbarCreateAllUsersButton;
