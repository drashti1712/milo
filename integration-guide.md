# React App Integration with Milo using Cursor

## Overview
This guide explains how to integrate your React application components into the Adobe Milo framework using Cursor IDE.

## Current Milo Architecture

Your Milo codebase uses:
- **Preact/HTM** for React-like components
- **Block-based architecture** for modular components
- **Franklin/AEM** as the content management system
- **Component-based rendering** with `htm-preact.js`

## Integration Options

### Option 1: Convert React Components to Milo Blocks (Recommended)

Convert your React components to use Milo's Preact/HTM syntax and integrate as blocks.

#### Steps:

1. **Create a new block directory**:
   ```bash
   mkdir -p /workspace/libs/blocks/your-react-app
   ```

2. **Convert React JSX to HTM syntax**:
   ```javascript
   // Original React component
   import React, { useState } from 'react';
   
   const MyComponent = ({ title, data }) => {
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
   
   // Converted to Milo HTM syntax
   import { html, useState } from '../../deps/htm-preact.js';
   
   const MyComponent = ({ title, data }) => {
     const [count, setCount] = useState(0);
     return html`
       <div class="my-component">
         <h2>${title}</h2>
         <button onClick=${() => setCount(count + 1)}>
           Count: ${count}
         </button>
       </div>
     `;
   };
   ```

3. **Create the block structure**:
   ```
   libs/blocks/your-react-app/
   ├── your-react-app.js      # Main block logic
   ├── your-react-app.css     # Block styles
   └── components/            # Sub-components
       ├── ComponentA.js
       └── ComponentB.js
   ```

### Option 2: Micro-frontend Integration

Keep your React app separate and integrate it as a micro-frontend.

#### Steps:

1. **Build your React app** for production
2. **Create a Milo block** that loads your React bundle
3. **Use iframe or dynamic imports** to load your app

### Option 3: Hybrid Approach

Use both approaches - convert core components to Milo blocks and keep complex features as micro-frontends.

## Implementation with Cursor

### 1. Set up Development Environment

1. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **Start Milo development server**:
   ```bash
   npm run libs
   ```
   This runs Milo at `http://localhost:6456`

### 2. Create Your First Converted Block

1. **Create block directory**:
   ```bash
   mkdir -p libs/blocks/react-integration-example
   cd libs/blocks/react-integration-example
   ```

2. **Create the main block file** (`react-integration-example.js`):
   ```javascript
   import { html, useState, useEffect } from '../../deps/htm-preact.js';
   import { loadStyle } from '../../utils/utils.js';
   
   // Import your converted components
   import MyReactComponent from './components/MyReactComponent.js';
   
   export default function decorate(block) {
     // Load block styles
     loadStyle('/libs/blocks/react-integration-example/react-integration-example.css');
     
     // Get data from the block (from Franklin/AEM)
     const rows = Array.from(block.children);
     const config = {};
     
     rows.forEach((row) => {
       const cols = Array.from(row.children);
       if (cols.length >= 2) {
         config[cols[0].textContent.trim()] = cols[1].textContent.trim();
       }
     });
     
     // Create the React-like component
     const ReactApp = () => {
       const [data, setData] = useState(null);
       
       useEffect(() => {
         // Fetch any additional data needed
         // setData(fetchedData);
       }, []);
       
       return html`
         <div class="react-integration-wrapper">
           <${MyReactComponent} 
             title=${config.title}
             data=${data}
           />
         </div>
       `;
     };
     
     // Render the component
     block.innerHTML = '';
     block.appendChild(html`<${ReactApp} />`);
   }
   ```

3. **Create component styles** (`react-integration-example.css`):
   ```css
   .react-integration-wrapper {
     padding: 20px;
     border-radius: 8px;
     background: #f5f5f5;
   }
   
   .my-component {
     max-width: 600px;
     margin: 0 auto;
   }
   
   .my-component button {
     background: #007bff;
     color: white;
     border: none;
     padding: 10px 20px;
     border-radius: 4px;
     cursor: pointer;
   }
   
   .my-component button:hover {
     background: #0056b3;
   }
   ```

### 3. Convert React Components

Use Cursor to help convert your React components:

1. **Open your React component** in Cursor
2. **Use Cursor's AI** to help convert JSX to HTM:
   
   **Prompt for Cursor**: 
   ```
   Convert this React component to use Preact HTM syntax. Replace:
   - React imports with htm-preact imports
   - JSX with html`` template literals
   - className with class
   - Keep all React hooks (useState, useEffect, etc.)
   ```

