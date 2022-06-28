import Logger from '../../Logger';

import Keycloak from 'keycloak-js';

import { getBearerTokenHeader } from '@terrestris/shogun-util/dist/security/getBearerTokenHeader';
import { getCsrfTokenHeader } from '@terrestris/shogun-util/dist/security/getCsrfTokenHeader';

import config from 'shogunApplicationConfig';

export type LogLevel = 'OFF' | 'FATAL' | 'ERROR' | 'WARN' | 'INFO' | 'DEBUG' | 'TRACE';

export type LogLevels = {
  configuredLevel: LogLevel;
  effectiveLevel: LogLevel;
};

export type LogServiceOpts = {
  keycloak?: Keycloak;
};

class LogService {

  private keycloak?: Keycloak;

  constructor(opts?: LogServiceOpts) {
    this.keycloak = opts.keycloak;
  }

  async getLoggers(): Promise<any> {
    try {
      const loggerResponse = await fetch(`${config.path.shogunBase}actuator/loggers`, {
        headers: {
          ...getBearerTokenHeader(this.keycloak)
        }
      });
      const loggerJson = await loggerResponse.json();

      return loggerJson.loggers;
    } catch (error) {
      Logger.error(`Error while reading the loggers: ${error}`);

      return null;
    }
  }

  async getLogger(loggerName: string): Promise<LogLevels> {
    try {
      const loggerResponse = await fetch(`${config.path.shogunBase}actuator/loggers/${loggerName}`, {
        headers: {
          ...getBearerTokenHeader(this.keycloak)
        }
      });
      const loggerJson = await loggerResponse.json();

      return loggerJson;
    } catch (error) {
      Logger.error(`Error while reading the logger: ${error}`);

      return null;
    }
  }

  async setLogger(loggerName: string, logLevel: LogLevel): Promise<boolean> {
    try {
      const loggerResponse = await fetch(`${config.path.shogunBase}actuator/loggers/${loggerName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getCsrfTokenHeader(),
          ...getBearerTokenHeader(this.keycloak)
        },
        body: JSON.stringify({
          'configuredLevel': logLevel
        })
      });

      return loggerResponse.status === 204;
    } catch (error) {
      Logger.error(`Error while setting the logger: ${error}`);

      return false;
    }
  };

  async getLogs(): Promise<string> {
    try {
      const logResponse = await fetch(`${config.path.shogunBase}actuator/logfile`, {
        headers: {
          ...getBearerTokenHeader(this.keycloak)
        }
      });
      const logText = await logResponse.text();

      return logText;
    } catch (error) {
      Logger.error(`Error while reading the logs: ${error}`);

      return null;
    }
  };

}

export default LogService;
