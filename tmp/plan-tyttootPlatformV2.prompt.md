# Plan: Tyttoot Platform v2 — Complete Development Protocol

Build the platform from scratch with the doc-site as the first project, powered by tyttoot’s loader (tyt.js), plus versioning and automation. Keep it simple, dependency-free, and reusable by design.

## Goals
- Simple, consistent, reusable patterns for web/app/mobile via one mold
- Use the platform itself to build the documentation site (dogfooding)
- Automate as much as possible (scaffolding, validation, versioning)
- Data-driven docs (JSON) rendered by minimal UI components

## Scope (initial)
- Minimal `tyt.js` core (define/require/exec/router/main)
- Minimal `entity/` with core utilities (`config/const`, `common/log`, `ui/renderer`)
- First project `doc-site` with collapsible menu + content area (no libs)
- JSON data structure for docs (rules, guides, specs)
- Makefile + scripts for automation (later phase)

## Phases

### Phase 1: Platform Core Foundation ✅ COMPLETED
1. ✅ Init git repository with branches: `main`, `dev`
2. ✅ Implement minimal `tyt.js`:
   - `define(root, key, value)` — merge/extend namespaces
   - `require(fileUrl)` — queue files, resolve lib/src based on mode
   - `exec(filePaths, version)` — load scripts sequentially (browser + node)
   - `router(pageType)` — reset + load `lib/index` + run `tyt.lib.index()`
   - `main()` — set `libConfig`, load project `define.js`, route to page
3. ⏭️ (Optional backend) minimal `tyt.php` mirroring JS core - DEFERRED
4. ✅ Minimal `entity/index.js` + seed utilities:
   - `entity/config/const.js`
   - `entity/common/log.js`
   - `entity/common/render.js`
   - `entity/common/dataLoader.js`

### Phase 2: Doc-Site Project ✅ COMPLETED
5. ✅ Project structure: `projects/doc-site/`
   - `www/index.html` — minimal HTML skeleton (no deps)
   - `www/index.css` — dark theme styling
   - `www/define.js` — `tyt.srcConfig` (projectName, mode: dev, currentPage)
   - Sidebar navigation with search/filter UX
6. ✅ Data structure (JSON): `projects/doc-site/data/`
   - `schema.json` — `{ id, version, category, title, content, tags[], links[], items[] }`
   - `docs/` — complete: `rules/`, `guides/`, `specs/`

### Phase 3: Automation & Templates ✅ COMPLETED
7. ✅ Makefile targets (workspace root):
   - `serve` / `stop` / `status` — dev server management
   - `open-doc` — open doc-site in browser
   - `new-entity` — scaffold entity from template
   - `new-project` — scaffold project from template
   - `validate` — lint structure/rules (basic checks)
   - `new-doc` — scaffold documentation JSON
   - `version` — tag + HISTORY update
   - `history-add` / `history-show` — history logging
8. ✅ Scripts in `scripts/`:
   - `new_entity.sh`, `new_project.sh`, `doc_version.sh`
   - `validate_docs.js`, `new_doc.sh`, `history_log.sh`
9. ✅ Templates in `templates/`:
   - `entity-template/` with README and module.js.template
   - `project-template/` with www/, data/, deploy/, document/

### Phase 4: Documentation Content ✅ COMPLETED
10. ✅ Populate core docs as JSON in `doc-site/data/docs/`:
    - `rules/core-rules.json` — platform rules
    - `guides/getting-started.json` — quick start
    - `guides/ai-collaboration.json` — AI workflow
    - `guides/ai-workflow.json` — detailed AI practices
    - `guides/create-entity.json` — entity creation guide
    - `guides/create-project-template.json` — project scaffolding
    - `guides/platform-automation.json` — complete automation reference
    - `specs/tyt-architecture.json` — technical architecture
11. ✅ `HISTORY.md` — version timeline for v2.0.0
12. ✅ Complete AI collaboration documentation

## Architecture Overview
```
Platform v2
┌─────────────────────────────┐
│ tyt.js (loader)             │
│  define / require / exec    │
│  router / main              │
└─────────┬───────────────────┘
          │
   entity/ (shared libs)      projects/doc-site/ (first project)
   ├ config/const.js          ├ www/index.html
   ├ common/log.js            ├ www/define.js
   └ ui/renderer.js           └ www/src/main/
                               └ data/docs/*.json
```

