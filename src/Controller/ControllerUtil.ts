import _lowerCase from 'lodash/lowerCase';
import { FormConfig } from '../Component/GeneralEntity/GeneralEntityForm/GeneralEntityForm';
import BaseEntity from '../Model/BaseEntity';
import Application from '../Model/File';
import ApplicationService from '../Service/ApplicationService/ApplicationService';
import GenericService from '../Service/GenericService/GenericService';
import { GenericServiceImpl } from '../Service/GenericService/GenericServiceImpl';
import { FormValues, GenericEntityController } from './GenericEntityController';

export type ControllerCfg = {
  endpoint: string;
  entityType: string;
  formConfig: FormConfig;
  updateForm?: (values: FormValues) => void;
};

export class ControllerUtil {

  static createController({
    endpoint,
    entityType,
    formConfig,
    updateForm
  }: ControllerCfg): GenericEntityController<BaseEntity> {

    switch (_lowerCase(entityType)) {
      case 'application':
        return ControllerUtil
          .createApplicationController({endpoint, entityType: 'application', formConfig, updateForm});
      default:
        return ControllerUtil
          .createGenericController({endpoint, entityType, formConfig, updateForm});
    }
  }

  /**
   * Create an application controller
   * @param controllerCfg The controller config
   * @returns an application controller instance
   */
  static createApplicationController(controllerCfg: ControllerCfg): GenericEntityController<Application> {
    const appService = new ApplicationService(controllerCfg?.endpoint);
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
    const genericService: GenericServiceImpl = new GenericServiceImpl(controllerCfg?.endpoint);
    const genericController: GenericEntityController<BaseEntity> = new GenericEntityController<BaseEntity>({
      service: genericService as GenericService<BaseEntity>,
      formUpdater: controllerCfg?.updateForm,
      formConfig: controllerCfg?.formConfig
    });
    return genericController;
  }

}
