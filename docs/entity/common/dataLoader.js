// Data loader utility (ES5) for TYT Platform
// Provides: tyt.lib.common.dataLoader.fetchJson(url, cb)

if (typeof tyt === 'undefined') { window.tyt = {}; }

(function(){
  tyt.lib = tyt.lib || {};
  tyt.lib.common = tyt.lib.common || {};

  function fetchJson(url, cb) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function(){
      if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            var data = JSON.parse(xhr.responseText);
            cb(null, data);
          } catch(err){
            cb(err);
          }
        } else {
          cb(new Error('HTTP '+xhr.status+' '+xhr.statusText));
        }
      }
    };
    xhr.onerror = function(){ cb(new Error('Network error')); };
    xhr.send();
  }

  tyt.lib.common.dataLoader = {
    fetchJson: fetchJson
  };
})();
