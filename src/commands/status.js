const util = require('util');

const Command = require('../command');
const ListApps = require('./list-apps');

var Status = Command.extend({
  run: function() {
    var self = this;
    var listApps = ListApps.create();
    listApps.run()
    .then(function(apps) {
      self.log('info', 'depot server online:');
      self.log('info', util.format('%d apps available.', apps.length));
    })
    .catch(function(err) {
      self.log('error', 'Error while contacting server.');
    });
  }
});

module.exports = {
  summary: 'Gets depot server status.',
  create: Status.create
};
