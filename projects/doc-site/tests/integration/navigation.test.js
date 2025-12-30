// projects/doc-site/tests/integration/navigation.test.js
// Integration tests for navigation and doc loading
var S = {
  S["tests.integration_navigation_test_js.1"]: "tests.integration_navigation_test_js.1",
  S["tests.integration_navigation_test_js.2"]: "tests.integration_navigation_test_js.2",
  S["tests.integration_navigation_test_js.3"]: "tests.integration_navigation_test_js.3",
  S["tests.integration_navigation_test_js.4"]: "tests.integration_navigation_test_js.4",
  S["tests.integration_navigation_test_js.5"]: "tests.integration_navigation_test_js.5",
  S["tests.integration_navigation_test_js.6"]: "tests.integration_navigation_test_js.6",
  S["tests.integration_navigation_test_js.7"]: "tests.integration_navigation_test_js.7",
  S["tests.integration_navigation_test_js.8"]: "tests.integration_navigation_test_js.8",
  S["tests.integration_navigation_test_js.9"]: "tests.integration_navigation_test_js.9",
  S["tests.integration_navigation_test_js.10"]: "tests.integration_navigation_test_js.10",
  S["tests.integration_navigation_test_js.11"]: "tests.integration_navigation_test_js.11",
  S["tests.integration_navigation_test_js.12"]: "tests.integration_navigation_test_js.12",
  S["tests.integration_navigation_test_js.13"]: "tests.integration_navigation_test_js.13",
  S["tests.integration_navigation_test_js.14"]: "tests.integration_navigation_test_js.14",
  S["tests.integration_navigation_test_js.15"]: "tests.integration_navigation_test_js.15"
};// test i18n mapping



tyt.describe(S["tests.integration_navigation_test_js.1"], function(){
  var loader;
  
  tyt.beforeAll(function(){
    loader = tyt.lib.common.dataLoader;
  });
  
  tyt.it(S["tests.integration_navigation_test_js.2"], function(done){
    loader.fetchJson(S["tests.integration_navigation_test_js.3"], function(err, data){
      tyt.assert.ok(!err);
      tyt.assert.equal(data.category, S["tests.integration_navigation_test_js.4"]);
      tyt.assert.isArray(data.items);
      tyt.assert.ok(data.items.length > 0);
      done();
    });
  });
  
  tyt.it(S["tests.integration_navigation_test_js.5"], function(done){
    loader.fetchJson(S["tests.integration_navigation_test_js.6"], function(err, data){
      tyt.assert.ok(!err);
      tyt.assert.equal(data.category, S["tests.integration_navigation_test_js.7"]);
      tyt.assert.ok(data.title.indexOf(S["tests.integration_navigation_test_js.8"]) !== -1);
      done();
    });
  });
  
  tyt.it(S["tests.integration_navigation_test_js.9"], function(done){
    loader.fetchJson(S["tests.integration_navigation_test_js.10"], function(err, data){
      tyt.assert.ok(!err);
      tyt.assert.equal(data.category, S["tests.integration_navigation_test_js.11"]);
      done();
    });
  });
  
  tyt.it(S["tests.integration_navigation_test_js.12"], function(done){
    loader.fetchJson(S["tests.integration_navigation_test_js.3"], function(err, data){
      tyt.assert.ok(!err);
      tyt.assert.hasProperty(data, 'id');
      tyt.assert.hasProperty(data, S["tests.integration_navigation_test_js.13"]);
      tyt.assert.hasProperty(data, S["tests.integration_navigation_test_js.14"]);
      tyt.assert.hasProperty(data, S["tests.integration_navigation_test_js.15"]);
      tyt.assert.isArray(data.items);
      done();
    });
  });
});
