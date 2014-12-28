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
          apps.forEach(function(app) {
            self.log('info', '*', app.applicationId);
          });
        } else {
          self.log('info', 'No apps available yet.');
        }
      })
      .catch(function(err) {
        self.log('error', 'Error while fetching apps:');
        self.log('error', err);
        if (err.stack) {
          console.error(err.stack);
        }
      })
    ;
  }
});

module.exports = {
  summary: 'Lists all available apps.',
  create: ListApps.create,
};
