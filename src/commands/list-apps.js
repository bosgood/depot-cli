const Command = require('../command');

var ListApps = Command.extend({
  run: function() {
    this.logger.info('ran list-apps');
  }
});

module.exports = {
  summary: 'Lists all available apps.',
  create: ListApps.create
};