3. **Example conversion**:
   ```javascript
   // Before (React)
   import React, { useState, useEffect } from 'react';
   import './MyComponent.css';
   
   const MyComponent = ({ title, items = [] }) => {
     const [selectedItem, setSelectedItem] = useState(null);
     
     useEffect(() => {
       if (items.length > 0) {
         setSelectedItem(items[0]);
       }
     }, [items]);
     
     return (
       <div className="my-component">
         <h2 className="title">{title}</h2>
         <ul className="items-list">
           {items.map((item, index) => (
             <li 
               key={item.id} 
               className={`item ${selectedItem?.id === item.id ? 'selected' : ''}`}
               onClick={() => setSelectedItem(item)}
             >
               {item.name}
             </li>
           ))}
         </ul>
         {selectedItem && (
           <div className="selected-details">
             <h3>{selectedItem.name}</h3>
             <p>{selectedItem.description}</p>
           </div>
         )}
       </div>
     );
   };
   
   // After (Milo HTM)
   import { html, useState, useEffect } from '../../../deps/htm-preact.js';
   import { loadStyle } from '../../../utils/utils.js';
   
   const MyComponent = ({ title, items = [] }) => {
     const [selectedItem, setSelectedItem] = useState(null);
     
     useEffect(() => {
       if (items.length > 0) {
         setSelectedItem(items[0]);
       }
     }, [items]);
     
     // Load component styles
     loadStyle('/libs/blocks/react-integration-example/components/MyComponent.css');
     
     return html`
       <div class="my-component">
         <h2 class="title">${title}</h2>
         <ul class="items-list">
           ${items.map((item, index) => html`
             <li 
               key=${item.id}
               class=${`item ${selectedItem?.id === item.id ? 'selected' : ''}`}
               onClick=${() => setSelectedItem(item)}
             >
               ${item.name}
             </li>
           `)}
         </ul>
         ${selectedItem && html`
           <div class="selected-details">
             <h3>${selectedItem.name}</h3>
             <p>${selectedItem.description}</p>
           </div>
         `}
       </div>
     `;
   };
   
   export default MyComponent;
   ```

### 4. Testing Your Integration

1. **Create a test page** in Franklin/AEM with your block:
   ```
   | react-integration-example |
   |---------------------------|
   | title | My React App      |
   | apiUrl | /api/data        |
   ```

2. **Test locally**:
   ```bash
   # Start Milo development server
   npm run libs
   
   # Visit your test page with local Milo
   http://localhost:3000/your-test-page?milolibs=local
   ```

### 5. Advanced Integration Patterns

#### State Management
```javascript
// Using Preact signals for global state (similar to Redux)
import { signal } from '../../deps/htm-preact.js';

const globalState = signal({
  user: null,
  theme: 'light',
  data: []
});

// In your components
const MyComponent = () => {
  const state = globalState.value;
  
  const updateTheme = (newTheme) => {
    globalState.value = { ...state, theme: newTheme };
  };
  
  return html`
    <div class="theme-${state.theme}">
      <button onClick=${() => updateTheme('dark')}>
        Switch to Dark Theme
      </button>
    </div>
  `;
};
```

#### API Integration
```javascript
import { html, useState, useEffect } from '../../deps/htm-preact.js';

const DataComponent = ({ apiUrl }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [apiUrl]);
  
  if (loading) return html`<div>Loading...</div>`;
  if (error) return html`<div>Error: ${error}</div>`;
  
  return html`
    <div class="data-component">
      ${data.map(item => html`
        <div key=${item.id} class="data-item">
          <h3>${item.title}</h3>
          <p>${item.description}</p>
        </div>
      `)}
    </div>
  `;
};
```

## Best Practices

1. **Use Cursor AI effectively**:
   - Ask Cursor to convert JSX to HTM
   - Use Cursor for refactoring and code generation
   - Leverage Cursor's understanding of both React and Preact

2. **Follow Milo conventions**:
   - Use the block structure (`libs/blocks/block-name/`)
   - Load styles with `loadStyle()`
   - Use Milo's utility functions from `utils/utils.js`

3. **Performance considerations**:
   - Use dynamic imports for large components
   - Implement lazy loading for non-critical components
   - Optimize bundle size with tree shaking

4. **Styling**:
   - Use CSS modules or scoped styles
   - Follow Milo's CSS naming conventions
   - Ensure responsive design compatibility

## Troubleshooting

### Common Issues:

1. **HTM syntax errors**:
   - Remember to use `class` instead of `className`
   - Use `${expression}` for dynamic values
   - Wrap components in `html`` template literals

2. **Import path issues**:
   - Use relative paths to Milo dependencies
   - Check that `htm-preact.js` is accessible

3. **Styling not loading**:
   - Ensure CSS files are in the correct location
   - Use `loadStyle()` to load component styles

### Debugging with Cursor:

1. **Use Cursor's debugging features**:
   - Set breakpoints in your HTM components
   - Use console.log for debugging state changes
   - Leverage Cursor's error highlighting

2. **Test incrementally**:
   - Convert one component at a time
   - Test each component individually
   - Use Milo's development server for live reloading

## Next Steps

1. **Start with a simple component** to test the integration
2. **Gradually convert more complex components**
3. **Set up automated testing** for your converted components
4. **Consider performance optimization** for production deployment
5. **Document your integration patterns** for team collaboration

This approach allows you to leverage your existing React knowledge while integrating seamlessly with Milo's architecture and Franklin's content management capabilities.