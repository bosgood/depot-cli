#!/usr/bin/env node

const Liftoff = require('liftoff');
const argv = require('minimist')(process.argv.slice(2));
const fs = require('fs');
const chalk = require('chalk');
const winston = require('winston');

var configVariants = require('interpret').jsVariants;
configVariants[''] = null;
configVariants['.json'] = null;

// Respawn node with any flag listed here
// to support all flags: require('v8flags').fetch();
var nodeFlags = [
  '--harmony'
];

const Depot = new Liftoff({
  name: 'depot',
  extensions: configVariants,
  // ^ automatically attempt to require module for any javascript variant
  // supported by interpret.  e.g. coffee-script / livescript, etc
  nodeFlags: nodeFlags
}).on('require', function (name, module) {
  console.log('Loading:',name);
}).on('requireFail', function (name, err) {
  console.log('Unable to load:', name, err);
}).on('respawn', function (flags, child) {
  console.log('Detected node flags:', flags);
  console.log('Respawned to PID:', child.pid);
});

Depot.launch({
  cwd: argv.cwd,
  configPath: argv.depotfile,
  require: argv.require,
  completion: argv.completion,
  verbose: argv.verbose
}, invoke);

function invoke(env) {
  if (argv.verbose) {
    // console.log('LIFTOFF SETTINGS:', this);
    console.log('CLI OPTIONS:', argv);
    console.log('CWD:', env.cwd);
    console.log('LOCAL MODULES PRELOADED:', env.require);
    console.log('SEARCHING FOR:', env.configNameRegex);
    console.log('FOUND CONFIG AT:',  env.configPath);
    console.log('CONFIG BASE DIR:', env.configBase);
    console.log('YOUR LOCAL MODULE IS LOCATED:', env.modulePath);
    console.log('LOCAL PACKAGE.JSON:', env.modulePackage);
    // console.log('CLI PACKAGE.JSON', require('../package'));
  }

  const baseDir = env.modulePath || env.cwd;

  if (env.configPath) {
    process.chdir(env.configBase);
  } else {
    // Make sure there is a depotfile available somewhere
    // winston.error('depotfile not found in current or parent directory');
    // process.exit(1);
  }

  // Run depot itself
  require(baseDir);
}
