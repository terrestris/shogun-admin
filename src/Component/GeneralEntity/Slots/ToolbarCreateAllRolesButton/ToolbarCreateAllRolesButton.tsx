import {
  useContext
} from 'react';

import Role from '@terrestris/shogun-util/dist/model/Role';

import CreateAllRolesButton, {
  CreateAllRolesButtonProps
} from '../../../CreateAllRolesButton/CreateAllRolesButton';

import GeneralEntityRootContext, {
  ContextValue
} from '../../../../Context/GeneralEntityRootContext';

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
