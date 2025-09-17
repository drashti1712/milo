// Minimal test version to debug the file upload issue
import { html, useState, render } from '../../../libs/deps/htm-preact.js';
import { createTag, getConfig } from '../../../libs/utils/utils.js';

const { miloLibs, codeRoot } = getConfig();
const base = miloLibs || codeRoot;

const ARTIFY_LOGO = `${base}/blocks/artify/img/logo.png`;
const BANNER_IMAGE = `${base}/blocks/artify/img/banner.png`;

// Simple Landing Page
function SimpleLandingPage({ setFile }) {
  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile && uploadedFile.type.startsWith('image/')) {
      console.log('✅ File selected successfully:', uploadedFile.name);
      setFile(uploadedFile);
    } else {
      console.log('❌ Invalid file or no file selected');
    }
  };

  return html`
    <div style="padding: 20px; background: #f0f0f0; border-radius: 8px;">
      <h2>🎨 Simple Artify Test</h2>
      <p>Upload an image to test the state transition:</p>
      <input
        type="file"
        accept="image/*"
        onChange=${handleFileChange}
        style="margin: 10px 0;"
      />
      <p style="font-size: 12px; color: #666;">Debug: Landing page is rendered</p>
    </div>
  `;
}

// Simple Editor
function SimpleEditor({ file, onBack }) {
  console.log('✅ SimpleEditor component rendered with file:', file.name);
  
  return html`
    <div style="padding: 20px; background: #e0ffe0; border-radius: 8px;">
      <h2>🖼️ Simple Editor</h2>
      <p>File loaded: <strong>${file.name}</strong></p>
      <p>Size: ${(file.size / 1024).toFixed(1)} KB</p>
      <p>Type: ${file.type}</p>
      <button onClick=${onBack} style="padding: 8px 16px; margin: 10px 0;">
        ← Back to Upload
      </button>
      <div style="margin-top: 20px; border: 2px solid #4CAF50; padding: 10px;">
        <p style="margin: 0; color: #2E7D32; font-weight: bold;">
          ✅ SUCCESS: Editor is visible! The file upload transition works.
        </p>
      </div>
    </div>
  `;
}

// Simple App
function SimpleArtifyApp() {
  const [file, setFile] = useState(null);

  console.log('🔄 SimpleArtifyApp render - file state:', file ? file.name : 'null');

  return html`
    <div style="font-family: arial; max-width: 600px; margin: 20px auto;">
      <h1 style="color: #D459E1;">🧪 Minimal Artify Test</h1>
      
      ${file ? html`
        <div style="background: #fff3cd; padding: 10px; border-radius: 4px; margin-bottom: 20px;">
          <strong>State:</strong> File uploaded - showing editor
        </div>
        <${SimpleEditor} file=${file} onBack=${() => setFile(null)} />
      ` : html`
        <div style="background: #d1ecf1; padding: 10px; border-radius: 4px; margin-bottom: 20px;">
          <strong>State:</strong> No file - showing landing page
        </div>
        <${SimpleLandingPage} setFile=${setFile} />
      `}
    </div>
  `;
}

// Initialize function
export default function initMinimal(el) {
  console.log('🚀 Initializing minimal Artify test');
  
  el.innerHTML = '';
  el.classList.add('artify-minimal-test');
  
  const container = createTag('div', { class: 'minimal-container' });
  el.appendChild(container);
  
  render(html`<${SimpleArtifyApp} />`, container);
}

