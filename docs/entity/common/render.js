// Common render helpers (ES5)
// Provides: render.heading, render.paragraph, render.list, render.docItems

if (typeof tyt === 'undefined') { window.tyt = {}; }

(function(){
  tyt.lib = tyt.lib || {};
  tyt.lib.common = tyt.lib.common || {};

  function escapeHtml(str) {
    if (str == null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Format text: detect code blocks, commands, and format them
  function formatText(text) {
    if (!text) return '';
    var str = String(text);
    
    // Convert markdown-style code blocks to HTML
    str = str.replace(/```([\s\S]*?)```/g, function(match, code) {
      return '<pre class="code-block"><code>' + escapeHtml(code.trim()) + '</code></pre>';
    });
    
    // Convert inline code (backticks)
    str = str.replace(/`([^`\n]+)`/g, function(match, code) {
      return '<code class="inline-code">' + escapeHtml(code) + '</code>';
    });
    
    // Convert make commands
    str = str.replace(/\b(make\s+[\w\-=:\s'"]+)/g, function(match) {
      return '<code class="command">' + escapeHtml(match) + '</code>';
    });
    
    // Convert file paths
    str = str.replace(/([a-zA-Z0-9_\-\.\/]+\.(js|json|html|css|md|php|sh|gradle|kts|properties))\b/g, function(match) {
      return '<code class="file-path">' + escapeHtml(match) + '</code>';
    });
    
    // Convert URLs
    str = str.replace(/(https?:\/\/[^\s]+)/g, function(match) {
      return '<a href="' + escapeHtml(match) + '" target="_blank" class="link">' + escapeHtml(match) + '</a>';
    });
    
    // Convert line breaks to <br>
    str = str.replace(/\n/g, '<br>');
    
    return str;
  }

  function heading(text) {
    return '<h1>' + escapeHtml(text) + '</h1>';
  }

  function paragraph(text, cls) {
    var klass = cls ? ' class="' + cls + '"' : '';
    return '<p' + klass + '>' + formatText(text) + '</p>';
  }

  function list(items, renderer) {
    var html = '<ol>';
    for (var i = 0; i < items.length; i++) {
      html += '<li>' + (renderer ? renderer(items[i], i) : escapeHtml(items[i])) + '</li>';
    }
    html += '</ol>';
    return html;
  }

  function docItems(items, idPrefix, level) {
    level = level || 0;
    var html = '<ol class="doc-items' + (level > 0 ? ' nested' : '') + '">';
    for (var i = 0; i < items.length; i++) {
      var it = items[i] || {};
      var label = it.id || ((idPrefix || 'I-') + (i+1));
      html += '<li class="doc-item">';
      html += '<div class="doc-item-header">';
      html += '<span class="doc-item-id">' + escapeHtml(label) + '</span>';
      html += '<span class="doc-item-title">' + escapeHtml(it.title || '') + '</span>';
      html += '</div>';
      
      // Render content if exists
      if (it.content) {
        html += '<div class="doc-item-content"><p>' + formatText(it.content) + '</p></div>';
      }
      
      // Render why/what/how with better structure
      var hasDetails = it.why || it.what || it.how;
      if (hasDetails) {
        html += '<div class="doc-item-details">';
        if (it.why) {
          html += '<div class="detail-section"><span class="detail-label">Why:</span><div class="detail-value"><p>' + formatText(it.why) + '</p></div></div>';
        }
        if (it.what) {
          html += '<div class="detail-section"><span class="detail-label">What:</span><div class="detail-value"><p>' + formatText(it.what) + '</p></div></div>';
        }
        if (it.how) {
          html += '<div class="detail-section"><span class="detail-label">How:</span><div class="detail-value"><p>' + formatText(it.how) + '</p></div></div>';
        }
        html += '</div>';
      }
      
      // Render nested items recursively
      if (it.items && it.items.length > 0) {
        html += docItems(it.items, label + '.', level + 1);
      }
      
      html += '</li>';
    }
    html += '</ol>';
    return html;
  }

  tyt.lib.common.render = {
    heading: heading,
    paragraph: paragraph,
    list: list,
    docItems: docItems,
    escapeHtml: escapeHtml
  };
})();
