// projects/doc-site/tests/unit/dataLoader.test.js
// Unit tests for dataLoader module
var S = {
  S["tests.unit_dataLoader_test_js.1"]: "tests.unit_dataLoader_test_js.1",
  S["tests.unit_dataLoader_test_js.2"]: "tests.unit_dataLoader_test_js.2",
  S["tests.unit_dataLoader_test_js.3"]: "tests.unit_dataLoader_test_js.3",
  S["tests.unit_dataLoader_test_js.4"]: "tests.unit_dataLoader_test_js.4",
  S["tests.unit_dataLoader_test_js.5"]: "tests.unit_dataLoader_test_js.5",
  S["tests.unit_dataLoader_test_js.6"]: "tests.unit_dataLoader_test_js.6",
  S["tests.unit_dataLoader_test_js.7"]: "tests.unit_dataLoader_test_js.7"
};// test i18n mapping



tyt.describe(S["tests.unit_dataLoader_test_js.1"], function(){
  var loader;
  
  tyt.beforeAll(function(){
    loader = tyt.lib.common.dataLoader;
  });
  
  tyt.it(S["tests.unit_dataLoader_test_js.2"], function(){
    tyt.assert.ok(loader);
    tyt.assert.isFunction(loader.fetchJson);
  });
  
  tyt.it(S["tests.unit_dataLoader_test_js.3"], function(done){
    loader.fetchJson(S["tests.unit_dataLoader_test_js.4"], function(err, data){
      tyt.assert.ok(!err);
      tyt.assert.ok(data);
      tyt.assert.hasProperty(data, 'id');
      tyt.assert.hasProperty(data, S["tests.unit_dataLoader_test_js.5"]);
      done();
    });
  });
  
  tyt.it(S["tests.unit_dataLoader_test_js.6"], function(done){
    loader.fetchJson(S["tests.unit_dataLoader_test_js.7"], function(err, data){
      tyt.assert.ok(err);
      tyt.assert.ok(!data);
      done();
    });
  });
});
