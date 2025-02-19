import React, {
  useState
} from 'react';

import {
  CopyOutlined
} from '@ant-design/icons';

import {
  Button,
  Tooltip
} from 'antd';

import {
  useTranslation
} from 'react-i18next';

import Logger from '@terrestris/base-util/dist/Logger';

import './CopyToClipboardButton.less';

interface CopyToClipboardButtonProps {
  value?: string;
  feedbackDuration?: number;
}

export const CopyToClipboardButton: React.FC<CopyToClipboardButtonProps> = ({
  value,
  feedbackDuration = 3000
}) => {
  const [copyCompleted, setCopyCompleted] = useState(false);

  const {
    t
  } = useTranslation();

  const copyToClipboard = async () => {
    if (!value) {
      return;
    }

    try {
      await navigator.clipboard.writeText(value);

      setCopyCompleted(true);
      setTimeout(() => {
        setCopyCompleted(false);
      }, feedbackDuration);
    } catch (error) {
      Logger.error('Could not copy text to clipboard: ', error);
    }
  };

  const onCopyToClipboardClick = async () => {
    await copyToClipboard();
  };

  return (
    <Tooltip
      title={t('CopyToClipboardButton.tooltip')}
    >
      <Button
        className="copy-to-clipboard-btn"
        onClick={onCopyToClipboardClick}
        icon={<CopyOutlined />}
      >
        <div
          className={copyCompleted ?
            'feedback-icon' :
            'feedback-icon hidden'
          }
        >
          <div
            className={copyCompleted ?
              'checkmark' :
              'checkmark-hidden'
            }
          />
        </div>
      </Button>
    </Tooltip>
  );
};

export default CopyToClipboardButton;
