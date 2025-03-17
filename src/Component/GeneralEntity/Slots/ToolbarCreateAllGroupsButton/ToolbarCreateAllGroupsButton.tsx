import React, {
  useContext
} from 'react';

import Group from '@terrestris/shogun-util/dist/model/Group';

import GeneralEntityRootContext, {
  ContextValue
} from '../../../../Context/GeneralEntityRootContext';
import CreateAllGroupsButton, {
  CreateAllGroupsButtonProps
} from '../../../CreateAllGroupsButton/CreateAllGroupsButton';


export const ToolbarCreateAllGroupsButton: React.FC<CreateAllGroupsButtonProps> = () => {
  const generalEntityRootContext = useContext<ContextValue<Group> | undefined>(GeneralEntityRootContext);

  const onSuccess = () => {
    generalEntityRootContext?.fetchEntities?.();
  };

  return (
    <CreateAllGroupsButton
      onSuccess={onSuccess}
    />
  );
};

export default ToolbarCreateAllGroupsButton;
