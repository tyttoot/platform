// entity/task/taskRender.js
// Render task UI components

if (typeof tyt === 'undefined') { window.tyt = {}; }

(function(){
  tyt.lib = tyt.lib || {};
  tyt.lib.task = tyt.lib.task || {};

  var render = tyt.lib.common && tyt.lib.common.render;

  function escape(str) {
    if (render && render.escapeHtml) return render.escapeHtml(str);
    if (str == null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function getPriorityClass(priority) {
    var map = {
      'Critical': 'priority-critical',
      'High': 'priority-high',
      'Medium': 'priority-medium',
      'Low': 'priority-low'
    };
    return map[priority] || 'priority-medium';
  }

  function getStatusClass(status) {
    var map = {
      'TODO': 'status-todo',
      'IN_PROGRESS': 'status-progress',
      'DONE': 'status-done',
      'REOPEN': 'status-reopen'
    };
    return map[status] || 'status-todo';
  }

  function renderTaskCard(task) {
    var html = '';
    var priorityClass = getPriorityClass(task.priority);
    var statusClass = getStatusClass(task.status);
    
    html += '<div class="task-card ' + statusClass + '" data-task-id="' + escape(task.id) + '">';
    html += '<div class="task-header">';
    html += '<span class="task-id">' + escape(task.id) + '</span>';
    html += '<span class="task-priority ' + priorityClass + '">' + escape(task.priority) + '</span>';
    html += '</div>';
    html += '<h3 class="task-title">' + escape(task.title) + '</h3>';
    
    if (task.description) {
      var desc = task.description.length > 100 
        ? task.description.substring(0, 100) + '...' 
        : task.description;
      html += '<p class="task-desc">' + escape(desc) + '</p>';
    }
    
    html += '<div class="task-meta">';
    html += '<span class="task-status">' + escape(task.status) + '</span>';
    if (task.assignee) {
      html += '<span class="task-assignee">👤 ' + escape(task.assignee) + '</span>';
    }
    html += '</div>';
    
    if (task.subtasks && task.subtasks.length > 0) {
      var completed = task.subtasks.filter(function(st){ return st.completed; }).length;
      html += '<div class="task-progress">';
      html += '<span>' + completed + '/' + task.subtasks.length + ' subtasks</span>';
      html += '<div class="progress-bar">';
      var percent = Math.round((completed / task.subtasks.length) * 100);
      html += '<div class="progress-fill" style="width:' + percent + '%"></div>';
      html += '</div>';
      html += '</div>';
    }
    
    if (task.tags && task.tags.length > 0) {
      html += '<div class="task-tags">';
      task.tags.forEach(function(tag){
        html += '<span class="tag">' + escape(tag) + '</span>';
      });
      html += '</div>';
    }
    
    html += '</div>';
    return html;
  }

  function renderTaskList(tasks) {
    var html = '';
    if (!tasks || tasks.length === 0) {
      html += '<p class="muted">No tasks found.</p>';
      return html;
    }
    
    html += '<div class="task-list">';
    tasks.forEach(function(task){
      html += renderTaskCard(task);
    });
    html += '</div>';
    
    return html;
  }

  function renderTaskDetail(task) {
    var html = '';
    var priorityClass = getPriorityClass(task.priority);
    var statusClass = getStatusClass(task.status);
    
    html += '<div class="task-detail ' + statusClass + '">';
    html += '<div class="task-detail-header">';
    html += '<div>';
    html += '<h2>' + escape(task.title) + '</h2>';
    html += '<p class="task-id">' + escape(task.id) + '</p>';
    html += '</div>';
    html += '<span class="task-priority ' + priorityClass + '">' + escape(task.priority) + '</span>';
    html += '</div>';
    
    if (task.description) {
      html += '<div class="task-section">';
      html += '<h3>Description</h3>';
      html += '<p>' + escape(task.description) + '</p>';
      html += '</div>';
    }
    
    html += '<div class="task-section">';
    html += '<h3>Status</h3>';
    html += '<span class="task-status-badge ' + statusClass + '">' + escape(task.status) + '</span>';
    html += '</div>';
    
    html += '<div class="task-meta-grid">';
    html += '<div><strong>Created:</strong> ' + escape(new Date(task.created).toLocaleDateString()) + '</div>';
    if (task.updated) {
      html += '<div><strong>Updated:</strong> ' + escape(new Date(task.updated).toLocaleDateString()) + '</div>';
    }
    if (task.assignee) {
      html += '<div><strong>Assignee:</strong> ' + escape(task.assignee) + '</div>';
    }
    html += '</div>';
    
    if (task.acceptanceCriteria && task.acceptanceCriteria.length > 0) {
      html += '<div class="task-section">';
      html += '<h3>Acceptance Criteria</h3>';
      html += '<ul class="checklist">';
      task.acceptanceCriteria.forEach(function(ac){
        var checked = ac.completed ? ' checked' : '';
        html += '<li><input type="checkbox"' + checked + ' disabled> ' + escape(ac.text) + '</li>';
      });
      html += '</ul>';
      html += '</div>';
    }
    
    if (task.subtasks && task.subtasks.length > 0) {
      html += '<div class="task-section">';
      html += '<h3>Subtasks</h3>';
      html += '<ul class="checklist">';
      task.subtasks.forEach(function(st){
        var checked = st.completed ? ' checked' : '';
        html += '<li><input type="checkbox"' + checked + ' disabled> ' + escape(st.text) + '</li>';
      });
      html += '</ul>';
      html += '</div>';
    }
    
    if (task.tags && task.tags.length > 0) {
      html += '<div class="task-section">';
      html += '<h3>Tags</h3>';
      html += '<div class="task-tags">';
      task.tags.forEach(function(tag){
        html += '<span class="tag">' + escape(tag) + '</span>';
      });
      html += '</div>';
      html += '</div>';
    }
    
    if (task.relatedFiles && task.relatedFiles.length > 0) {
      html += '<div class="task-section">';
      html += '<h3>Related Files</h3>';
      html += '<ul>';
      task.relatedFiles.forEach(function(file){
        html += '<li><code>' + escape(file) + '</code></li>';
      });
      html += '</ul>';
      html += '</div>';
    }
    
    if (task.notes) {
      html += '<div class="task-section">';
      html += '<h3>Notes</h3>';
      html += '<p>' + escape(task.notes) + '</p>';
      html += '</div>';
    }
    
    html += '</div>';
    return html;
  }

  tyt.lib.task.taskRender = {
    renderTaskCard: renderTaskCard,
    renderTaskList: renderTaskList,
    renderTaskDetail: renderTaskDetail
  };
})();
