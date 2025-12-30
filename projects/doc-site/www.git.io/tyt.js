// TYTTOOT Platform - Minimal Core Loader (v2 skeleton)
// - define: extend namespaces
// - require: queue files to load (lib/ or src/)
// - exec: load JS files (browser/Node)
// - router: reset state, load lib/index, then run tyt.lib.index()
// - main: init config, load project define.js, route to default page

const tyt = {
  lib: {},
  libConfig: {},
  src: {},
  srcConfig: {},
  global: {},
  entity: {},

  exec: async function(filePaths, version, callback){
    if (!filePaths) { if (callback) callback(true); return true; }
    if (Array.isArray(filePaths)) {
      if (!filePaths.length) { if (callback) callback(true); return true; }
      if (callback) {
        tyt.exec(filePaths.shift(), version, function(ok){
          if (ok) tyt.exec(filePaths, version, callback); else callback(false);
        });
      } else {
        let ok = await tyt.exec(filePaths.shift(), version);
        return ok ? tyt.exec(filePaths, version) : ok;
      }
      return;
    }
    var filePath = filePaths;
    if (typeof require === 'undefined') {
      // Browser
      return new Promise(function(resolve,reject){
        var js = document.createElement('script');
        js.type = 'text/javascript';
        js.src = filePath + '.js' + (version ? ('?v'+version) : '');
        document.body.appendChild(js);
        js.onload = function(){ if (callback) callback(true); resolve(true); };
        js.onerror = function(){ tyt.log('error', 'Error loading file: '+filePath); if (callback) callback(false); reject(false); };
      });
    } else {
      // Node
      delete require.cache[require.resolve(filePath)];
      require(filePath);
      if (callback) callback(true);
      return true;
    }
  },

  define: function(root, key, value){
    if (!root) return;
    if (key) {
      if (root.hasOwnProperty(key)) { if (value) Object.assign(root[key], value); }
      else if (value) { root[key] = value; }
      else { root[key] = {}; }
    } else if (value) {
      Object.assign(root, value);
    }
  },

  require: function(fileUrl){
    if (!fileUrl) return;
    var fromLib = fileUrl.substring(0,4) === 'lib/';
    var key = (fromLib ? tyt.libConfig.libDirectory : tyt.libConfig.srcDirectory) + fileUrl.substring(4);
    if (!tyt.global.cache) tyt.global.cache = {};
    if (!tyt.global.cache.requireFileUrls) { tyt.global.cache.requireFileUrls = {}; tyt.global.cache.requireFiles = []; }
    if (!tyt.global.cache.requireFileUrls.hasOwnProperty(key)) { tyt.global.cache.requireFileUrls[key] = 1; tyt.global.cache.requireFiles.push(key); }
  },

  router: async function(pageType){
    if (tyt.libConfig.pageType === pageType) return;
    tyt.lib = {}; tyt.src = {}; tyt.global.cache = {};
    tyt.libConfig.pageType = pageType;
    if (tyt.srcConfig.mode === 'pro') {
      await tyt.exec('./src/'+pageType+'/index', tyt.srcConfig.cacheVersion);
    } else {
      var srcDirectory = tyt.libConfig.projectPath + 'src/' + pageType + '/';
      if (tyt.srcConfig.mode === 'pro-debug') {
        tyt.libConfig.libDirectory = srcDirectory + 'entity/';
        tyt.libConfig.srcDirectory = srcDirectory + 'src/';
      } else {
        tyt.libConfig.libDirectory = tyt.libConfig.rootPath + 'entity/';
        tyt.libConfig.srcDirectory = srcDirectory;
      }
      tyt.require('lib/index');
      while (tyt.global.cache.requireFiles && tyt.global.cache.requireFiles.length) {
        await tyt.exec(tyt.global.cache.requireFiles, tyt.srcConfig.cacheVersion);
      }
      tyt.global.cache.requireFileUrls = {};
    }
    tyt.log('process', '************************');
    tyt.log('process', "Load page '"+pageType+"' completed!");
    tyt.log('process', '************************');
    tyt.global.cache = {};
    if (typeof tyt.lib.index === 'function') await tyt.lib.index();
  },

  log: function(logKey, message, isPretty){
    if (
      tyt.srcConfig && tyt.srcConfig.using && tyt.srcConfig.mode === 'dev' &&
      Array.isArray(tyt.srcConfig.using.logKeys) && tyt.srcConfig.using.logKeys.indexOf(logKey) !== -1
    ){
      if (isPretty) { console.log('Log-'+logKey+':'); console.log(message, null, 4); }
      else { console.log('Log-'+logKey+': '+message); }
    }
  },

  main: async function(){
    try { console.clear(); } catch(e){}
    if (typeof process !== 'undefined' && process.argv) {
      tyt.libConfig.params = process.argv.slice(2).reduce(function(p,arg){ var kv = arg.split('='); p[kv[0]] = kv[1] || true; return p; }, {});
      tyt.libConfig.minFile = (tyt.libConfig.params.minFile === 'true');
      if (tyt.libConfig.params.pp) { tyt.libConfig.projectPath = tyt.libConfig.params.pp + '/'; tyt.libConfig.rootPath = './'; }
      else { tyt.log('error', "Missing parameter 'pp'!"); return; }
    } else {
      tyt.libConfig.isClient = true;
      tyt.libConfig.projectPath = './';
      tyt.libConfig.rootPath = './../../../';
    }
    if (await tyt.exec(tyt.libConfig.projectPath + 'define', Math.floor(Math.random()*10000))) {
      if (typeof require === 'undefined') {
        var link = document.createElement('link');
        link.setAttribute('rel','stylesheet');
        link.setAttribute('type','text/css');
        link.setAttribute('href', tyt.libConfig.projectPath + 'index.css' + (tyt.srcConfig.cacheVersion ? ('?'+tyt.srcConfig.cacheVersion) : ''));
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      await tyt.router(tyt.srcConfig.currentPage);
    } else {
      tyt.log('error', 'Define file is required!');
    }
  }
};

// Launch
try { tyt.main(); } catch(e) { /* no-op */ }
