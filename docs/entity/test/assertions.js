// entity/test/assertions.js
// Assertion library for TYT Testing Framework

if (typeof tyt === 'undefined') { window.tyt = {}; }

(function(){
  tyt.test = tyt.test || {};

  function AssertionError(message, actual, expected) {
    this.name = 'AssertionError';
    this.message = message;
    this.actual = actual;
    this.expected = expected;
  }
  AssertionError.prototype = new Error();

  function assert(condition, message) {
    if (!condition) {
      throw new AssertionError(message || 'Assertion failed');
    }
  }

  assert.ok = function(value, message) {
    if (!value) {
      throw new AssertionError(message || 'Expected ' + value + ' to be truthy');
    }
  };

  assert.equal = function(actual, expected, message) {
    if (actual != expected) {
      throw new AssertionError(
        message || 'Expected ' + actual + ' to equal ' + expected,
        actual,
        expected
      );
    }
  };

  assert.strictEqual = function(actual, expected, message) {
    if (actual !== expected) {
      throw new AssertionError(
        message || 'Expected ' + actual + ' to strictly equal ' + expected,
        actual,
        expected
      );
    }
  };

  assert.notEqual = function(actual, expected, message) {
    if (actual == expected) {
      throw new AssertionError(
        message || 'Expected ' + actual + ' not to equal ' + expected,
        actual,
        expected
      );
    }
  };

  assert.deepEqual = function(actual, expected, message) {
    if (!deepEquals(actual, expected)) {
      throw new AssertionError(
        message || 'Expected objects to be deeply equal',
        actual,
        expected
      );
    }
  };

  assert.isString = function(value, message) {
    if (typeof value !== 'string') {
      throw new AssertionError(message || 'Expected value to be a string', value, 'string');
    }
  };

  assert.isNumber = function(value, message) {
    if (typeof value !== 'number') {
      throw new AssertionError(message || 'Expected value to be a number', value, 'number');
    }
  };

  assert.isFunction = function(value, message) {
    if (typeof value !== 'function') {
      throw new AssertionError(message || 'Expected value to be a function', value, 'function');
    }
  };

  assert.isArray = function(value, message) {
    if (!Array.isArray(value)) {
      throw new AssertionError(message || 'Expected value to be an array', value, 'array');
    }
  };

  assert.contains = function(array, item, message) {
    var found = false;
    for (var i = 0; i < array.length; i++) {
      if (array[i] === item) {
        found = true;
        break;
      }
    }
    if (!found) {
      throw new AssertionError(message || 'Expected array to contain ' + item, array, item);
    }
  };

  assert.hasProperty = function(object, key, message) {
    if (!(key in object)) {
      throw new AssertionError(message || 'Expected object to have property ' + key, object, key);
    }
  };

  function deepEquals(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return a === b;
    if (typeof a !== typeof b) return false;
    
    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) return false;
      for (var i = 0; i < a.length; i++) {
        if (!deepEquals(a[i], b[i])) return false;
      }
      return true;
    }
    
    if (typeof a === 'object' && typeof b === 'object') {
      var keysA = Object.keys(a);
      var keysB = Object.keys(b);
      if (keysA.length !== keysB.length) return false;
      for (var j = 0; j < keysA.length; j++) {
        var key = keysA[j];
        if (!b.hasOwnProperty(key)) return false;
        if (!deepEquals(a[key], b[key])) return false;
      }
      return true;
    }
    
    return false;
  }

  // BDD-style expect API
  function expect(value) {
    return {
      toBe: function(expected) {
        assert.strictEqual(value, expected);
      },
      toEqual: function(expected) {
        assert.equal(value, expected);
      },
      toBeTrue: function() {
        assert.strictEqual(value, true);
      },
      toBeFalse: function() {
        assert.strictEqual(value, false);
      },
      toBeTruthy: function() {
        assert.ok(value);
      },
      toBeFalsy: function() {
        assert.ok(!value);
      },
      toContain: function(item) {
        assert.contains(value, item);
      },
      toHaveProperty: function(key) {
        assert.hasProperty(value, key);
      },
      toBeArray: function() {
        assert.isArray(value);
      },
      toBeString: function() {
        assert.isString(value);
      },
      toBeNumber: function() {
        assert.isNumber(value);
      },
      toBeFunction: function() {
        assert.isFunction(value);
      },
      toThrow: function() {
        if (typeof value !== 'function') {
          throw new AssertionError('Expected a function to test for throw');
        }
        var threw = false;
        try {
          value();
        } catch (e) {
          threw = true;
        }
        if (!threw) {
          throw new AssertionError('Expected function to throw');
        }
      }
    };
  }

  tyt.test.assert = assert;
  tyt.test.expect = expect;
  tyt.test.AssertionError = AssertionError;
  
  // Global aliases
  tyt.assert = assert;
  tyt.expect = expect;
})();
