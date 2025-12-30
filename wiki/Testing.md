# Testing with TYT Framework

**Version:** 1.0.0
**Category:** guides

---

## 1. Framework Overview

**Why:** TYT provides a zero-dependency, ES5-compatible testing framework that works in both browser and Node.js environments

**What:** The framework consists of three core modules: assertions (assert/expect API), testRunner (describe/it/hooks), and reporter (console/html/json output formats)

**How:**

```
Tests are organized into suites with describe(), individual tests with it() or test(), and setup/teardown with hooks (beforeEach, afterEach, beforeAll, afterAll). Example:

tyt.describe('My Suite', function(){
  tyt.it('should work', function(){
    tyt.assert.equal(1 + 1, 2);
  });
});
```

## 2. Writing Unit Tests

**Why:** Unit tests verify individual functions and modules in isolation to catch bugs early and enable safe refactoring

**What:** Create .test.js files in tests/unit/ directory testing a single module's functionality with multiple test cases covering normal and edge cases

**How:**

```
1. Create tests/unit/myModule.test.js
2. Use tyt.describe() to group related tests
3. Write individual tests with tyt.it()
4. Use assertions: tyt.assert.equal(), tyt.expect().toBe()
5. Test edge cases: null, undefined, empty arrays, etc.

Example: tests/unit/render.test.js tests the render module's escapeHtml, heading, paragraph, and list functions
```

## 3. Writing Integration Tests

**Why:** Integration tests verify that multiple modules work together correctly and data flows properly between components

**What:** Create .test.js files in tests/integration/ testing how modules interact, data loading, API calls, and navigation flows

**How:**

```
1. Create tests/integration/feature.test.js
2. Test multi-module workflows
3. Use async tests with done() callback for AJAX/fetch
4. Verify data transformations across boundaries

Example:
tyt.it('should load and render doc', function(done){
  loader.fetchJson('data.json', function(err, data){
    tyt.assert.ok(!err);
    var html = render.docItems(data.items);
    tyt.assert.ok(html.indexOf('Title') !== -1);
    done();
  });
});
```

## 4. Assertion API

**Why:** Assertions validate expected behavior and provide clear error messages when tests fail

**What:** Two APIs available: assert (traditional) and expect (BDD-style). Both support equality checks, type checks, array/object operations, and error handling

**How:**

```
Assert API:
- tyt.assert.ok(value) - truthy check
- tyt.assert.equal(actual, expected) - loose equality
- tyt.assert.strictEqual(actual, expected) - strict equality
- tyt.assert.deepEqual(obj1, obj2) - recursive comparison
- tyt.assert.isString/isNumber/isArray/isFunction(value)
- tyt.assert.contains(array, value)
- tyt.assert.hasProperty(obj, 'prop')

Expect API:
- tyt.expect(value).toBe(expected)
- tyt.expect(value).toEqual(expected)
- tyt.expect(value).toBeTruthy/toBeFalsy()
- tyt.expect(array).toContain(item)
- tyt.expect(fn).toThrow()
```

## 5. Test Hooks

**Why:** Hooks reduce duplication by sharing setup and teardown code across multiple tests

**What:** Four hook types: beforeEach (runs before each test), afterEach (runs after each test), beforeAll (runs once before suite), afterAll (runs once after suite)

**How:**

```
tyt.describe('My Tests', function(){
  var data;
  
  tyt.beforeAll(function(){
    // Setup once for all tests
    data = loadTestData();
  });
  
  tyt.beforeEach(function(){
    // Reset state before each test
    data.reset();
  });
  
  tyt.it('test 1', function(){
    // Use data
  });
  
  tyt.afterEach(function(){
    // Cleanup after each test
  });
});
```

## 6. Async Testing

**Why:** Many operations (AJAX, file I/O, timers) are asynchronous and require special handling in tests

**What:** Tests can be async by accepting a done callback parameter. Call done() when test completes, or done(error) to fail the test. Tests timeout after 5 seconds if done() not called

**How:**

