# entity/test/

Testing framework for TYT Platform v2.

## Modules

- [assertions.js](assertions.js) - Assertion library (assert/expect API)
- [testRunner.js](testRunner.js) - Test execution engine
- [reporter.js](reporter.js) - Test result formatters (console/html/json)

## Quick Start

```javascript
// Require test modules
tyt.require('lib/test/assertions');
tyt.require('lib/test/testRunner');
tyt.require('lib/test/reporter');

// Write tests
tyt.describe('MyModule', function(){
  tyt.it('should work', function(){
    tyt.expect(1 + 1).toBe(2);
  });
});

// Run tests
tyt.runTests();
```

## API

### Test Definition

```javascript
// Test suite
tyt.describe('Suite Name', function(){
  // Test cases
  tyt.it('test description', function(){
    // assertions
  });
  
  // Skip test
  tyt.xit('skipped test', function(){
    // won't run
  });
});

// Standalone test
tyt.test('standalone test', function(){
  tyt.assert.ok(true);
});
```

### Hooks

```javascript
tyt.describe('Suite', function(){
  tyt.beforeAll(function(){ /* runs once before all tests */ });
  tyt.afterAll(function(){ /* runs once after all tests */ });
  tyt.beforeEach(function(){ /* runs before each test */ });
  tyt.afterEach(function(){ /* runs after each test */ });
});
```

### Assertions

```javascript
// Assert API
tyt.assert.ok(value);
tyt.assert.equal(actual, expected);
tyt.assert.strictEqual(actual, expected);
tyt.assert.deepEqual(obj1, obj2);
tyt.assert.isString(value);
tyt.assert.isNumber(value);
tyt.assert.isArray(value);
tyt.assert.contains(array, item);
tyt.assert.hasProperty(obj, key);

// Expect API (BDD style)
tyt.expect(value).toBe(expected);
tyt.expect(value).toEqual(expected);
tyt.expect(value).toBeTrue();
tyt.expect(value).toBeTruthy();
tyt.expect(array).toContain(item);
tyt.expect(fn).toThrow();
```

### Running Tests

```javascript
// Run all tests
tyt.runTests();

// Run with specific reporter
tyt.runTests({ reporter: 'console' });  // default
tyt.runTests({ reporter: 'html' });
tyt.runTests({ reporter: 'json' });

// Filter by suite
tyt.runTests({ suite: 'MyModule' });

// Get stats
var stats = tyt.test.getStats(); // {total, passed, failed, skipped}
```

### Async Tests

```javascript
tyt.it('async test', function(done){
  setTimeout(function(){
    tyt.assert.ok(true);
    done();  // must call done()
  }, 100);
});
```

## Example Test Files

See `/projects/doc-site/tests/` for complete examples:
- `unit/render.test.js` - Unit tests for render module
- `integration/navigation.test.js` - Integration tests for navigation
- `e2e/search.test.js` - End-to-end tests for search functionality
