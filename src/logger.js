const winston = require('winston');

module.exports = function(conf) {
  //
  // Configure CLI output on the default logger
  //
  winston.cli();

  //
  // Configure CLI on an instance of winston.Logger
  //
  var logger = new winston.Logger({
    transports: [
      new (winston.transports.Console)({
        label: conf.APP_NAME,
        timestamp: true
      })
    ]
  });

  logger.cli();
  return logger;
};
