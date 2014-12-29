const Command = require('../command');

var ListVersions = Command.extend({
  run: function() {
    var self = this;
    return self.http
      .get('http://depot.dev/depot/apps/' + this.argv.appId + '/versions')
      .type('json')
      .promise()
      .then(function(res) {
        var versions = res.body;
        if (versions && versions.length) {
          versions.forEach(function(version) {
            self.log('info', '*', version.versionId, '-', version.createdAt);
          });
        } else {
          self.log('info',
            'No versions of `' + self.argv.appId + '` currently available.'
          );
        }
        return versions;
      })
      .catch(function(err) {
        self.log('error',
          'Error while fetching versions for `' + self.argv.appId + '`:'
        );
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
  create: ListVersions.create,
  params: [
    { name: 'appId', description: 'application id' }
  ]
};
