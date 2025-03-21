import React, {
  useContext
} from 'react';

import config from 'shogunApplicationConfig';

import GeneralEntityRootContext from '../../../../Context/GeneralEntityRootContext';
import UploadLayerButton, {
  UploadLayerButtonProps
} from '../../../UploadLayerButton/UploadLayerButton';

export const ToolbarUploadLayerButton: React.FC<UploadLayerButtonProps> = () => {
  const generalEntityRootContext = useContext(GeneralEntityRootContext);

  const onSuccess = () => {
    generalEntityRootContext?.fetchEntities?.();
  };

  if (!config.geoserver?.upload?.buttonVisible) {
    return <></>;
  }

  return (
    <UploadLayerButton
      onSuccess={onSuccess}
    />
  );
};

export default ToolbarUploadLayerButton;
