// Common log helper to centralize logging behavior
// Provides: tyt.lib.common.log(level, message)

if (typeof tyt === 'undefined') { window.tyt = {}; }

(function(){
  tyt.lib = tyt.lib || {};
  tyt.lib.common = tyt.lib.common || {};

  function log(level, message){
    if (!tyt || !tyt.srcConfig || !tyt.srcConfig.using) return;
    var keys = tyt.srcConfig.using.logKeys;
    if (tyt.srcConfig.mode === 'dev' && keys && keys.indexOf(level) !== -1) {
      if (typeof console !== 'undefined' && console.log) {
        console.log('Log-' + level + ': ' + message);
      }
    }
  }

  tyt.lib.common.log = log;
})();
