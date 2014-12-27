const chalk = require('chalk');
const argv = require('minimist')(process.argv.slice(2));

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
  console.log(conf.APP_NAME + ' help <term>\tsearch for help on <term>')
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
  console.log(chalk.yellow(subcommandNameParam) + ' - ' + helpCommand.summary);
  if (helpCommand.params && helpCommand.params.length) {
    console.log('Parameters:');
    helpCommand.params.forEach(function(param) {
      console.log('  * ' + param.name + ' - ' + param.description);
    });
  }
  if (helpCommand.description) {
    console.log(helpCommand.description);
  }
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
    params: argv
  });
  commandObj.run();
}
