import Logger from '../../Logger';

import config from 'shogunApplicationConfig';
import SecurityUtil from '../../Util/SecurityUtil';

export type LogLevel = 'OFF' | 'FATAL' | 'ERROR' | 'WARN' | 'INFO' | 'DEBUG' | 'TRACE';

export type LogLevels = {
  configuredLevel: LogLevel;
  effectiveLevel: LogLevel;
};

class LogService {

  constructor() {}

  async getLoggers(): Promise<any> {
    try {
      const loggerResponse = await fetch(`${config.path.loggers}`);
      const loggerJson = await loggerResponse.json();

      return loggerJson.loggers;
    } catch (error) {
      Logger.error(`Error while reading the loggers: ${error}`);

      return null;
    }
  }

  async getLogger(loggerName: string): Promise<LogLevels> {
    try {
      const loggerResponse = await fetch(`${config.path.loggers}/${loggerName}`);
      const loggerJson = await loggerResponse.json();

      return loggerJson;
    } catch (error) {
      Logger.error(`Error while reading the logger: ${error}`);

      return null;
    }
  }

  async setLogger(loggerName: string, logLevel: LogLevel): Promise<boolean> {
    try {
      const loggerResponse = await fetch(`${config.path.loggers}/${loggerName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...SecurityUtil.getSecurityHeaders(config)
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
      const logResponse = await fetch(`${config.path.logfile}`);
      const logText = await logResponse.text();

      return logText;
    } catch (error) {
      Logger.error(`Error while reading the logs: ${error}`);

      return null;
    }
  };

}

export default LogService;
