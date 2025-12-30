# entity/task/

Task management entity modules for TYT Platform v2.

## Modules

- [taskLoader.js](taskLoader.js) - Load and filter tasks from JSON storage
- [taskRender.js](taskRender.js) - Render task UI components (cards, lists, details)

## Usage

```javascript
// Require in entity/index.js
tyt.require('lib/task/taskLoader');
tyt.require('lib/task/taskRender');

// Load all tasks
tyt.lib.task.taskLoader.getAllTasks(function(err, tasks){
  if (err) return console.error(err);
  
  // Filter and sort
  var filtered = tyt.lib.task.taskLoader.filterTasks(tasks, {
    status: 'IN_PROGRESS',
    priority: 'High'
  });
  
  var sorted = tyt.lib.task.taskLoader.sortTasks(filtered, 'priority');
  
  // Render
  var html = tyt.lib.task.taskRender.renderTaskList(sorted);
  document.getElementById('tasks').innerHTML = html;
});

// Load specific task
tyt.lib.task.taskLoader.loadTask('001-task-management-system', function(err, task){
  if (err) return console.error(err);
  
  var html = tyt.lib.task.taskRender.renderTaskDetail(task);
  document.getElementById('task-detail').innerHTML = html;
});
```

## Features

- JSON-based task loading
- Status filtering (TODO, IN_PROGRESS, DONE, REOPEN)
- Priority sorting (Critical, High, Medium, Low)
- Search across title/description/ID
- Tag filtering
- Card/List/Detail views
- Progress visualization for subtasks
