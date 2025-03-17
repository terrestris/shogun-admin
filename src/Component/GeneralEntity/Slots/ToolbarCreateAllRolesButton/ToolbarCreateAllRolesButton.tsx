import React, {
  useContext
} from 'react';

import Role from '@terrestris/shogun-util/dist/model/Role';

import GeneralEntityRootContext, {
  ContextValue
} from '../../../../Context/GeneralEntityRootContext';
import CreateAllRolesButton, {
  CreateAllRolesButtonProps
} from '../../../CreateAllRolesButton/CreateAllRolesButton';


export const ToolbarCreateAllRolesButton: React.FC<CreateAllRolesButtonProps> = () => {
  const generalEntityRootContext = useContext<ContextValue<Role> | undefined>(GeneralEntityRootContext);

  const onSuccess = () => {
    generalEntityRootContext?.fetchEntities?.();
  };

  return (
    <CreateAllRolesButton
      onSuccess={onSuccess}
    />
  );
};

export default ToolbarCreateAllRolesButton;