## Implementation Order (Priority)
1. ✅ Git + `tyt.js` core
2. ✅ Minimal `entity/` utilities
3. ✅ Doc-site skeleton (index.html, define.js, styling)
4. ✅ Data schema + complete docs (8 documentation files)
5. ✅ Makefile + scripts (10 automation commands)
6. ✅ Templates (entity + project scaffolding)
7. ✅ History/versioning (HISTORY.md + git tagging)

## Current Status: v2.0.0 COMPLETED ✅

All phases completed successfully. Platform is ready for production use.

### Completed Features:
- ✅ Core loader system (tyt.js)
- ✅ Entity system with shared utilities
- ✅ Documentation site with search/filter
- ✅ Complete automation toolchain
- ✅ Scaffolding templates
- ✅ Version management
- ✅ Comprehensive documentation (8 guides)

## Next Steps (Future Enhancements)

### v2.1.0 Roadmap
- Mobile project templates (Cordova/Capacitor patterns)
- Entity bundling for production mode
- Enhanced validation (strict schema enforcement)
- Multi-doc search across all JSON files
- UI component library expansion (form, modal, tabs)
- Performance profiling tools

### v2.2.0 Roadmap
- PHP backend (tyt.php) - OPTIONAL
- Server-side rendering patterns
- API scaffolding (REST/GraphQL templates)
- Database integration patterns (entity persistence)
- Deploy automation (CI/CD templates)
- Testing framework integration

### Community/Ecosystem
- Example projects showcase
- Plugin system for entity extensions
- Theme customization guide
- Best practices repository

## Key Design Decisions
- Tech: pure HTML/CSS/JS, no frameworks; platform-first runtime
- Data: JSON (not markdown) for programmatic rendering/search/filter
- Automation: Makefile + simple shell scripts; cross-platform friendly
- Versioning: git tags + `HISTORY.md`
- Naming: clear, generic, reusable (no project-specific terms in `entity/`)
- Mode: `dev` first (separate files), production bundling later

## Acceptance Criteria (initial) ✅ ALL MET
- ✅ Opening doc-site `index.html` renders layout without errors
- ✅ Loading via `tyt.js` works: `define.js` → `router()` → `tyt.lib.index()`
- ✅ Sidebar toggle, navigation with search/filter functional
- ✅ Data JSON is fetchable (static), schema documented and validated
- ✅ All automation commands working (serve, validate, scaffold, version)
- ✅ Templates generate valid entity/project structures
- ✅ History logging tracks all platform actions
- ✅ Documentation complete and accessible via doc-site

## Project Structure (Current)
```
platform/                          # Root workspace (NOT backup-platform)
├── tyt.js                        # Core loader
├── Makefile                      # Automation commands
├── HISTORY.md                    # Version changelog
├── entity/                       # Shared entity system
│   ├── index.js                 # Entity entry point
│   ├── config/                  # Constants and config
│   │   ├── const.js
│   │   └── param.js
│   └── common/                  # Shared utilities
│       ├── log.js
│       ├── dataLoader.js
│       └── render.js
├── projects/                     # All projects
│   └── doc-site/                # Documentation site
│       ├── www/                 # Web root
│       │   ├── index.html
│       │   ├── index.css
│       │   └── define.js
│       └── data/                # Documentation data
│           ├── schema.json
│           └── docs/
│               ├── rules/       # Core rules
│               ├── guides/      # 6 guides
│               └── specs/       # Technical specs
├── scripts/                      # Automation scripts
│   ├── history_log.sh
│   ├── validate_docs.js
│   ├── new_doc.sh
│   ├── new_entity.sh
│   ├── new_project.sh
│   └── doc_version.sh
├── templates/                    # Scaffolding templates
│   ├── entity-template/
│   │   ├── README.md
│   │   └── module.js.template
│   └── project-template/
│       ├── README.md
│       ├── www/
│       ├── data/
│       └── deploy/
├── logs/                         # History logs
│   └── history.jsonl
└── tmp/                          # Temporary files
    └── plan-tyttootPlatformV2.prompt.md
```

## Risks & Mitigations ✅ ADDRESSED
- ✅ Edit permissions: small, incremental changes; all successful
- ✅ Scope creep: phases completed independently; shipped minimal skeleton
- ✅ Performance: dev mode working; production bundling deferred to v2.1.0
