// entity/task/taskLoader.js
// Load and manage tasks from JSON files

if (typeof tyt === 'undefined') { window.tyt = {}; }

(function(){
  tyt.lib = tyt.lib || {};
  tyt.lib.task = tyt.lib.task || {};

  var loader = tyt.lib.common && tyt.lib.common.dataLoader;

  function loadTasks(status, callback) {
    if (!loader || typeof loader.fetchJson !== 'function') {
      callback(new Error('dataLoader missing'), null);
      return;
    }
    
    // Try build-output path first (production), then fallback to source
    var base = tyt.libConfig && tyt.libConfig.projectPath ? tyt.libConfig.projectPath : './';
    var buildOutputUrl = base + '../data/tasks/' + status + '/index.json';
    var sourceUrl = '../../../tasks/data/' + status + '/index.json';
    
    // Try build-output first
    loader.fetchJson(buildOutputUrl, function(err, data){
      if (!err && data) {
        callback(null, data.tasks || []);
        return;
      }
      
      // Fallback to source
      loader.fetchJson(sourceUrl, function(err2, data2){
        if (err2) {
          callback(null, []);
          return;
        }
        callback(null, data2.tasks || []);
      });
    });
  }

  function loadTask(id, callback) {
    if (!loader || typeof loader.fetchJson !== 'function') {
      callback(new Error('dataLoader missing'), null);
      return;
    }
    
    // Try to find task in all statuses
    var statuses = ['TODO', 'IN_PROGRESS', 'DONE', 'REOPEN'];
    var found = false;
    var attempts = 0;
    
    function tryNext() {
      if (attempts >= statuses.length) {
        callback(new Error('Task not found: ' + id), null);
        return;
      }
      
      var status = statuses[attempts];
      attempts++;
      
      // Try build-output path first, then fallback to source
      var base = tyt.libConfig && tyt.libConfig.projectPath ? tyt.libConfig.projectPath : './';
      var buildOutputUrl = base + '../data/tasks/' + status + '/' + id + '.json';
      var sourceUrl = '../../../tasks/data/' + status + '/' + id + '.json';
      
      loader.fetchJson(buildOutputUrl, function(err, data){
        if (!err && data) {
          found = true;
          callback(null, data);
          return;
        }
        
        // Fallback to source
        loader.fetchJson(sourceUrl, function(err2, data2){
          if (err2) {
            tryNext();
            return;
          }
          found = true;
          callback(null, data2);
        });
      });
    }
    
    tryNext();
  }

  function getAllTasks(callback) {
    var allTasks = [];
    var statuses = ['TODO', 'IN_PROGRESS', 'DONE', 'REOPEN'];
    var loaded = 0;
    
    statuses.forEach(function(status){
      loadTasks(status, function(err, tasks){
        if (!err && tasks) {
          tasks.forEach(function(t){ t.status = status; });
          allTasks = allTasks.concat(tasks);
        }
        loaded++;
        if (loaded === statuses.length) {
          callback(null, allTasks);
        }
      });
    });
  }

  function filterTasks(tasks, filters) {
    if (!filters) return tasks;
    
    return tasks.filter(function(task){
      if (filters.status && task.status !== filters.status) return false;
      if (filters.priority && task.priority !== filters.priority) return false;
      if (filters.assignee && task.assignee !== filters.assignee) return false;
      if (filters.tag && (!task.tags || task.tags.indexOf(filters.tag) === -1)) return false;
      if (filters.search) {
        var needle = filters.search.toLowerCase();
        var haystack = (task.title + ' ' + task.description + ' ' + task.id).toLowerCase();
        if (haystack.indexOf(needle) === -1) return false;
      }
      return true;
    });
  }

  function sortTasks(tasks, sortBy) {
    var sorted = tasks.slice();
    
    if (sortBy === 'priority') {
      var priorityOrder = {'Critical': 0, 'High': 1, 'Medium': 2, 'Low': 3};
      sorted.sort(function(a, b){
        return (priorityOrder[a.priority] || 99) - (priorityOrder[b.priority] || 99);
      });
    } else if (sortBy === 'created') {
      sorted.sort(function(a, b){
        return new Date(b.created) - new Date(a.created);
      });
    } else if (sortBy === 'updated') {
      sorted.sort(function(a, b){
        return new Date(b.updated || b.created) - new Date(a.updated || a.created);
      });
    }
    
    return sorted;
  }

  tyt.lib.task.taskLoader = {
    loadTasks: loadTasks,
    loadTask: loadTask,
    getAllTasks: getAllTasks,
    filterTasks: filterTasks,
    sortTasks: sortTasks
  };
})();
