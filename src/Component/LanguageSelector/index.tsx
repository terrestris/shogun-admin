import './index.less';

import React from 'react';

import {
  Select
} from 'antd';

import i18n from '../../i18n';

const {
  Option
} = Select;

export const LanguageSelect: React.FC = () => {
  const supportedLanguages = Object.keys(i18n.services.resourceStore.data);

  const onLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className="language-select">
      <Select
        defaultValue={i18n.language || 'en'}
        onChange={onLanguageChange}
      >
        {
          supportedLanguages.map(supportedLanguage => {
            return (
              <Option
                key={supportedLanguage}
                value={supportedLanguage}
              >
                {supportedLanguage.toUpperCase()}
              </Option>
            );
          })
        }
      </Select>
    </div>
  );
};

export default LanguageSelect;
