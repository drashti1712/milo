#!/usr/bin/env node

/**
 * React to Milo Integration Workflow Script
 * This script helps automate the conversion of React components to Milo blocks
 */

const fs = require('fs');
const path = require('path');

class ReactToMiloConverter {
  constructor() {
    this.miloRoot = process.cwd();
    this.blocksDir = path.join(this.miloRoot, 'libs', 'blocks');
  }

  /**
   * Create a new Milo block from a React component template
   */
  createBlock(blockName, options = {}) {
    const blockDir = path.join(this.blocksDir, blockName);
    
    // Create block directory
    if (!fs.existsSync(blockDir)) {
      fs.mkdirSync(blockDir, { recursive: true });
    }

    // Create components subdirectory
    const componentsDir = path.join(blockDir, 'components');
    if (!fs.existsSync(componentsDir)) {
      fs.mkdirSync(componentsDir, { recursive: true });
    }

    // Create main block file
    const blockJs = this.generateBlockJs(blockName, options);
    fs.writeFileSync(path.join(blockDir, `${blockName}.js`), blockJs);

    // Create block CSS
    const blockCss = this.generateBlockCss(blockName, options);
    fs.writeFileSync(path.join(blockDir, `${blockName}.css`), blockCss);

    // Create README
    const readme = this.generateReadme(blockName, options);
    fs.writeFileSync(path.join(blockDir, 'README.md`), readme);

    console.log(`✅ Created Milo block: ${blockName}`);
    console.log(`📁 Location: ${blockDir}`);
    console.log(`🔧 Next steps:`);
    console.log(`   1. Add your React components to ${componentsDir}`);
    console.log(`   2. Convert JSX to HTM syntax`);
    console.log(`   3. Test with: npm run libs`);
    console.log(`   4. Create test content in Franklin`);
  }

  /**
   * Generate the main block JavaScript file
   */
  generateBlockJs(blockName, options) {
    const className = this.toCamelCase(blockName);
    
    return `import { html, useState, useEffect, render } from '../../deps/htm-preact.js';
import { loadStyle, getConfig } from '../../utils/utils.js';

// Import your converted React components here
// import MyComponent from './components/MyComponent.js';

const ${className}App = ({ config }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize your app data here
    // This could be API calls, local storage, etc.
    const initializeApp = async () => {
      try {
        // Example: await fetchData(config.apiUrl);
        setLoading(false);
      } catch (error) {
        console.error('Error initializing ${blockName}:', error);
        setLoading(false);
      }
    };

    initializeApp();
  }, [config]);

  if (loading) {
    return html\`
      <div class="${blockName}-loading">
        <div class="spinner"></div>
        <p>Loading...</p>
      </div>
    \`;
  }

  return html\`
    <div class="${blockName}-app">
      <div class="app-header">
        <h1>\${config.title || '${this.toTitleCase(blockName)}'}</h1>
        \${config.description && html\`<p>\${config.description}</p>\`}
      </div>
      
      <div class="app-content">
        <!-- Add your converted React components here -->
        <p>Your React components will be rendered here</p>
        
        <!-- Example component usage:
        <\${MyComponent} 
          data=\${data}
          onUpdate=\${(newData) => setData(newData)}
        />
        -->
      </div>
    </div>
  \`;
};

// Milo block decorator function
export default function decorate(block) {
  const { miloLibs, codeRoot } = getConfig();
  
  // Load block styles
  loadStyle(\`\${miloLibs || codeRoot}/blocks/${blockName}/${blockName}.css\`);
  
  // Parse configuration from the block content
  const rows = Array.from(block.children);
  const config = {};
  
  rows.forEach((row) => {
    const cols = Array.from(row.children);
    if (cols.length >= 2) {
      const key = cols[0].textContent.trim().toLowerCase();
      const value = cols[1].textContent.trim();
      config[key] = value;
    }
  });

  // Clear the block content and render our React-like component
  block.innerHTML = '';
  
  // Create a container for our app
  const container = document.createElement('div');
  container.className = '${blockName}-container';
  block.appendChild(container);
  
  // Render the React-like app using Preact
  render(html\`<\${${className}App} config=\${config} />\`, container);
}`;
  }

  /**
   * Generate the block CSS file
   */
  generateBlockCss(blockName, options) {
    return `/* ${this.toTitleCase(blockName)} Block Styles */
.${blockName}-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.${blockName}-app {
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.app-header {
  padding: 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
}

.app-header h1 {
  margin: 0 0 10px 0;
  font-size: 2rem;
  font-weight: 600;
}

.app-header p {
  margin: 0;
  opacity: 0.9;
  font-size: 1.1rem;
}

.app-content {
  padding: 30px;
  min-height: 300px;
}

/* Loading States */
.${blockName}-loading {
  text-align: center;
  padding: 60px 20px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e9ecef;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive Design */
@media (max-width: 768px) {
  .${blockName}-container {
    padding: 10px;
  }
  
  .app-header {
    padding: 20px;
  }
  
  .app-header h1 {
    font-size: 1.5rem;
  }
  
  .app-content {
    padding: 20px;
  }
}`;
  }

  /**
   * Generate README for the block
   */
  generateReadme(blockName, options) {
    return `# ${this.toTitleCase(blockName)} Block

This block integrates React components converted to Milo's HTM syntax.

## Usage

Add this block to your Franklin content:

\`\`\`
| ${blockName} |
|${'-'.repeat(blockName.length + 2)}|
| title | My App Title |
| description | App description |
| apiUrl | /api/endpoint |
\`\`\`

## Development

1. **Add React Components**: Place your converted components in \`./components/\`
2. **Convert JSX to HTM**: Use the conversion patterns from the integration guide
3. **Test Locally**: Run \`npm run libs\` and test at \`http://localhost:6456\`

## Component Conversion

### Before (React):
\`\`\`jsx
import React, { useState } from 'react';

const MyComponent = ({ title }) => {
  const [count, setCount] = useState(0);
  return (
    <div className="my-component">
      <h2>{title}</h2>
      <button onClick={() => setCount(count + 1)}>
        Count: {count}
      </button>
    </div>
  );
};
\`\`\`

### After (HTM):
\`\`\`javascript
import { html, useState } from '../../../deps/htm-preact.js';

const MyComponent = ({ title }) => {
  const [count, setCount] = useState(0);
  return html\`
    <div class="my-component">
      <h2>\${title}</h2>
      <button onClick=\${() => setCount(count + 1)}>
        Count: \${count}
      </button>
    </div>
  \`;
};

export default MyComponent;
\`\`\`

## Configuration

The block accepts configuration through Franklin content:

- **title**: App title
- **description**: App description  
- **apiUrl**: API endpoint for data fetching

## Styling

Styles are defined in \`./${blockName}.css\` and loaded automatically.

## Testing

Test your block with Franklin content and the local Milo development server.
`;
  }

  /**
   * Utility functions
   */
  toCamelCase(str) {
    return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
  }

  toTitleCase(str) {
    return str.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  }

  /**
   * Convert React JSX syntax to HTM syntax
   */
  convertJsxToHtm(jsxContent) {
    // Basic conversions (this is a simplified version)
    let htmContent = jsxContent;
    
    // Convert className to class
    htmContent = htmContent.replace(/className=/g, 'class=');
    
    // Convert JSX expressions to template literal expressions
    htmContent = htmContent.replace(/{([^}]+)}/g, '${$1}');
    
    // Convert JSX tags to html template literals (simplified)
    // This would need more sophisticated parsing for real use
    
    return htmContent;
  }

  /**
   * Analyze React component and suggest conversion steps
   */
  analyzeComponent(filePath) {
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      return;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const suggestions = [];

    // Check for React imports
    if (content.includes('from \'react\'') || content.includes('from "react"')) {
      suggestions.push('✏️  Replace React imports with htm-preact imports');
    }

    // Check for className usage
    if (content.includes('className')) {
      suggestions.push('✏️  Replace className with class');
    }

    // Check for JSX syntax
    if (content.includes('<') && content.includes('>')) {
      suggestions.push('✏️  Convert JSX to html`` template literals');
    }

    // Check for CSS imports
    if (content.includes('.css\'') || content.includes('.css"')) {
      suggestions.push('✏️  Replace CSS imports with loadStyle() calls');
    }

    console.log(`\n📊 Analysis for ${filePath}:`);
    if (suggestions.length > 0) {
      suggestions.forEach(suggestion => console.log(suggestion));
    } else {
      console.log('✅ No obvious conversion issues found');
    }

    return suggestions;
  }
}

// CLI Interface
const converter = new ReactToMiloConverter();

const command = process.argv[2];
const args = process.argv.slice(3);

switch (command) {
  case 'create':
    if (!args[0]) {
      console.error('❌ Please provide a block name');
      console.log('Usage: node react-integration-workflow.js create <block-name>');
      process.exit(1);
    }
    converter.createBlock(args[0]);
    break;

  case 'analyze':
    if (!args[0]) {
      console.error('❌ Please provide a file path');
      console.log('Usage: node react-integration-workflow.js analyze <file-path>');
      process.exit(1);
    }
    converter.analyzeComponent(args[0]);
    break;

  default:
    console.log(`
🚀 React to Milo Integration Workflow

Commands:
  create <block-name>    Create a new Milo block template
  analyze <file-path>    Analyze a React component for conversion

Examples:
  node react-integration-workflow.js create my-react-app
  node react-integration-workflow.js analyze ./src/components/MyComponent.jsx

For more information, see the integration-guide.md file.
    `);
}

module.exports = ReactToMiloConverter;