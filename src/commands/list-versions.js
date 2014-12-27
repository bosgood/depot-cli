const Command = require('../command');

var ListVersions = Command.extend({
  run: function() {
    var self = this;
    return self.http
      .get('http://depot.dev/depot/apps/' + this.params.appId + '/versions')
      .type('json')
      .promise()
      .then(function(res) {
        var versions = res.body;
        if (versions && versions.length) {
          versions.forEach(function(version) {
            self.logger.info('*', version.versionId, '-', version.createdAt);
          });
        } else {
          self.logger.info(
            'No versions of `' + self.params.appId + '` currently available.'
          );
        }
      })
      .catch(function(err) {
        self.logger.error(
          'Error while fetching versions for `' + self.params.appId + '`:'
        );
        self.logger.error(err);
        if (err.stack) {
          console.error(err.stack);
        }
      })
    ;
  }
});

module.exports = {
  summary: 'Lists all available apps.',
  create: ListVersions.create,
  params: [
    { name: 'appId', description: 'application id' }
  ]
};
