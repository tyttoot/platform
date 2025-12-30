// Entity entry for TYT Platform v2 skeleton
// Loads shared libs and renders core rules to the doc-site page.

if (typeof tyt === 'undefined') { window.tyt = {}; }

(function(){
  // Ensure namespace
  tyt.lib = tyt.lib || {};

  // Queue dependencies (ES5 requires): dataLoader, log, render, task modules
  if (typeof tyt.require === 'function') {
    tyt.require('lib/common/log');
    tyt.require('lib/common/dataLoader');
    tyt.require('lib/common/render');
    tyt.require('lib/common/i18n');
    tyt.require('lib/task/taskLoader');
    tyt.require('lib/task/taskRender');
  }

  function renderDoc(targetEl, data) {
    if (!targetEl || !data) return;
    var r = (tyt.lib.common && tyt.lib.common.render) || {};
    var html = '';
    html += r.heading ? r.heading(data.title || 'Document') : '<h1>' + (data.title || 'Document') + '</h1>';
    if (data.content) {
      html += (r.paragraph ? r.paragraph(data.content, 'muted') : '<p class="muted">' + data.content + '</p>');
    }
    if (data.items && data.items.length) {
      html += r.docItems ? r.docItems(data.items, 'I-') : '';
    }
    targetEl.innerHTML = html;
    targetEl.setAttribute('data-state','doc-rendered');
  }

  function validateDoc(data) {
    if (!data) return 'Doc missing';
    if (!data.id) return 'Missing id';
    if (!data.category) return 'Missing category';
    if (!data.title) return 'Missing title';
    if (data.items && !Array.isArray(data.items)) return 'items must be an array';
    return '';
  }

  // Global escapeHtml function (used by both bindNav and generateNavigation)
  function escapeHtml(str) {
    var render = tyt.lib && tyt.lib.common && tyt.lib.common.render;
    if (render && render.escapeHtml) return render.escapeHtml(str);
    if (str == null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function bindNav(docsMap, defaultPage) {
    var links = document.querySelectorAll('nav a[data-page]');
    var content = document.getElementById('doc-render');
    var searchInput = document.getElementById('doc-search');
    if (!links || !content) return;
    var loader = tyt.lib && tyt.lib.common && tyt.lib.common.dataLoader;
    var log = tyt.lib && tyt.lib.common && tyt.lib.common.log;
    var render = tyt.lib && tyt.lib.common && tyt.lib.common.render;
    var state = { doc: null, query: '' };

    function copyDocWithItems(doc, items) {
      return {
        id: doc.id,
        category: doc.category,
        title: doc.title,
        content: doc.content,
        version: doc.version,
        tags: doc.tags,
        links: doc.links,
        items: items
      };
    }

    function itemMatches(it, q) {
      if (!it) return false;
      var needle = q.toLowerCase();
      for (var k in it) {
        if (!it.hasOwnProperty(k)) continue;
        var val = it[k];
        if (typeof val === 'string' && val.toLowerCase().indexOf(needle) !== -1) {
          return true;
        }
      }
      return false;
    }

    function renderFiltered() {
      if (!state.doc) return;
      var query = (state.query || '').trim();
      if (!query) {
        renderDoc(content, state.doc);
        return;
      }
      var items = state.doc.items || [];
      var filtered = [];
      for (var i = 0; i < items.length; i++) {
        if (itemMatches(items[i], query)) { filtered.push(items[i]); }
      }
      if (!filtered.length) {
        var html = '';
        if (render && render.heading) { html += render.heading(state.doc.title || 'Document'); }
        if (render && render.paragraph && state.doc.content) { html += render.paragraph(state.doc.content, 'muted'); }
        html += '<p class="muted">No items match "' + escapeHtml(query) + '".</p>';
        content.innerHTML = html;
        return;
      }
      renderDoc(content, copyDocWithItems(state.doc, filtered));
    }

    function loadTaskView(statusFilter) {
      var taskLoader = tyt.lib.task && tyt.lib.task.taskLoader;
      var taskRender = tyt.lib.task && tyt.lib.task.taskRender;
      
      if (!taskLoader || !taskRender) {
        content.innerHTML = '<p class="muted">Task modules not loaded</p>';
        return;
      }
      
      content.innerHTML = '<h1>Tasks</h1><p class="muted">Loading...</p>';
      
      taskLoader.getAllTasks(function(err, tasks){
        if (err) {
          content.innerHTML = '<h1>Tasks</h1><p class="muted">Error loading tasks: ' + escapeHtml(err.message) + '</p>';
          return;
        }
        
        var filtered = tasks;
        if (statusFilter && statusFilter !== 'all') {
          filtered = taskLoader.filterTasks(tasks, { status: statusFilter });
        }
        
        var sorted = taskLoader.sortTasks(filtered, 'priority');
        
        var html = '<h1>Tasks';
        if (statusFilter && statusFilter !== 'all') {
          html += ' - ' + escapeHtml(statusFilter);
        }
        html += '</h1>';
        html += '<p class="muted">Total: ' + sorted.length + ' task(s)</p>';
        html += taskRender.renderTaskList(sorted);
        
        content.innerHTML = html;
        
        // Add click handlers for task cards
        var cards = content.querySelectorAll('.task-card');
        for (var i = 0; i < cards.length; i++) {
          (function(card){
            card.addEventListener('click', function(){
              var taskId = card.getAttribute('data-task-id');
              if (taskId) loadTaskDetail(taskId);
            });
          })(cards[i]);
        }
        
        if (log) log('process', 'Loaded tasks view: ' + (statusFilter || 'all'));
      });
    }

    function loadTaskDetail(taskId) {
      var taskLoader = tyt.lib.task && tyt.lib.task.taskLoader;
      var taskRender = tyt.lib.task && tyt.lib.task.taskRender;
      
      if (!taskLoader || !taskRender) {
        content.innerHTML = '<p class="muted">Task modules not loaded</p>';
        return;
      }
      
      content.innerHTML = '<p class="muted">Loading task...</p>';
      
      taskLoader.loadTask(taskId, function(err, task){
        if (err) {
          content.innerHTML = '<p class="muted">Error loading task: ' + escapeHtml(err.message) + '</p>';
          return;
        }
        
        var html = taskRender.renderTaskDetail(task);
        content.innerHTML = html;
        
        if (log) log('process', 'Loaded task detail: ' + taskId);
      });
    }

    function loadPage(page) {
      var url = docsMap[page];
      if (!url) { content.innerHTML = '<p class="muted">No doc mapped for ' + escapeHtml(page) + '</p>'; return; }
      
      // Handle task views
      if (url.indexOf('tasks:') === 0) {
        loadTaskView(url.split(':')[1]);
        return;
      }
      
      if (!loader || typeof loader.fetchJson !== 'function') {
        content.innerHTML = '<p class="muted">dataLoader missing</p>';
        return;
      }
      loader.fetchJson(url, function(err, data){
        if (err) {
          // If we attempted to load a locale-specific doc, try falling back to canonical docs
          try {
            if (typeof url === 'string' && url.indexOf('/locales/') !== -1) {
              var fallbackUrl = url.replace(/\/locales\/[A-Za-z0-9\-]+\/docs\//, '/docs/');
              loader.fetchJson(fallbackUrl, function(err2, data2){
                if (!err2 && data2) {
                  var invalid2 = validateDoc(data2);
                  if (invalid2) {
                    content.innerHTML = '<p class="muted">Doc invalid: ' + escapeHtml(invalid2) + '</p>';
                    return;
                  }
                  state.doc = data2;
                  if (searchInput) { searchInput.value = ''; state.query = ''; }
                  renderFiltered();
                  if (log) log('process', 'Loaded doc (fallback): ' + page);
                  return;
                }
                content.innerHTML = '<p class="muted">Failed to load: ' + escapeHtml(err.message) + '</p>';
              });
              return;
            }
          } catch(e) {}
          content.innerHTML = '<p class="muted">Failed to load: ' + escapeHtml(err.message) + '</p>';
          return;
        }
        var invalid = validateDoc(data);
        if (invalid) {
          content.innerHTML = '<p class="muted">Doc invalid: ' + escapeHtml(invalid) + '</p>';
          return;
        }
        state.doc = data;
        if (searchInput) {
          searchInput.value = '';
          state.query = '';
        }
        renderFiltered();
        if (log) log('process', 'Loaded doc: ' + page);
      });
    }

    if (searchInput) {
      searchInput.addEventListener('input', function(e){
        state.query = e.target.value || '';
        renderFiltered();
      });
    }

    // Re-query links (important: nav may have been regenerated from manifest)
    links = document.querySelectorAll('nav a[data-page]');
    for (var i = 0; i < links.length; i++) {
      (function(a){
        a.addEventListener('click', function(e){ e.preventDefault(); loadPage(a.getAttribute('data-page')); });
      })(links[i]);
    }

    // load default page (first item in manifest)
    loadPage(defaultPage || 'rules');
  }

  // Main entry point after all required libs loaded
  tyt.lib.index = function(){
    if (tyt && typeof tyt.log === 'function') {
      tyt.log('process', '[entity] tyt.lib.index() running');
    }

    var base = tyt.libConfig && tyt.libConfig.projectPath ? tyt.libConfig.projectPath : './';
    var loader = tyt.lib && tyt.lib.common && tyt.lib.common.dataLoader;
    var i18n = tyt.lib && tyt.lib.common && tyt.lib.common.i18n;

    // Initialize i18n early (non-blocking). Module will use `base` when loading manifests/docs.
    if (i18n && typeof i18n.init === 'function') {
      try { i18n.init({ base: base }); } catch(e) { if (tyt && typeof tyt.log === 'function') tyt.log('error', 'i18n.init failed: '+e.message); }
    }
    
    // Generate pageKey from file path (e.g., "guides/my-guide.json" -> "guidesMyGuide")
    function fileToPageKey(filePath) {
      // Remove .json extension
      var name = filePath.replace(/\.json$/, '');
      // Split by / and -
      var parts = name.split(/[\/\-]/);
      // Convert to camelCase
      return parts.map(function(part, i) {
        if (i === 0) return part.toLowerCase();
        return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
      }).join('');
    }
    
    // Build docsMap and generate navigation from manifest
    function processManifest(manifest) {
      var docsMap = {};
      var docsBase = (i18n && typeof i18n.getDocsBase === 'function') ? i18n.getDocsBase(base) : base + '../data/docs/';
      var defaultPage = null;
      
      if (manifest && manifest.navigation) {
        manifest.navigation.forEach(function(section) {
          section.items.forEach(function(item, idx) {
            var pageKey;
            if (item.pageKey) {
              // Task items have explicit pageKey
              pageKey = item.pageKey;
              // Map task pageKeys
              if (pageKey === 'tasks') docsMap[pageKey] = 'tasks:all';
              else if (pageKey === 'tasksTodo') docsMap[pageKey] = 'tasks:TODO';
              else if (pageKey === 'tasksProgress') docsMap[pageKey] = 'tasks:IN_PROGRESS';
              else if (pageKey === 'tasksDone') docsMap[pageKey] = 'tasks:DONE';
            } else if (item.file) {
              // Doc items - generate pageKey from file
              pageKey = fileToPageKey(item.file);
              docsMap[pageKey] = docsBase + item.file;
            }
            // Store pageKey back on item for nav generation
            item._pageKey = pageKey;
            // First item is default
            if (!defaultPage && pageKey) defaultPage = pageKey;
          });
        });
      }
      
      return { docsMap: docsMap, defaultPage: defaultPage };
    }
    
    // Generate navigation HTML from manifest
    function generateNavigation(manifest) {
      var sidebar = document.getElementById('sidebar');
      if (!sidebar || !manifest || !manifest.navigation) return;
      
      var html = '';
      manifest.navigation.forEach(function(section) {
        html += '<div class="section">' + escapeHtml(section.section) + '</div>';
        html += '<ul>';
        section.items.forEach(function(item) {
          var pageKey = item._pageKey || item.pageKey || fileToPageKey(item.file);
          html += '<li><a href="#" data-page="' + escapeHtml(pageKey) + '">' + escapeHtml(item.title) + '</a></li>';
        });
        html += '</ul>';
      });
      
      sidebar.innerHTML = html;
      if (tyt && typeof tyt.log === 'function') {
        tyt.log('process', '[entity] Navigation generated from manifest');
      }
    }
    
    // Fallback hardcoded docsMap (kept for compatibility when manifest fails)
    var fallbackDocsMap = {
      rules: base + '../data/docs/rules/core-rules.json',
      guidesGettingStarted: base + '../data/docs/guides/getting-started.json',
      guidesAiCollaboration: base + '../data/docs/guides/ai-collaboration.json',
      guidesAiWorkflow: base + '../data/docs/guides/ai-workflow.json',
      guidesBuildAndDeploy: base + '../data/docs/guides/build-and-deploy.json',
      guidesCreateEntity: base + '../data/docs/guides/create-entity.json',
      guidesDeploymentQuickGuide: base + '../data/docs/guides/deployment-quick-guide.json',
      guidesHostingSetup: base + '../data/docs/guides/hosting-setup.json',
      guidesPlatformAutomation: base + '../data/docs/guides/platform-automation.json',
      guidesCreateProjectTemplate: base + '../data/docs/guides/create-project-template.json',
      guidesRollbackProcedure: base + '../data/docs/guides/rollback-procedure.json',
      guidesTaskManagement: base + '../data/docs/guides/task-management.json',
      guidesTesting: base + '../data/docs/guides/testing.json',
      specsMakefileReference: base + '../data/docs/specs/makefile-reference.json',
      specsReleaseManifestSchema: base + '../data/docs/specs/release-manifest-schema.json',
      specsTytArchitecture: base + '../data/docs/specs/tyt-architecture.json',
      tasks: 'tasks:all',
      tasksTodo: 'tasks:TODO',
      tasksProgress: 'tasks:IN_PROGRESS',
      tasksDone: 'tasks:DONE'
    };
    
    // Try loading manifest first, fallback to hardcoded if fail
    if (loader && typeof loader.fetchJson === 'function') {
      // Prefer per-locale manifest when i18n present
      if (i18n && typeof i18n.loadManifest === 'function') {
        i18n.loadManifest(base, function(err, manifest) {
          var docsMap, defaultPage;
          if (err || !manifest) {
            if (tyt && typeof tyt.log === 'function') {
              tyt.log('process', '[entity] docs-manifest.json not found (locale), using fallback docsMap');
            }
            docsMap = fallbackDocsMap;
            defaultPage = 'rules';
            bindNav(docsMap, defaultPage);
            return;
          }
          if (tyt && typeof tyt.log === 'function') {
            tyt.log('process', '[entity] Loaded locale docs-manifest successfully');
          }
          var result = processManifest(manifest);
          docsMap = result.docsMap;
          defaultPage = result.defaultPage;
          generateNavigation(manifest);
          bindNav(docsMap, defaultPage);
        });
      } else {
        loader.fetchJson(base + '../data/docs-manifest.json', function(err, manifest) {
          var docsMap, defaultPage;
          if (err || !manifest) {
            if (tyt && typeof tyt.log === 'function') {
              tyt.log('process', '[entity] docs-manifest.json not found, using fallback docsMap');
            }
            docsMap = fallbackDocsMap;
            defaultPage = 'rules';
          } else {
            if (tyt && typeof tyt.log === 'function') {
              tyt.log('process', '[entity] Loaded docs-manifest.json successfully');
            }
            // Process manifest to build docsMap
            var result = processManifest(manifest);
            docsMap = result.docsMap;
            defaultPage = result.defaultPage;
            // Generate navigation from manifest (auto-update sidebar)
            generateNavigation(manifest);
          }
          bindNav(docsMap, defaultPage);
        });
      }
    } else {
      // No loader available, use fallback
      bindNav(fallbackDocsMap, 'rules');
    }

    // Listen for locale changes and reload manifest/navigation accordingly
    if (typeof window !== 'undefined') {
      window.addEventListener('tyt:localeChanged', function(e){
        try {
          var newLocale = e && e.detail && e.detail.locale ? e.detail.locale : null;
          if (i18n && typeof i18n.loadManifest === 'function') {
            i18n.loadManifest(base, function(err, manifest){
              if (err || !manifest) return;
              var result = processManifest(manifest);
              var docsMap = result.docsMap;
              var defaultPage = result.defaultPage;
              generateNavigation(manifest);
              bindNav(docsMap, defaultPage);
            });
          }
        } catch(err) {}
      });
    }
  };
})();
