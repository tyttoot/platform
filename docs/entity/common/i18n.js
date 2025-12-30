// Simple i18n module for TYT Platform (ES5)
// Exposes: tyt.lib.common.i18n with init, getLocale, setLocale, availableLocales,
// loadManifest(base, cb), fetchDocForLocale(base, docPath, cb), getDocsBase(base), applyLocale

if (typeof tyt === 'undefined') { window.tyt = {}; }
(function(){
  tyt.lib = tyt.lib || {};
  tyt.lib.common = tyt.lib.common || {};

  var STORAGE_KEY = 'docsite.locale';
  var state = {
    defaultLocale: 'en',
    locale: null,
    supported: [
      { id: 'en', name: 'English' },
      { id: 'vi', name: 'Tiếng Việt' },
      { id: 'zh-TW', name: '中文（台灣）' }
    ],
    base: './',
    cache: {}
  };

  function normalizeLocale(l) {
    if (!l) return null;
    return String(l).trim();
  }

  function matchLocale(requested) {
    if (!requested) return state.defaultLocale;
    var r = requested;
    // Exact match
    for (var i=0;i<state.supported.length;i++) if (state.supported[i].id === r) return r;
    // Language-only match (e.g., en-US -> en)
    var prefix = r.split('-')[0];
    for (var j=0;j<state.supported.length;j++) if (state.supported[j].id === prefix) return state.supported[j].id;
    return state.defaultLocale;
  }

  function init(opts, cb) {
    opts = opts || {};
    if (opts.defaultLocale) state.defaultLocale = opts.defaultLocale;
    if (opts.supportedLocales && Array.isArray(opts.supportedLocales)) {
      state.supported = opts.supportedLocales.map(function(id){ return { id: id, name: id }; });
    }
    if (opts.base) state.base = opts.base;

    // Determine initial locale: localStorage -> navigator -> default
    try {
      var stored = null;
      if (typeof window !== 'undefined' && window.localStorage) stored = window.localStorage.getItem(STORAGE_KEY);
      var nav = (typeof navigator !== 'undefined' && navigator.language) ? navigator.language : null;
      var chosen = stored || nav || state.defaultLocale;
      state.locale = matchLocale(normalizeLocale(chosen));
    } catch(e) {
      state.locale = state.defaultLocale;
    }

    applyLocale(state.locale);

    if (typeof cb === 'function') cb(null, state.locale);
  }

  function getLocale() { return state.locale || state.defaultLocale; }

  function setLocale(localeId, opts, cb) {
    if (typeof opts === 'function') { cb = opts; opts = {}; }
    opts = opts || {};
    var resolved = matchLocale(normalizeLocale(localeId));
    state.locale = resolved;
    try { if (typeof window !== 'undefined' && window.localStorage) window.localStorage.setItem(STORAGE_KEY, resolved); } catch(e){}
    applyLocale(resolved);
    if (typeof cb === 'function') cb(null, resolved);
  }

  function availableLocales() { return state.supported.slice(0); }

  function getDocsBase(base) {
    base = base || state.base || './';
    // ensure trailing /
    if (base.slice(-1) !== '/') base = base + '/';
    return base + '../data/locales/' + getLocale() + '/docs/';
  }

  function loadManifest(base, cb) {
    cb = cb || function(){};
    var loader = tyt.lib && tyt.lib.common && tyt.lib.common.dataLoader;
    if (!loader || typeof loader.fetchJson !== 'function') { 
      return cb(new Error('dataLoader missing')); 
    }
    var locale = getLocale();
    var localePath = (base || state.base) + '../data/locales/' + locale + '/docs-manifest.json';
    loader.fetchJson(localePath, function(err, manifest){
      if (!err && manifest) return cb(null, manifest);
      // fallback to default manifest
      var fallbackPath = (base || state.base) + '../data/docs-manifest.json';
      loader.fetchJson(fallbackPath, function(err2, manifest2){
        if (err2) return cb(err2);
        return cb(null, manifest2);
      });
    });
  }

  function fetchDocForLocale(base, docPath, cb) {
    cb = cb || function(){};
    var loader = tyt.lib && tyt.lib.common && tyt.lib.common.dataLoader;
    if (!loader || typeof loader.fetchJson !== 'function') return cb(new Error('dataLoader missing'));
    var locale = getLocale();
    var localeUrl = (base || state.base) + '../data/locales/' + locale + '/docs/' + docPath;
    loader.fetchJson(localeUrl, function(err, data){
      if (!err && data) return cb(null, data);
      // fallback to canonical docs
      var defaultUrl = (base || state.base) + '../data/docs/' + docPath;
      loader.fetchJson(defaultUrl, function(err2, data2){
        if (err2) return cb(err2);
        return cb(null, data2);
      });
    });
  }

  function loadPageContent(localeId, cb) {
    cb = cb || function(){};
    var loader = tyt.lib && tyt.lib.common && tyt.lib.common.dataLoader;
    if (!loader || typeof loader.fetchJson !== 'function') return cb(new Error('dataLoader missing'));
    var localeUrl = state.base + '../data/locales/' + localeId + '/page-content.json';
    loader.fetchJson(localeUrl, function(err, data) {
      if (err) return cb(err);
      state.cache[localeId] = data;
      cb(null, data);
    });
  }

  function updatePageContent(localeId) {
    const contentElements = document.querySelectorAll('[data-i18n-key]');
    contentElements.forEach(function(el) {
      const key = el.getAttribute('data-i18n-key');
      const translations = state.cache[localeId] || {};
      el.textContent = translations[key] || key;
    });
  }

  function applyLocale(localeId) {
    try {
      if (typeof document !== 'undefined' && document.documentElement) {
        document.documentElement.lang = localeId || getLocale();
      }
      loadPageContent(localeId || getLocale(), function(err, translations) {
        if (err) return console.error('Failed to load page content:', err);
        const contentElements = document.querySelectorAll('[data-i18n-key]');
        contentElements.forEach(function(el) {
          const key = el.getAttribute('data-i18n-key');
          el.textContent = translations[key] || key;
        });
      });
      // Dispatch an event so the application can react (e.g., regenerate nav)
      if (typeof window !== 'undefined' && typeof window.CustomEvent === 'function') {
        var ev = new CustomEvent('tyt:localeChanged', { detail: { locale: localeId || getLocale() } });
        window.dispatchEvent(ev);
      }
    } catch(e) {}
  }

  tyt.lib.common.i18n = {
    init: init,
    getLocale: getLocale,
    setLocale: setLocale,
    availableLocales: availableLocales,
    loadManifest: loadManifest,
    fetchDocForLocale: fetchDocForLocale,
    getDocsBase: getDocsBase,
    applyLocale: applyLocale
  };

})();
