function Command() {}

Command.prototype.initialize = function(di) {
  // Inject all properties from constructor param into instance
  for (var key in di) {
    if (di.hasOwnProperty(key)) {
      this[key] = di[key];
    }
  }
}

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
