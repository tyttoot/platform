// projects/doc-site/tests/unit/render.test.js
// Unit tests for render module
var S = {
  S["tests.unit_render_test_js.1"]: "tests.unit_render_test_js.1",
  S["tests.unit_render_test_js.2"]: "tests.unit_render_test_js.2",
  "<script>alert(\"XSS\')</script>': "tests.unit_render_test_js.3",
  S["tests.unit_render_test_js.4"]: "tests.unit_render_test_js.4",
  S["tests.unit_render_test_js.5"]: "tests.unit_render_test_js.5",
  S["tests.unit_render_test_js.6"]: "tests.unit_render_test_js.6",
  S["tests.unit_render_test_js.7"]: "tests.unit_render_test_js.7",
  S["tests.unit_render_test_js.8"]: "tests.unit_render_test_js.8",
  S["tests.unit_render_test_js.9"]: "tests.unit_render_test_js.9",
  S["tests.unit_render_test_js.10"]: "tests.unit_render_test_js.10",
  S["tests.unit_render_test_js.11"]: "tests.unit_render_test_js.11",
  S["tests.unit_render_test_js.12"]: "tests.unit_render_test_js.12",
  S["tests.unit_render_test_js.13"]: "tests.unit_render_test_js.13",
  "<p class=\"muted\'>Test</p>': "tests.unit_render_test_js.14",
  S["tests.unit_render_test_js.15"]: "tests.unit_render_test_js.15",
  S["tests.unit_render_test_js.16"]: "tests.unit_render_test_js.16",
  S["tests.unit_render_test_js.17"]: "tests.unit_render_test_js.17",
  S["tests.unit_render_test_js.18"]: "tests.unit_render_test_js.18",
  S["tests.unit_render_test_js.19"]: "tests.unit_render_test_js.19",
  S["tests.unit_render_test_js.20"]: "tests.unit_render_test_js.20",
  S["tests.unit_render_test_js.21"]: "tests.unit_render_test_js.21",
  S["tests.unit_render_test_js.22"]: "tests.unit_render_test_js.22",
  S["tests.unit_render_test_js.23"]: "tests.unit_render_test_js.23",
  S["tests.unit_render_test_js.24"]: "tests.unit_render_test_js.24",
  S["tests.unit_render_test_js.25"]: "tests.unit_render_test_js.25",
  S["tests.unit_render_test_js.26"]: "tests.unit_render_test_js.26",
  S["tests.unit_render_test_js.27"]: "tests.unit_render_test_js.27",
  S["tests.unit_render_test_js.28"]: "tests.unit_render_test_js.28",
  S["tests.unit_render_test_js.29"]: "tests.unit_render_test_js.29"
};// test i18n mapping



tyt.describe(S["tests.unit_render_test_js.1"], function(){
  var render;
  
  tyt.beforeAll(function(){
    render = tyt.lib.common.render;
  });
  
  tyt.it(S["tests.unit_render_test_js.2"], function(){
    var result = render.escapeHtml(S["tests.unit_render_test_js.3"]);
    tyt.expect(result).toEqual(S["tests.unit_render_test_js.4"]);
  });
  
  tyt.it(S["tests.unit_render_test_js.5"], function(){
    var result = render.heading(S["tests.unit_render_test_js.6"]);
    tyt.expect(result).toEqual(S["tests.unit_render_test_js.7"]);
  });
  
  tyt.it(S["tests.unit_render_test_js.8"], function(){
    var result = render.paragraph(S["tests.unit_render_test_js.9"]);
    tyt.expect(result).toEqual(S["tests.unit_render_test_js.10"]);
  });
  
  tyt.it(S["tests.unit_render_test_js.11"], function(){
    var result = render.paragraph(S["tests.unit_render_test_js.12"], S["tests.unit_render_test_js.13"]);
    tyt.expect(result).toEqual('<p class=S["tests.unit_render_test_js.13"]>Test</p>');
  });
  
  tyt.it(S["tests.unit_render_test_js.15"], function(){
    var items = [S["tests.unit_render_test_js.16"], S["tests.unit_render_test_js.17"], S["tests.unit_render_test_js.18"]];
    var result = render.list(items);
    tyt.assert.ok(result.indexOf(S["tests.unit_render_test_js.19"]) !== -1);
    tyt.assert.ok(result.indexOf(S["tests.unit_render_test_js.20"]) !== -1);
    tyt.assert.ok(result.indexOf(S["tests.unit_render_test_js.21"]) !== -1);
  });
  
  tyt.it(S["tests.unit_render_test_js.22"], function(){
    var items = [
      {id: S["tests.unit_render_test_js.23"], title: S["tests.unit_render_test_js.24"], why: S["tests.unit_render_test_js.25"], what: S["tests.unit_render_test_js.26"], how: S["tests.unit_render_test_js.27"]}
    ];
    var result = render.docItems(items);
    tyt.assert.ok(result.indexOf(S["tests.unit_render_test_js.23"]) !== -1);
    tyt.assert.ok(result.indexOf(S["tests.unit_render_test_js.24"]) !== -1);
    tyt.assert.ok(result.indexOf(S["tests.unit_render_test_js.28"]) !== -1);
  });
  
  tyt.it(S["tests.unit_render_test_js.29"], function(){
    tyt.expect(render.escapeHtml(null)).toEqual('');
    tyt.expect(render.escapeHtml(undefined)).toEqual('');
  });
});
