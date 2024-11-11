import {
  useContext
} from 'react';

import Group from '@terrestris/shogun-util/dist/model/Group';

import CreateAllGroupsButton, {
  CreateAllGroupsButtonProps
} from '../../../CreateAllGroupsButton/CreateAllGroupsButton';

import GeneralEntityRootContext, {
  ContextValue
} from '../../../../Context/GeneralEntityRootContext';

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
