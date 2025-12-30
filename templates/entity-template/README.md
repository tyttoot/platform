# Entity Module Template

Template for creating new entity modules in the TYT Platform v2.

## Usage

```bash
make new-entity name=myModule category=common
```

## Structure

```
entity/{category}/{name}/
├── README.md          # Module documentation
├── index.js           # Main module entry (if needed)
└── {name}.js          # Core module logic
```

## Example Module Pattern (ES5)

```javascript
// entity/common/myModule.js
if (typeof tyt === 'undefined') { window.tyt = {}; }

(function(){
  tyt.lib = tyt.lib || {};
  tyt.lib.common = tyt.lib.common || {};

  function myFunction(param) {
    // Implementation
    return param;
  }

  tyt.lib.common.myModule = {
    myFunction: myFunction
  };
})();
```

## Categories

- `config/` - Configuration and constants
- `common/` - Shared utilities (log, dataLoader, render)
- `ui/` - UI components (button, panel)
- `game/` - Game engine modules
- `physics/` - Physics simulation
- `ai/` - AI behaviors
- `input/` - Input handling
- `render/` - Rendering utilities
- `system/` - System-level modules

## Rules

1. Use ES5 syntax (no ES6+)
2. No external dependencies
3. Keep modules generic and reusable
4. Document purpose, inputs, outputs
5. Test in isolation before integrating
