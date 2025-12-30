# TYT Testing Framework Design

## Overview

Lightweight, zero-dependency testing framework for TYT Platform v2 projects.

## Principles

1. **No External Dependencies**: Pure ES5 JavaScript
2. **Browser & Node Compatible**: Runs in both environments
3. **Simple API**: Familiar test/expect pattern
4. **Fast**: Minimal overhead, synchronous by default
5. **Integrated**: Works with existing entity system

## Architecture

```
entity/test/
├── testRunner.js      # Test execution engine
├── assertions.js      # Assertion library (expect, assert)
├── reporter.js        # Test result formatting
└── README.md         # Documentation

projects/{name}/tests/
├── unit/             # Unit tests
├── integration/      # Integration tests
└── e2e/             # End-to-end tests (browser)
```

## API Design

### Test Definition

```javascript
// Simple test case
tyt.test('addition works', function(){
  var result = 1 + 1;
  tyt.assert.equal(result, 2);
});

// Test suite
tyt.describe('Calculator', function(){
  tyt.it('should add numbers', function(){
    tyt.expect(add(1, 2)).toBe(3);
  });
  
  tyt.it('should subtract numbers', function(){
    tyt.expect(subtract(5, 3)).toBe(2);
  });
});
```

### Assertions

```javascript
// Equality
tyt.assert.equal(actual, expected)
tyt.assert.notEqual(actual, expected)
tyt.assert.strictEqual(actual, expected)

// Truthiness
tyt.assert.ok(value)
tyt.assert.truthy(value)
tyt.assert.falsy(value)

// Type checks
tyt.assert.isString(value)
tyt.assert.isNumber(value)
tyt.assert.isFunction(value)
tyt.assert.isArray(value)

// Object/Array
tyt.assert.deepEqual(actual, expected)
tyt.assert.contains(array, item)
tyt.assert.hasProperty(object, key)

// Expect chain (BDD style)
tyt.expect(value).toBe(expected)
tyt.expect(value).toEqual(expected)
tyt.expect(value).toBeTrue()
tyt.expect(value).toBeFalse()
tyt.expect(value).toContain(item)
tyt.expect(fn).toThrow()
```

### Test Runner

```javascript
// Run all tests
tyt.runTests();

// Run specific suite
tyt.runTests({ suite: 'Calculator' });

// Run with reporter
tyt.runTests({ reporter: 'console' }); // or 'html', 'json'

// Async support
tyt.test('async operation', function(done){
  setTimeout(function(){
    tyt.assert.ok(true);
    done();
  }, 100);
});
```

## Test Structure for Doc-Site

```javascript
// projects/doc-site/tests/unit/render.test.js
tyt.describe('Render Module', function(){
  tyt.it('should escape HTML', function(){
    var render = tyt.lib.common.render;
    var result = render.escapeHtml('<script>alert(1)</script>');
    tyt.expect(result).toEqual('&lt;script&gt;alert(1)&lt;/script&gt;');
  });
  
  tyt.it('should render heading', function(){
    var render = tyt.lib.common.render;
    var result = render.heading('Test');
    tyt.expect(result).toEqual('<h1>Test</h1>');
  });
});

// projects/doc-site/tests/integration/navigation.test.js
tyt.describe('Navigation', function(){
  tyt.it('should load rules page', function(done){
    var loader = tyt.lib.common.dataLoader;
    loader.fetchJson('../data/docs/rules/core-rules.json', function(err, data){
      tyt.assert.ok(!err);
      tyt.assert.equal(data.id, 'rules.core');
      done();
    });
  });
});

// projects/doc-site/tests/e2e/search.test.js
tyt.describe('Search Functionality', function(){
  tyt.it('should filter items by search query', function(){
    var input = document.getElementById('doc-search');
    var event = new Event('input');
    
    input.value = 'naming';
    input.dispatchEvent(event);
    
    var items = document.querySelectorAll('.content li');
    tyt.assert.ok(items.length > 0);
  });
});
```

## Makefile Integration

```makefile
test:
	@node scripts/run_tests.js

test-unit:
	@node scripts/run_tests.js --suite=unit

test-integration:
	@node scripts/run_tests.js --suite=integration

test-watch:
	@node scripts/run_tests.js --watch

test-coverage:
	@node scripts/run_tests.js --coverage
```

## CI/CD Integration

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run Tests
        run: make test
      - name: Validate Docs
        run: make validate
      - name: Validate Tasks
        run: make task-validate
```

## Reporter Formats

### Console Reporter
```
✓ addition works (2ms)
✓ Calculator > should add numbers (1ms)
✓ Calculator > should subtract numbers (1ms)

3 passing (15ms)
```

### HTML Reporter
```html
<div class="test-results">
  <div class="test-suite">
    <h2>Calculator</h2>
    <div class="test-case pass">✓ should add numbers</div>
    <div class="test-case pass">✓ should subtract numbers</div>
  </div>
</div>
```

### JSON Reporter
```json
{
  "suites": [
    {
      "name": "Calculator",
      "tests": [
        {"name": "should add numbers", "status": "pass", "duration": 1},
        {"name": "should subtract numbers", "status": "pass", "duration": 1}
      ]
    }
  ],
  "summary": {"total": 2, "passed": 2, "failed": 0}
}
```

## Next Steps

1. Implement `entity/test/testRunner.js`
2. Implement `entity/test/assertions.js`
3. Implement `entity/test/reporter.js`
4. Create `scripts/run_tests.js`
5. Write tests for doc-site
6. Add Makefile test targets
7. Document testing guide
