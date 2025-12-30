#!/usr/bin/env node
// Validate tasks - ensure no duplicates across folders
// Usage: node scripts/validate_tasks.js

var fs = require('fs');
var path = require('path');

var taskFolders = [
  'tasks/data/TODO',
  'tasks/data/IN_PROGRESS',
  'tasks/data/DONE',
  'tasks/data/REOPEN'
];

var taskMap = {}; // taskId -> [folder paths]
var errors = [];

console.log('🔍 Validating tasks...\n');

taskFolders.forEach(function(folder) {
  var folderPath = path.join(__dirname, '..', folder);
  if (!fs.existsSync(folderPath)) {
    console.log('⚠️  Folder not found:', folder);
    return;
  }
  
  var files = fs.readdirSync(folderPath);
  files.forEach(function(file) {
    if (file === 'index.json' || !file.endsWith('.json')) return;
    
    var taskId = file.replace('.json', '');
    var fullPath = folder + '/' + file;
    
    if (!taskMap[taskId]) {
      taskMap[taskId] = [];
    }
    taskMap[taskId].push(fullPath);
  });
});

// Check for duplicates
Object.keys(taskMap).forEach(function(taskId) {
  var locations = taskMap[taskId];
  if (locations.length > 1) {
    errors.push({
      taskId: taskId,
      locations: locations,
      message: 'Task exists in multiple folders'
    });
  }
});

// Report results
if (errors.length === 0) {
  console.log('✅ No duplicates found!');
  console.log('📊 Total tasks:', Object.keys(taskMap).length);
  process.exit(0);
} else {
  console.log('❌ Found ' + errors.length + ' duplicate(s):\n');
  errors.forEach(function(err) {
    console.log('Task ID:', err.taskId);
    console.log('Found in:');
    err.locations.forEach(function(loc) {
      console.log('  - ' + loc);
    });
    console.log('');
  });
  
  console.log('💡 Fix: Move task to correct folder and delete duplicates');
  console.log('');
  process.exit(1);
}
