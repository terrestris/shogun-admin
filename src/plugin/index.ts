import { CollapsePanelProps } from 'antd';

import { TFunction } from 'i18next';

import type { SHOGunAPIClient } from '@terrestris/shogun-util/dist/service/SHOGunAPIClient';

export type AdminPluginLocale = Record<string, {
    translation: Record<string, any>;
  }>;;

export interface AdminPluginComponentProps {
  client?: SHOGunAPIClient;
  t?: TFunction;
};

export interface AdminPluginIntegration {
  /**
   * The main identifier of the integration point of the plugin.
   */
  placement: string;
};

export type AdminPluginIntegrationToolMenu = AdminPluginIntegration &
  Omit<CollapsePanelProps, 'key' | 'header'> & {
    placement: 'tool-menu';
    /**
     * The label for the plugin in the tool menu.
     */
    label?: string;
    /**
     * The insertion index for the plugin in the tool menu, starting from 0 which is on top.
     */
    insertionIndex?: number;
    /**
     * The icon for the plugin in the tool menu.
     */
    icon?: React.FunctionComponent;
  };

export type AdminPluginIntegrations = AdminPluginIntegrationToolMenu;

export interface AdminPlugin {
  /**
   * The key of the plugin, usually used for internal references (e.g. element class names) only.
   */
  key: string;
  /**
   * The definition of the integration point.
   */
  integration: AdminPluginIntegrations;
  /**
   * The actual component of the plugin.
   */
  component: React.FunctionComponent<AdminPluginComponentProps>;
  /**
   * The i18n definition to be used in the plugin.
   */
  i18n?: AdminPluginLocale;
}

export type AdminPluginInternal = AdminPlugin & {
  wrappedComponent: React.FunctionComponent<AdminPluginComponentProps>;
};

export function isToolMenuIntegration(
  pluginIntegration: AdminPluginIntegrations
): pluginIntegration is AdminPluginIntegrationToolMenu {
  return pluginIntegration && pluginIntegration.placement === 'tool-menu';
}
