const Command = require('../command');

var ListApps = Command.extend({
  run: function() {
    var self = this;
    return self.http
      .get('http://depot.dev/depot/apps')
      .type('json')
      .promise()
      .then(function(res) {
        var apps = res.body;
        if (apps && apps.length) {
          self.logger.info('apps available:');
          apps.forEach(function(app) {
            self.logger.info('  - ', app.applicationId + ' | ' + app.createdAt);
          });
        } else {
          self.logger.info('no apps available');
        }
      })
      .catch(function(err) {
        self.logger.error('error while fetching apps:');
        self.logger.error(err);
      })
    ;
  }
});

module.exports = {
  summary: 'Lists all available apps.',
  create: ListApps.create,
};
