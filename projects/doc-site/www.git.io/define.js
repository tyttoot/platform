// Project configuration for TYT Doc Site
// Defines runtime settings consumed by tyt.js

if (typeof tyt === 'undefined') { window.tyt = {}; }

(function(){
  // Merge into tyt.srcConfig; tyt.define will also run in main, but this
  // ensures values exist if someone opens this file standalone.
  tyt.srcConfig = tyt.srcConfig || {};
  tyt.srcConfig.projectName = 'docSite';
  tyt.srcConfig.cacheVersion = '1';
  tyt.srcConfig.mode = 'dev'; // dev | pro-debug | pro
  tyt.srcConfig.currentPage = 'main';
  tyt.srcConfig.using = { logKeys: ['process','error','infos'] };
  // i18n configuration
  tyt.srcConfig.defaultLocale = 'en';
  tyt.srcConfig.supportedLocales = ['en','vi','zh-TW'];
})();
