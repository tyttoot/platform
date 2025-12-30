# Project Template

Template for creating new projects in the TYT Platform v2.

## Usage

```bash
make new-project name=myproject
```

## Structure

```
projects/{name}/
├── README.md              # Project documentation
├── www/                   # Web root
│   ├── index.html        # Main HTML entry
│   ├── index.css         # Project styles
│   └── define.js         # Project config (tyt.srcConfig)
├── data/                  # Data files
│   ├── schema.json       # Data schema
│   └── docs/             # Documentation (if doc-site pattern)
├── deploy/                # Deployment configs
│   └── .gitkeep
└── document/              # Project-specific docs
    └── README.md
```

## Quick Start

1. Create project: `make new-project name=myapp`
2. Navigate: `cd projects/myapp/www/`
3. Edit `define.js` to set project config
4. Edit `index.html` for your UI
5. Serve: `make serve` (from root)
6. Open: http://localhost:8080/projects/myapp/www/

## Project Config (define.js)

```javascript
tyt.srcConfig = {
  projectName: '{{NAME}}',
  projectPath: './projects/{{NAME}}/www/',
  mode: 'dev',
  currentPage: 'home'
};
```

## Best Practices

1. Keep projects isolated (data, www, deploy separate)
2. Use entity/ libs for shared logic
3. Follow naming conventions (lowercase, hyphens)
4. Document dependencies in README
5. Add deployment configs in deploy/
