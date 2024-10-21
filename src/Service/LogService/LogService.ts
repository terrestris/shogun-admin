import Keycloak from 'keycloak-js';

import config from 'shogunApplicationConfig';

import { getBearerTokenHeader } from '@terrestris/shogun-util/dist/security/getBearerTokenHeader';
import { getCsrfTokenHeader } from '@terrestris/shogun-util/dist/security/getCsrfTokenHeader';

import Logger from '../../Logger';

export type LogLevel = 'OFF' | 'FATAL' | 'ERROR' | 'WARN' | 'INFO' | 'DEBUG' | 'TRACE';

export interface LogLevels {
  configuredLevel: LogLevel;
  effectiveLevel: LogLevel;
}

export interface LogServiceOpts {
  keycloak?: Keycloak;
}

class LogService {

  private readonly keycloak?: Keycloak;

  constructor(opts?: LogServiceOpts) {
    this.keycloak = opts?.keycloak;
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
      return await loggerResponse.json();
    } catch (error) {
      Logger.error(`Error while reading the logger: ${error}`);
      return Promise.reject();
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
          configuredLevel: logLevel
        })
      });

      return loggerResponse.status === 204;
    } catch (error) {
      Logger.error(`Error while setting the logger: ${error}`);

      return false;
    }
  };

  async getLogs() {
    try {
      const logResponse = await fetch(`${config.path.shogunBase}actuator/logfile`, {
        headers: {
          ...getBearerTokenHeader(this.keycloak)
        }
      });

      if (!logResponse.ok) {
        throw new Error('No successful response while getting the logs');
      }

      return await logResponse.text();
    } catch (error) {
      Logger.error(`Error while reading the logs: ${error}`);
      return Promise.reject();
    }
  };

}

export default LogService;
