import jsLogger from 'js-logger';

let loglevel;
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
  default:
    loglevel = 'INFO';
    break;
};

jsLogger.useDefaults({
  defaultLevel: jsLogger[loglevel]
});

export default jsLogger;
