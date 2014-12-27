const Command = require('../command');

var Info = Command.extend({
  run: function() {
    var self = this;
    return self.http
      .get('http://depot.dev/depot/apps/' + this.params.appId)
      .type('json')
      .promise()
      .then(function(res) {
        var app = res.body;
        for (var prop in app) {
          if (app.hasOwnProperty(prop)) {
            self.logger.info(prop + ':', app[prop]);
          }
        }
      })
      .catch(function(err) {
        self.logger.error('Error while fetching app:');
        if (err.res && err.res.status) {
          self.logger.error('response code: ', err.res.status)
        }
        if (err.res && err.res.body) {
          self.logger.error('response body: ', err.res.body);
        }
        if (err.stack) {
          console.error(err.stack);
        }
      })
    ;
  }
});

module.exports = {
  summary: 'Show app information.',
  create: Info.create,
  params: [
    { name: 'appId', description: 'application id' }
  ]
};
