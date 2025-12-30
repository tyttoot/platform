// Generate GitHub Wiki pages from doc-site JSON files
// Usage: node scripts/generate_wiki.js

var fs = require('fs');
var path = require('path');

var config = {
  docSiteDataPath: path.join(__dirname, '../projects/doc-site/data'),
  wikiOutputPath: path.join(__dirname, '../wiki'),
  manifestFile: 'docs-manifest.json'
};

function readJSON(filePath) {
  try {
    var content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (e) {
    console.error('Error reading ' + filePath + ':', e.message);
    return null;
  }
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function jsonToMarkdown(doc) {
  var md = [];
  
  // Header
  md.push('# ' + doc.title);
  md.push('');
  
  // Metadata
  if (doc.version) md.push('**Version:** ' + doc.version);
  if (doc.category) md.push('**Category:** ' + doc.category);
  if (doc.tags && doc.tags.length > 0) {
    md.push('**Tags:** ' + doc.tags.map(function(t) { return '`' + t + '`'; }).join(', '));
  }
  md.push('');
  
  // Content
  if (doc.content) {
    md.push(doc.content);
    md.push('');
  }
  
  // Items
  if (doc.items && doc.items.length > 0) {
    md.push('---');
    md.push('');
    doc.items.forEach(function(item, idx) {
      md.push('## ' + (idx + 1) + '. ' + item.title);
      md.push('');
      
      if (item.why) {
        md.push('**Why:** ' + item.why);
        md.push('');
      }
      
      if (item.what) {
        md.push('**What:** ' + item.what);
        md.push('');
      }
      
      if (item.how) {
        md.push('**How:**');
        md.push('');
        md.push('```');
        md.push(item.how);
        md.push('```');
        md.push('');
      }
      
      if (item.description) {
        md.push(item.description);
        md.push('');
      }
      
      if (item.command) {
        md.push('**Command:**');
        md.push('```bash');
        md.push(item.command);
        md.push('```');
        md.push('');
      }
      
      if (item.example) {
        md.push('**Example:**');
        md.push('```');
        md.push(item.example);
        md.push('```');
        md.push('');
      }
    });
  }
  
  // Links
  if (doc.links && doc.links.length > 0) {
    md.push('---');
    md.push('');
    md.push('## Related Links');
    md.push('');
    doc.links.forEach(function(link) {
      md.push('- [' + link.text + '](' + link.url + ')');
    });
    md.push('');
  }
  
  return md.join('\n');
}

function slugToWikiFilename(filePath) {
  // Convert "guides/getting-started.json" to "Getting-Started.md"
  var basename = path.basename(filePath, '.json');
  var parts = basename.split('-');
  var title = parts.map(function(p) {
    return p.charAt(0).toUpperCase() + p.slice(1);
  }).join('-');
  return title + '.md';
}

function generateSidebarEntry(section, items) {
  var lines = [];
  lines.push('### ' + section);
  items.forEach(function(item) {
    if (item.file) {
      var wikiFilename = slugToWikiFilename(item.file);
      var linkName = wikiFilename.replace('.md', '');
      lines.push('- [' + item.title + '](' + linkName + ')');
    }
  });
  return lines.join('\n');
}

function generateHomePage(manifest) {
  var md = [];
  
  md.push('# TYT Platform v2 - Documentation Wiki');
  md.push('');
  md.push('Welcome to the TYT Platform documentation! This wiki is auto-generated from the doc-site.');
  md.push('');
  md.push('**Version:** ' + manifest.version);
  md.push('**Last Updated:** ' + manifest.lastUpdated);
  md.push('');
  md.push('---');
  md.push('');
  md.push('## 📚 Documentation Sections');
  md.push('');
  
  manifest.navigation.forEach(function(nav) {
    if (nav.items && nav.items.length > 0 && nav.items[0].file) {
      md.push('### ' + nav.section);
      md.push('');
      nav.items.forEach(function(item) {
        if (item.file) {
          var wikiFilename = slugToWikiFilename(item.file);
          var linkName = wikiFilename.replace('.md', '');
          md.push('- [' + item.title + '](' + linkName + ')');
        }
      });
      md.push('');
    }
  });
  
  md.push('---');
  md.push('');
  md.push('## 🚀 Quick Start');
  md.push('');
  md.push('1. [Getting Started](Getting-Started)');
  md.push('2. [Core Rules](Core-Rules)');
  md.push('3. [AI Collaboration](Ai-Collaboration)');
  md.push('');
  md.push('---');
  md.push('');
  md.push('## 🔗 Links');
  md.push('');
  md.push('- [GitHub Repository](https://github.com/tyttoot/platform)');
  md.push('- [Doc Site (Live)](http://localhost:8080/projects/doc-site/www/index.html)');
  md.push('');
  
  return md.join('\n');
}

function generateSidebar(manifest) {
  var md = [];
  
  md.push('### Navigation');
  md.push('- [Home](Home)');
  md.push('');
  
  manifest.navigation.forEach(function(nav) {
    if (nav.items && nav.items.length > 0 && nav.items[0].file) {
      md.push('### ' + nav.section);
      nav.items.forEach(function(item) {
        if (item.file) {
          var wikiFilename = slugToWikiFilename(item.file);
          var linkName = wikiFilename.replace('.md', '');
          md.push('- [' + item.title + '](' + linkName + ')');
        }
      });
      md.push('');
    }
  });
  
  return md.join('\n');
}

function main() {
  console.log('🚀 Generating GitHub Wiki from doc-site...\n');
  
  // Ensure output directory
  ensureDir(config.wikiOutputPath);
  
  // Read manifest
  var manifestPath = path.join(config.docSiteDataPath, config.manifestFile);
  var manifest = readJSON(manifestPath);
  if (!manifest) {
    console.error('❌ Failed to read manifest');
    process.exit(1);
  }
  
  console.log('📋 Manifest version: ' + manifest.version);
  
  // Generate Home page
  var homeMd = generateHomePage(manifest);
  var homeFile = path.join(config.wikiOutputPath, 'Home.md');
  fs.writeFileSync(homeFile, homeMd, 'utf8');
  console.log('✅ Generated: Home.md');
  
  // Generate _Sidebar
  var sidebarMd = generateSidebar(manifest);
  var sidebarFile = path.join(config.wikiOutputPath, '_Sidebar.md');
  fs.writeFileSync(sidebarFile, sidebarMd, 'utf8');
  console.log('✅ Generated: _Sidebar.md');
  
  // Process each document
  var count = 0;
  manifest.navigation.forEach(function(nav) {
    if (!nav.items) return;
    
    nav.items.forEach(function(item) {
      if (!item.file) return;
      
      var docPath = path.join(config.docSiteDataPath, 'docs', item.file);
      var doc = readJSON(docPath);
      
      if (!doc) return;
      
      var markdown = jsonToMarkdown(doc);
      var wikiFilename = slugToWikiFilename(item.file);
      var outputPath = path.join(config.wikiOutputPath, wikiFilename);
      
      fs.writeFileSync(outputPath, markdown, 'utf8');
      console.log('✅ Generated: ' + wikiFilename);
      count++;
    });
  });
  
  console.log('\n🎉 Done! Generated ' + count + ' wiki pages');
  console.log('\n📁 Output directory: ' + config.wikiOutputPath);
  console.log('\n📝 Next steps:');
  console.log('1. Enable Wiki in GitHub repo settings');
  console.log('2. git clone https://github.com/tyttoot/platform.wiki.git');
  console.log('3. cp wiki/* platform.wiki/');
  console.log('4. cd platform.wiki && git add . && git commit -m "Add documentation"');
  console.log('5. git push');
}

main();
