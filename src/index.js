const util = require('util');

const chalk = require('chalk');
const argv = require('minimist')(process.argv.slice(2));

const Command = require('./command');

var conf = {};
conf.APP_NAME = 'depot';

const logger = require('./logger')(conf);
var commands = require('./commands');

function printUsage(message) {
  if (message) {
    console.error(chalk.red(conf.APP_NAME) + ':', message);
  }

  console.log('Usage: ' + conf.APP_NAME + ' <command>');
  console.log('Where <command> is one of: ');

  // List command names
  var command;
  for (var commandName in commands) {
    command = commands[commandName];
    console.log('  ' + chalk.yellow(commandName) + ' - ' + command.summary);
  }

  console.log();
  console.log(conf.APP_NAME + ' help <term>\tsearch for help on <term>');
}

function printCommandHelp(commandName, command) {
  console.log(chalk.yellow(commandName) + ' - ' + command.summary);
  if (command.params && command.params.length) {
    console.log('Parameters:');
    command.params.forEach(function(param) {
      var optionalString = param.optional ? '[optional] ' : '';
      console.log(util.format(
        '  * %s%s - %s', optionalString, param.name, param.description
      ));
    });
  }
  if (command.description) {
    console.log(command.description);
  }
}

// Display help message when not enough info given
var commandNameParam = argv._[0];
var isHelp = commandNameParam === 'help';
var subcommandNameParam = isHelp ? argv._[1] : null;
if ((argv._.length < 1) || (isHelp && !subcommandNameParam)) {
  printUsage();
  process.exit(1);
}

// Help command given with parameter
if (isHelp) {
  var helpCommand = commands[subcommandNameParam];
  if (!helpCommand) {
    printUsage('command not found: ' + subcommandNameParam);
    process.exit(2);
  }
  printCommandHelp(subcommandNameParam, helpCommand);
// Normal command given
} else {
  // Invalid command given
  var runCommand = commands[commandNameParam];
  if (!isHelp && !runCommand) {
    printUsage('command not found: ' + commandNameParam);
    process.exit(2);
  }

  var commandObj = runCommand.create({
    config: conf,
    logger: logger,
    argv: argv,
    params: {
      verbose: true
    }
  });
  var commandValidation = Command.validate(runCommand, argv);
  if (commandValidation.message) {
    console.log(util.format('%s: %s', conf.APP_NAME, chalk.red(commandValidation.message)));
    commandValidation.missingParameters.forEach(function(param) {
      console.log(util.format(' * %s', param));
    });
    console.log();
    printCommandHelp(commandNameParam, runCommand);
    process.exit(3);
  }
  commandObj.run();
}
