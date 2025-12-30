// entity/test/testRunner.js
// Test execution engine for TYT Testing Framework

if (typeof tyt === 'undefined') { window.tyt = {}; }

(function(){
  tyt.test = tyt.test || {};

  var testSuites = [];
  var currentSuite = null;
  var testStats = { total: 0, passed: 0, failed: 0, skipped: 0 };

  function TestSuite(name, fn) {
    this.name = name;
    this.tests = [];
    this.beforeEach = null;
    this.afterEach = null;
    this.beforeAll = null;
    this.afterAll = null;
    this.fn = fn;
  }

  function TestCase(name, fn, skip) {
    this.name = name;
    this.fn = fn;
    this.skip = skip || false;
    this.status = 'pending';
    this.error = null;
    this.duration = 0;
  }

  function describe(name, fn) {
    var suite = new TestSuite(name, fn);
    testSuites.push(suite);
    
    var prevSuite = currentSuite;
    currentSuite = suite;
    fn();
    currentSuite = prevSuite;
    
    return suite;
  }

  function it(name, fn) {
    if (!currentSuite) {
      throw new Error('it() must be called inside describe()');
    }
    var test = new TestCase(name, fn);
    currentSuite.tests.push(test);
    return test;
  }

  function test(name, fn) {
    // Create anonymous suite for standalone tests
    var suite = new TestSuite('Standalone', function(){});
    suite.tests.push(new TestCase(name, fn));
    testSuites.push(suite);
  }

  function xit(name, fn) {
    if (!currentSuite) {
      throw new Error('xit() must be called inside describe()');
    }
    var test = new TestCase(name, fn, true);
    currentSuite.tests.push(test);
    return test;
  }

  function beforeEach(fn) {
    if (currentSuite) currentSuite.beforeEach = fn;
  }

  function afterEach(fn) {
    if (currentSuite) currentSuite.afterEach = fn;
  }

  function beforeAll(fn) {
    if (currentSuite) currentSuite.beforeAll = fn;
  }

  function afterAll(fn) {
    if (currentSuite) currentSuite.afterAll = fn;
  }

  function runTest(testCase, suite) {
    if (testCase.skip) {
      testCase.status = 'skipped';
      testStats.skipped++;
      return;
    }

    var startTime = Date.now();
    
    try {
      if (suite.beforeEach) suite.beforeEach();
      
      // Check if test is async (has done callback)
      if (testCase.fn.length > 0) {
        var isDone = false;
        var timeout = setTimeout(function(){
          if (!isDone) {
            testCase.error = new Error('Test timeout (async test did not call done())');
            testCase.status = 'failed';
            testStats.failed++;
          }
        }, 5000);
        
        testCase.fn(function done() {
          isDone = true;
          clearTimeout(timeout);
          testCase.status = 'passed';
          testStats.passed++;
        });
      } else {
        testCase.fn();
        testCase.status = 'passed';
        testStats.passed++;
      }
      
      if (suite.afterEach) suite.afterEach();
      
    } catch (error) {
      testCase.error = error;
      testCase.status = 'failed';
      testStats.failed++;
    }
    
    testCase.duration = Date.now() - startTime;
    testStats.total++;
  }

  function runSuite(suite) {
    if (suite.beforeAll) {
      try {
        suite.beforeAll();
      } catch (error) {
        // If beforeAll fails, skip all tests in suite
        suite.tests.forEach(function(t){ t.status = 'skipped'; testStats.skipped++; });
        return;
      }
    }
    
    suite.tests.forEach(function(test){
      runTest(test, suite);
    });
    
    if (suite.afterAll) {
      try {
        suite.afterAll();
      } catch (error) {
        console.error('afterAll failed:', error);
      }
    }
  }

  function runTests(options) {
    options = options || {};
    var reporter = options.reporter || 'console';
    var suiteFilter = options.suite;
    
    // Reset stats
    testStats = { total: 0, passed: 0, failed: 0, skipped: 0 };
    
    // Filter suites if needed
    var suitesToRun = testSuites;
    if (suiteFilter) {
      suitesToRun = testSuites.filter(function(s){
        return s.name.indexOf(suiteFilter) !== -1;
      });
    }
    
    // Run all suites
    suitesToRun.forEach(function(suite){
      runSuite(suite);
    });
    
    // Report results
    var reporterFn = tyt.test.reporters && tyt.test.reporters[reporter];
    if (reporterFn) {
      reporterFn(suitesToRun, testStats);
    }
    
    return testStats;
  }

  function clearTests() {
    testSuites = [];
    currentSuite = null;
    testStats = { total: 0, passed: 0, failed: 0, skipped: 0 };
  }

  tyt.test.describe = describe;
  tyt.test.it = it;
  tyt.test.test = test;
  tyt.test.xit = xit;
  tyt.test.beforeEach = beforeEach;
  tyt.test.afterEach = afterEach;
  tyt.test.beforeAll = beforeAll;
  tyt.test.afterAll = afterAll;
  tyt.test.runTests = runTests;
  tyt.test.clearTests = clearTests;
  tyt.test.getStats = function(){ return testStats; };
  tyt.test.getSuites = function(){ return testSuites; };
  
  // Global aliases
  tyt.describe = describe;
  tyt.it = it;
  tyt.test = test;
  tyt.xit = xit;
  tyt.beforeEach = beforeEach;
  tyt.afterEach = afterEach;
  tyt.beforeAll = beforeAll;
  tyt.afterAll = afterAll;
  tyt.runTests = runTests;
})();