```
tyt.it('async test', function(done){
  loader.fetchJson('data.json', function(err, data){
    if (err) return done(err);
    
    tyt.assert.ok(data);
    tyt.assert.hasProperty(data, 'id');
    done(); // Signal test complete
  });
});

// Timeout will fail test:
tyt.it('slow test', function(done){
  // If this takes > 5s, test fails
  slowOperation(done);
});
```

## 7. Running Tests in Browser

**Why:** Browser tests verify that code works in the actual runtime environment with real DOM APIs

**What:** Create an HTML test runner that loads test files and displays results with visual feedback

**How:**

```
1. Create tests/index.html
2. Load tyt.js, test framework modules, and your code
3. Load test files with <script> tags
4. Call tyt.runTests({ reporter: 'html' })
5. Open tests/index.html in browser

Example structure:
<script src="../tyt.js"></script>
<script src="../entity/test/assertions.js"></script>
<script src="../entity/test/testRunner.js"></script>
<script src="../entity/test/reporter.js"></script>
<script src="unit/myModule.test.js"></script>
<script>
  tyt.runTests({ reporter: 'html' });
</script>
```

## 8. Running Tests in Node.js

**Why:** Node.js tests enable automated testing in CI/CD pipelines and faster execution without browser overhead

**What:** Use scripts/run_tests.js to execute tests in Node.js environment with command-line interface

**How:**

```
Run tests:
$ node scripts/run_tests.js

Options:
$ node scripts/run_tests.js --dir projects/doc-site/tests --filter "Navigation" --reporter json

--dir <path>: Test directory to scan
--filter <pattern>: Run only matching suites
--reporter <type>: Output format (console, json)

Exit codes:
- 0: All tests passed
- 1: One or more tests failed
```

## 9. Makefile Integration

**Why:** Makefile commands provide consistent interface for running tests and integrate with existing automation

**What:** Standard test targets: test (all tests), test-unit (unit only), test-integration (integration only), test-watch (watch mode)

**How:**

```
Run all tests:
$ make test

Run unit tests only:
$ make test-unit

Run integration tests:
$ make test-integration

Watch mode (re-run on file changes):
$ make test-watch

All test commands log to HISTORY.md for tracking test execution and results over time
```

## 10. Test Organization

**Why:** Consistent test structure makes tests easy to find, understand, and maintain

**What:** Standard directory structure: tests/unit/ for isolated module tests, tests/integration/ for multi-module tests, tests/e2e/ for full user workflows

**How:**

```
tests/
  index.html          # Browser test runner
  unit/               # Isolated module tests
    render.test.js
    dataLoader.test.js
  integration/        # Multi-module tests
    navigation.test.js
    workflow.test.js
  e2e/                # End-to-end tests
    userJourney.test.js

Naming: <module>.test.js for unit, <feature>.test.js for integration/e2e
```

## 11. Coverage and Quality

**Why:** Test coverage metrics identify untested code and guide testing efforts to critical areas

**What:** Aim for 80%+ coverage of core logic. Focus on: public APIs, error handling, edge cases, user-facing features. Skip: trivial getters/setters, third-party code, generated code

**How:**

```
Coverage priorities:
1. Public module APIs (100%)
2. Error handling paths (100%)
3. Business logic (80%+)
4. UI components (70%+)
5. Utilities (60%+)

Write tests for:
- Happy path (normal usage)
- Error cases (invalid input, network errors)
- Edge cases (null, empty, boundary values)
- Regression tests (bugs that were fixed)
```

## 12. CI/CD Integration

**Why:** Automated testing in CI/CD catches bugs before they reach production and enables confident deployments

**What:** Run tests automatically on every commit/PR, block merges if tests fail, generate test reports for review

**How:**

```
GitHub Actions workflow:

name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: make test
      - run: node scripts/run_tests.js --reporter json > test-results.json
      - uses: actions/upload-artifact@v2
        with:
          name: test-results
          path: test-results.json

Pre-commit hook:
#!/bin/sh
make test || exit 1
```
