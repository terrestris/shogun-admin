import jsLogger from 'js-logger';

let loglevel: string;
switch (process.env.NODE_ENV) {
  case 'development':
    loglevel = 'DEBUG';
    break;
  case 'test':
    loglevel = 'DEBUG';
    break;
  case 'production':
    loglevel = 'INFO';
    break;
  case 'CI':
    loglevel = 'INFO';
    break;
  default:
    loglevel = 'INFO';
    break;
}

jsLogger.useDefaults({
  defaultLevel: jsLogger.get(loglevel).getLevel()
});

export default jsLogger;
