const util = require('util');

const Command = require('../command');

var DeployVersion = Command.extend({
  run: function() {
    var self = this;
    return this.http
      .post(
        util.format(
          'http://depot.dev/depot/deploy/%s/%s',
          self.argv.appId,
          self.argv.versionId
        )
      )
      .send({})
      .type('json')
      .promise()
      .then(function(res) {
        var appData = res.body;
        if (appData && appData.contents) {
          appData.contentsLength = appData.contents.length;
          delete appData.contents;
        }
        self.log('info', 'Version successfully deployed.');
        self.log('info', appData);
        return appData;
      })
      .catch(function(err) {
        self.log('error', 'Failed to deploy version.');
        self.log('error', err);
        if (err.stack) {
          console.error(err.stack);
        }
      })
    ;
  }
});

module.exports = {
  summary: 'Marks the given version as released.',
  create: DeployVersion.create,
  params: [
    { name: 'appId', description: 'application id'},
    { name: 'versionId', description: 'version id'}
  ]
};
