const Promise = require('bluebird');
const superagent = require('superagent');
require('superagent-bluebird-promise');

function Command() {}

Command.prototype.initialize = function(dependencies) {
  // Inject all properties from constructor param into instance
  var mainDependencies = {};
  for (var key in dependencies) {
    if (dependencies.hasOwnProperty(key)) {
      this[key] = dependencies[key];
      // Omitting per-command parameters
      if (key !== 'params') {
        mainDependencies[key] = dependencies[key];
      }
    }
  }

  // Provide libraries as members
  this.http = superagent;
  this.Promise = Promise;

  // Archive to allow command to pass on injected dependencies
  // to another command
  this.dependencies = mainDependencies;
};

Command.prototype.log = function(level, message) {
  if (this.params && this.params.verbose) {
    this.logger.log.apply(this.logger, arguments);
  }
};

Command.prototype.createSubcommand = function(CommandClass, params) {
  if (!params) {
    params = {};
  }
  for (var key in this.dependencies) {
    if (this.dependencies.hasOwnProperty(key)) {
      params[key] = this.dependencies[key];
    }
  }
  return CommandClass.create(params);
};

Command.prototype.run = function() {
  throw new Error('command has not been implemented yet.');
};

Command.validate = function(commandPackage, argv) {
  var validationResponse = {
    missingParameters: []
  };
  if (commandPackage.params) {
    commandPackage.params.forEach(function(param) {
      if (!param.optional && !argv[param.name]) {
        validationResponse.message = 'missing required param(s)';
        validationResponse.missingParameters.push(param.name);
      }
    });
  }
  return validationResponse;
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
