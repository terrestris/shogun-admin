import jsLogger, { ILogLevel } from 'js-logger';

let loglevel: ILogLevel;
switch (process.env.NODE_ENV) {
  case 'development':
    loglevel = jsLogger.DEBUG;
    break;
  case 'test':
    loglevel = jsLogger.DEBUG;
    break;
  case 'production':
  case undefined:
    loglevel = jsLogger.INFO;
    break;
  case 'CI':
    loglevel = jsLogger.INFO;
    break;
  default:
    loglevel = jsLogger.INFO;
    break;
}
jsLogger.useDefaults({
  defaultLevel: loglevel
});

export default jsLogger;
