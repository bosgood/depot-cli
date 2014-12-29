const util = require('util');

const Command = require('../command');

var ListVersions = Command.extend({
  run: function() {
    var self = this;
    return self.http
      .get(
        util.format('http://depot.dev/depot/apps/%s/versions', this.argv.appId)
      )
      .type('json')
      .promise()
      .then(function(res) {
        var versions = res.body;
        if (versions && versions.length) {
          versions.forEach(function(version) {
            self.log(
              'info',
              util.format('* %s - %s', version.versionId, version.createdAt)
            );
          });
        } else {
          self.log(
            'info',
            util.format(
              'No versions of `%s` currently available.', self.argv.appId
            )
          );
        }
        return versions;
      })
      .catch(function(err) {
        self.log('error',
          util.format('Error while fetching versions for `%s`:', self.argv.appId)
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
