const path = require('path')
const fs = require('fs')

// Base directory (project root)
const baseDir = path.resolve(path.dirname(require.main.filename), '..')

// Default env configuration
const env = {
  ...process.env,
  NODE_ENV: process.env.NODE_ENV,
  KF_SERVER_PATH_DATA: baseDir,
  KF_SERVER_PATH_ASSETS: path.join(baseDir, 'assets'),
  KF_SERVER_PATH_WEBROOT: path.join(baseDir, 'build'),
  KF_SERVER_URL_PATH: '/',
}

// ────────────────────────────────────────────────
// CLI OPTIONS
// ────────────────────────────────────────────────
const yargs = require('yargs')
  .version(false)
  .option('p', {
    alias: 'port',
    describe: 'Web server port (default=auto)',
    number: true,
    requiresArg: true,
  })
  .option('urlPath', {
    describe: 'Web server URL base path (default=/)',
    requiresArg: true,
    type: 'string',
  })
  .option('scan', {
    describe: 'Run the media scanner at startup',
  })
  .option('scannerConsoleLevel', {
    describe: 'Media scanner console level (default=4)',
    number: true,
    requiresArg: true,
  })
  .option('scannerLogLevel', {
    describe: 'Media scanner log file level (default=3)',
    number: true,
    requiresArg: true,
  })
  .option('serverConsoleLevel', {
    describe: 'Web server console level (default=4)',
    number: true,
    requiresArg: true,
  })
  .option('serverLogLevel', {
    describe: 'Web server log file level (default=3)',
    number: true,
    requiresArg: true,
  })
  .option('db', {
    describe: 'Database path (overrides KF_SERVER_DB_PATH)',
    requiresArg: true,
    type: 'string',
  })
  .option('v', {
    alias: 'version',
    describe: 'Output the Karaoke Forever Server version and exit',
  })
  .usage('$0')
  .usage('  Some options use the following numeric levels:')
  .usage('  0=off, 1=error, 2=warn, 3=info, 4=verbose, 5=debug')

let argv = yargs.argv

let _app
if (process.versions.electron) {
  _app = require('electron').app
  if (_app.isPackaged) {
    argv = yargs.parse(process.argv.slice(1))
  }
}

if (argv.version) {
  console.log(_app ? _app.getVersion() : process.env.npm_package_version)
  process.exit(0)
}

if (argv.scan) {
  env.KF_SERVER_SCAN = true
}

// ────────────────────────────────────────────────
// ENVIRONMENT VARIABLE MAPPING
// ────────────────────────────────────────────────
const opts = {
  port: 'KF_SERVER_PORT',
  urlPath: 'KF_SERVER_URL_PATH',
  scannerConsoleLevel: 'KF_SCANNER_CONSOLE_LEVEL',
  scannerLogLevel: 'KF_SCANNER_LOG_LEVEL',
  serverConsoleLevel: 'KF_SERVER_CONSOLE_LEVEL',
  serverLogLevel: 'KF_SERVER_LOG_LEVEL',
}

// CLI options override environment vars
Object.keys(opts).forEach(key => {
  if (typeof argv[key] !== 'undefined') {
    env[opts[key]] = argv[key]
    process.env[opts[key]] = argv[key]
  } else if (process.env[opts[key]]) {
    env[opts[key]] = process.env[opts[key]]
  }
})

// ────────────────────────────────────────────────
// DATABASE PATH LOGIC
// ────────────────────────────────────────────────
let dbPath

if (argv.db) {
  // 1️⃣ CLI option takes precedence
  dbPath = path.resolve(argv.db)
} else if (process.env.KF_SERVER_DB_PATH) {
  // 2️⃣ Environment variable
  dbPath = process.env.KF_SERVER_DB_PATH
} else {
  // 3️⃣ Default fallback
  dbPath = path.join(baseDir, 'db')
}

// Ensure folder exists (optional)
if (!fs.existsSync(dbPath)) {
  fs.mkdirSync(dbPath, { recursive: true })
}

env.KF_SERVER_DB_PATH = dbPath
process.env.KF_SERVER_DB_PATH = dbPath

// ────────────────────────────────────────────────
module
  .exports = env
