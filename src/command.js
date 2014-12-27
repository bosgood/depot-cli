const Promise = require('bluebird');
const superagent = require('superagent');
require('superagent-bluebird-promise');

function Command() {}

Command.prototype.initialize = function(di) {
  // Inject all properties from constructor param into instance
  for (var key in di) {
    if (di.hasOwnProperty(key)) {
      this[key] = di[key];
    }
  }

  // Provide libraries as members
  this.http = superagent;
  this.Promise = Promise;
};

Command.prototype.run = function() {
  throw new Error('command has not been implemented yet.');
};

Command.extend = function(props) {
  // Extend as a class from Command
  var CommandClass = function(di) {
    this.initialize(di);
  };
  CommandClass.prototype = Object.create(Command.prototype);

  // Assign all given props to the new class's prototype
  for (var key in props) {
    if (props.hasOwnProperty(key)) {
      CommandClass.prototype[key] = props[key];
    }
  }

  // Provide a convenient constructor for command package objects
  CommandClass.create = function(args) {
    return new CommandClass(args);
  };

  return CommandClass;
};

module.exports = Command;
