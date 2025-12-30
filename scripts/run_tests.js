#!/usr/bin/env node
// scripts/run_tests.js
// Node.js test runner for CI/CD integration

const fs = require('fs');
const path = require('path');
const vm = require('vm');

// Load TYT framework
const tytCode = fs.readFileSync(path.join(__dirname, '../tyt.js'), 'utf-8');

// Create global context
const context = {
  console: console,
  require: require,
  module: module,
  exports: exports,
  __dirname: __dirname,
  __filename: __filename,
  setTimeout: setTimeout,
  clearTimeout: clearTimeout,
  setInterval: setInterval,
  clearInterval: clearInterval,
  // Mock XMLHttpRequest for Node.js
  XMLHttpRequest: function() {
    var self = this;
    this.open = function(method, url) {
      this._url = url;
    };
    this.send = function() {
      var filePath = path.resolve(__dirname, '..', 'projects/doc-site/www', this._url);
      try {
        var data = fs.readFileSync(filePath, 'utf-8');
        this.responseText = data;
        this.status = 200;
        if (this.onload) this.onload();
      } catch (err) {
        this.status = 404;
        if (this.onerror) this.onerror(err);
      }
    };
  }
};

vm.createContext(context);

// Execute TYT framework
vm.runInContext(tytCode, context);

// Load testing modules
const assertionsCode = fs.readFileSync(path.join(__dirname, '../entity/test/assertions.js'), 'utf-8');
const runnerCode = fs.readFileSync(path.join(__dirname, '../entity/test/testRunner.js'), 'utf-8');
const reporterCode = fs.readFileSync(path.join(__dirname, '../entity/test/reporter.js'), 'utf-8');

vm.runInContext(assertionsCode, context);
vm.runInContext(runnerCode, context);
vm.runInContext(reporterCode, context);

// Load test dependencies (only for doc-site tests)
const logCode = fs.readFileSync(path.join(__dirname, '../entity/common/log.js'), 'utf-8');
const dataLoaderCode = fs.readFileSync(path.join(__dirname, '../entity/common/dataLoader.js'), 'utf-8');
const renderCode = fs.readFileSync(path.join(__dirname, '../entity/common/render.js'), 'utf-8');

vm.runInContext(logCode, context);
vm.runInContext(dataLoaderCode, context);
vm.runInContext(renderCode, context);

// Find and load test files
function findTestFiles(dir, pattern) {
  const files = [];
  
  function search(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    items.forEach(function(item) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        search(fullPath);
      } else if (pattern.test(item)) {
        files.push(fullPath);
      }
    });
  }
  
  search(dir);
  return files;
}

// Parse command line arguments
const args = process.argv.slice(2);
let testDir = path.join(__dirname, '../projects/doc-site/tests');
let filterPattern = null;
let reporter = 'console';

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--dir' && args[i + 1]) {
    testDir = args[i + 1];
    i++;
  } else if (args[i] === '--filter' && args[i + 1]) {
    filterPattern = args[i + 1];
    i++;
  } else if (args[i] === '--reporter' && args[i + 1]) {
    reporter = args[i + 1];
    i++;
  } else if (args[i] === '--help') {
    console.log('Usage: node run_tests.js [options]');
    console.log('Options:');
    console.log('  --dir <path>        Test directory (default: projects/doc-site/tests)');
    console.log('  --filter <pattern>  Filter test suites by name');
    console.log('  --reporter <type>   Reporter type: console, json (default: console)');
    console.log('  --help             Show this help');
    process.exit(0);
  }
}

// Load test files
const testFiles = findTestFiles(testDir, /\.test\.js$/);

if (testFiles.length === 0) {
  console.error('No test files found in:', testDir);
  process.exit(1);
}

console.log('Loading ' + testFiles.length + ' test file(s)...\n');

testFiles.forEach(function(file) {
  try {
    const testCode = fs.readFileSync(file, 'utf-8');
    vm.runInContext(testCode, context);
  } catch (err) {
    console.error('Error loading test file:', file);
    console.error(err.message);
    process.exit(1);
  }
});

// Run tests
console.log('Running tests...\n');

var testStats;
try {
  testStats = vm.runInContext(
    'tyt.runTests({ filter: ' + JSON.stringify(filterPattern) + ', reporter: "' + reporter + '" });',
    context
  );
} catch (err) {
  console.error('Error running tests:', err.message);
  process.exit(1);
}

// Exit with appropriate code
var exitCode = testStats.failed > 0 ? 1 : 0;

process.exit(exitCode);
