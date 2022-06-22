import _lowerCase from 'lodash/lowerCase';

import Keycloak from 'keycloak-js';

import BaseEntity from '@terrestris/shogun-util/dist/model/BaseEntity';
import Application from '@terrestris/shogun-util/dist/model/File';
import GenericService from '@terrestris/shogun-util/dist/service/GenericService';
import ApplicationService from '@terrestris/shogun-util/dist/service/ApplicationService';

import { GenericServiceImpl } from '../Service/GenericServiceImpl/GenericServiceImpl';
import { FormValues, GenericEntityController } from './GenericEntityController';
import { FormConfig } from '../Component/GeneralEntity/GeneralEntityForm/GeneralEntityForm';

export type ControllerCfg = {
  endpoint: string;
  keycloak?: Keycloak;
  entityType: string;
  formConfig: FormConfig;
  updateForm?: (values: FormValues) => void;
};

export class ControllerUtil {

  static createController({
    endpoint,
    keycloak,
    entityType,
    formConfig,
    updateForm
  }: ControllerCfg): GenericEntityController<BaseEntity> {

    switch (_lowerCase(entityType)) {
      case 'application':
        return ControllerUtil
          .createApplicationController({
            endpoint,
            keycloak,
            entityType: 'application',
            formConfig,
            updateForm
          });
      default:
        return ControllerUtil
          .createGenericController({
            endpoint,
            keycloak,
            entityType,
            formConfig,
            updateForm
          });
    }
  }

  /**
   * Create an application controller
   * @param controllerCfg The controller config
   * @returns an application controller instance
   */
  static createApplicationController(controllerCfg: ControllerCfg): GenericEntityController<Application> {
    const appService = new ApplicationService({
      basePath: controllerCfg?.endpoint,
      keycloak: controllerCfg.keycloak
    });
    const appController = new GenericEntityController<Application>({
      service: appService,
      formUpdater: controllerCfg?.updateForm,
      formConfig: controllerCfg?.formConfig
    });
    return appController;
  }

  /**
   * As a default: generate generic controller
   * @param controllerCfg The controller config
   * @returns a generic Controller
   */
  static createGenericController(controllerCfg: ControllerCfg): GenericEntityController<BaseEntity> {
    const genericService: GenericServiceImpl = new GenericServiceImpl({
      basePath: controllerCfg?.endpoint,
      keycloak: controllerCfg.keycloak
    });
    const genericController: GenericEntityController<BaseEntity> = new GenericEntityController<BaseEntity>({
      service: genericService as GenericService<BaseEntity>,
      formUpdater: controllerCfg?.updateForm,
      formConfig: controllerCfg?.formConfig
    });
    return genericController;
  }

}
