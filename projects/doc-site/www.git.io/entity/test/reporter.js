// entity/test/reporter.js
// Test result reporters for TYT Testing Framework

if (typeof tyt === 'undefined') { window.tyt = {}; }

(function(){
  tyt.test = tyt.test || {};
  tyt.test.reporters = tyt.test.reporters || {};

  function consoleReporter(suites, stats) {
    var output = [];
    var hasFailures = false;
    
    suites.forEach(function(suite){
      if (suite.tests.length === 0) return;
      
      output.push('\n' + suite.name);
      
      suite.tests.forEach(function(test){
        var symbol = '';
        var color = '';
        
        if (test.status === 'passed') {
          symbol = '  ✓';
          color = '\x1b[32m'; // green
        } else if (test.status === 'failed') {
          symbol = '  ✗';
          color = '\x1b[31m'; // red
          hasFailures = true;
        } else if (test.status === 'skipped') {
          symbol = '  -';
          color = '\x1b[33m'; // yellow
        }
        
        var reset = '\x1b[0m';
        var duration = test.duration ? ' (' + test.duration + 'ms)' : '';
        
        output.push(color + symbol + ' ' + test.name + duration + reset);
        
        if (test.error && test.status === 'failed') {
          output.push('    ' + test.error.message);
          if (test.error.stack) {
            output.push('    ' + test.error.stack.split('\n')[1]);
          }
        }
      });
    });
    
    output.push('');
    
    if (stats.passed > 0) {
      output.push('\x1b[32m' + stats.passed + ' passing\x1b[0m');
    }
    if (stats.failed > 0) {
      output.push('\x1b[31m' + stats.failed + ' failing\x1b[0m');
    }
    if (stats.skipped > 0) {
      output.push('\x1b[33m' + stats.skipped + ' skipped\x1b[0m');
    }
    
    console.log(output.join('\n'));
    
    return hasFailures ? 1 : 0;
  }

  function htmlReporter(suites, stats) {
    var html = [];
    
    html.push('<div class="test-results">');
    html.push('<div class="test-summary">');
    html.push('<h2>Test Results</h2>');
    html.push('<div class="stats">');
    html.push('<span class="stat passed">' + stats.passed + ' passed</span>');
    html.push('<span class="stat failed">' + stats.failed + ' failed</span>');
    html.push('<span class="stat skipped">' + stats.skipped + ' skipped</span>');
    html.push('<span class="stat total">' + stats.total + ' total</span>');
    html.push('</div>');
    html.push('</div>');
    
    suites.forEach(function(suite){
      if (suite.tests.length === 0) return;
      
      html.push('<div class="test-suite">');
      html.push('<h3>' + escape(suite.name) + '</h3>');
      html.push('<ul class="test-list">');
      
      suite.tests.forEach(function(test){
        var statusClass = 'test-' + test.status;
        var symbol = test.status === 'passed' ? '✓' : (test.status === 'failed' ? '✗' : '-');
        
        html.push('<li class="test-case ' + statusClass + '">');
        html.push('<span class="symbol">' + symbol + '</span>');
        html.push('<span class="name">' + escape(test.name) + '</span>');
        if (test.duration) {
          html.push('<span class="duration">' + test.duration + 'ms</span>');
        }
        
        if (test.error && test.status === 'failed') {
          html.push('<div class="error-message">' + escape(test.error.message) + '</div>');
        }
        
        html.push('</li>');
      });
      
      html.push('</ul>');
      html.push('</div>');
    });
    
    html.push('</div>');
    
    return html.join('\n');
  }

  function jsonReporter(suites, stats) {
    var result = {
      summary: stats,
      suites: []
    };
    
    suites.forEach(function(suite){
      var suiteData = {
        name: suite.name,
        tests: []
      };
      
      suite.tests.forEach(function(test){
        suiteData.tests.push({
          name: test.name,
          status: test.status,
          duration: test.duration,
          error: test.error ? {
            message: test.error.message,
            stack: test.error.stack
          } : null
        });
      });
      
      result.suites.push(suiteData);
    });
    
    return JSON.stringify(result, null, 2);
  }

  function escape(str) {
    if (str == null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  tyt.test.reporters.console = consoleReporter;
  tyt.test.reporters.html = htmlReporter;
  tyt.test.reporters.json = jsonReporter;
})();
