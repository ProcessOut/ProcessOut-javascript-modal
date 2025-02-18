/* eslint-disable */ 

const fs = require('fs');
const { version } = require('../package.json');

const args = process.argv;

if (args.includes('--version')) {
  fs.appendFileSync('dist/processout.js', `ProcessOut.SCRIPT_VERSION = "${version}";`);
  fs.appendFileSync('dist/modal.js', `ProcessOut.SCRIPT_VERSION = "${version}";`);
}

if (args.includes('--debug')) {
  fs.appendFileSync('dist/processout.js', `ProcessOut.DEBUG = true;`);
  fs.appendFileSync('dist/modal.js', `ProcessOut.DEBUG = true;`);
}

if (args.includes('--debug-host')) {
  fs.appendFileSync('dist/processout.js', `ProcessOut.DEBUG_HOST = "processout.ninja";`);
  fs.appendFileSync('dist/modal.js', `ProcessOut.DEBUG_HOST = "processout.ninja";`);
}
