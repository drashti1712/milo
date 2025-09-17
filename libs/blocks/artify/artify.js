import { html, useState, useEffect, render } from '../../deps/htm-preact.js';
import { createTag, getConfig } from '../../utils/utils.js';

const { miloLibs, codeRoot } = getConfig();
const base = miloLibs || codeRoot;

// Artify assets - using actual assets from React project but keeping working functionality
const ARTIFY_LOGO = `${base}/blocks/artify/img/logo.png`;
const BANNER_IMAGE = `${base}/blocks/artify/img/banner.png`;

// Effect images from actual React project
const EFFECT_IMAGES = [
  { img: `${base}/blocks/artify/img/effect1.png`, title: 'Effect 1', key: 'customEffect1' },
  { img: `${base}/blocks/artify/img/effect2.png`, title: 'Effect 2', key: 'customEffect2' },
  { img: `${base}/blocks/artify/img/effect3.png`, title: 'Effect 3', key: 'customEffect3' },
  { img: `${base}/blocks/artify/img/effect4.png`, title: 'Effect 4', key: 'customEffect4' },
  { img: `${base}/blocks/artify/img/effect5.png`, title: 'Effect 5', key: 'customEffect5' },
  { img: `${base}/blocks/artify/img/effect6.png`, title: 'Effect 6', key: 'customEffect6' },
];

/**
 * Landing Page Component - Simplified but working version with real assets
 */
function LandingPage({ setFile }) {
  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile && uploadedFile.type.startsWith('image/')) {
      console.log('File selected:', uploadedFile.name, uploadedFile);
      setFile(uploadedFile);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer?.files;
    if (files && files[0] && files[0].type.startsWith('image/')) {
      setFile(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleButtonClick = () => {
    document.getElementById('file-input')?.click();
  };

  return html`
    <div class="artify-landing">
      <div class="main-wrapper">
        <img src=${BANNER_IMAGE} class="banner-img" alt="Artify banner" />
      </div>
      <div class="info">
        <h2>Add magic and transform your images in one go</h2>
        <div 
          class="upload-container"
          onDrop=${handleDrop}
          onDragOver=${handleDragOver}
        >
          <div>
            <input
              type="file"
              accept="image/*"
              onChange=${handleFileChange}
              style="display: none;"
              id="file-input"
            />
            <button 
              class="upload-btn" 
              onClick=${handleButtonClick}
            >
              Choose a photo
            </button>
            <div class="upload-info">or Drag and Drop images</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Header Controls Component
 */
function HeaderControls({ onUndo, onRedo, onDownload, onShare, canUndo, canRedo }) {
  return html`
    <div class="header-controls">
      <button 
        class="undo-redo-btn" 
        onClick=${onUndo} 
        disabled=${!canUndo}
        title="Undo"
      >
        ↶ Undo
      </button>
      <button 
        class="undo-redo-btn" 
        onClick=${onRedo} 
        disabled=${!canRedo}
        title="Redo"
      >
        ↷ Redo
      </button>
      <div class="header-actions">
        <button class="download-btn" onClick=${onDownload}>
          ⬇ Download
        </button>
        <button class="share-btn" onClick=${onShare}>
          ✈ Share
        </button>
      </div>
    </div>
  `;
}

/**
 * Reference Effects Component - Using actual effect images
 */
function ReferenceEffects({ onEffectClick, isProcessing }) {
  return html`
    <div class="reference-effects">
      <h3>🎨 Predefined Effects</h3>
      <div class="reference-gallery">
        ${EFFECT_IMAGES.map((effect, index) => html`
          <button
            key=${index}
            class="effect-item"
            onClick=${() => onEffectClick(effect.key)}
            disabled=${isProcessing}
          >
            <img src=${effect.img} alt=${effect.title} />
          </button>
        `)}
      </div>
    </div>
  `;
}

/**
 * Prompt Input Component
 */
function PromptInput({ prompt, onPromptChange, onSubmit, isProcessing }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (prompt.trim() && !isProcessing) {
      onSubmit(prompt.trim());
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return html`
    <div class="prompt-input">
      <h3>💬 Ask Artify</h3>
      <form onSubmit=${handleSubmit} class="prompt-form">
        <input
          type="text"
          value=${prompt}
          onInput=${(e) => onPromptChange(e.target.value)}
          onKeyPress=${handleKeyPress}
          placeholder="Type your command (e.g., 'make it brighter', 'add vintage filter')"
          disabled=${isProcessing}
        />
        <button
          type="submit"
          class="prompt-submit"
          disabled=${!prompt.trim() || isProcessing}
        >
          ${isProcessing ? '⏳' : '➤'} ${isProcessing ? 'Processing...' : 'Submit'}
        </button>
      </form>
    </div>
  `;
}

/**
 * Editor Component - Simplified working version
 */
function Editor({ file, onBack }) {
  console.log('Editor component rendering with file:', file ? file.name : 'null');
  
  const [fileUrl, setFileUrl] = useState('');
  const [originalFileUrl, setOriginalFileUrl] = useState('');
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Initialize file when component mounts
  useEffect(() => {
    if (file) {
      console.log('Editor useEffect - creating URL for file:', file.name);
      const url = URL.createObjectURL(file);
      setFileUrl(url);
      setOriginalFileUrl(url);

      // Initialize history
      setHistory([{ description: 'Original image', url }]);
      setHistoryIndex(0);

      return () => URL.revokeObjectURL(url);
    }
    return undefined;
  }, [file]);

  // Handle prompt submission (simulated AI processing)
  const handlePromptSubmit = async (promptText) => {
    setIsProcessing(true);
    setPrompt('');

    // Simulate AI processing delay
    setTimeout(() => {
      const newEntry = {
        description: `Applied: "${promptText}"`,
        url: fileUrl, // In real implementation, this would be the processed image
      };

      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newEntry);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
      setIsProcessing(false);
    }, 2000);
  };

  // Handle effect application
  const handleEffectClick = async (effectKey) => {
    setIsProcessing(true);

    // Simulate effect processing
    setTimeout(() => {
      const newEntry = {
        description: `Applied effect: ${effectKey}`,
        url: fileUrl, // In real implementation, this would be the effect-processed image
      };

      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newEntry);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
      setIsProcessing(false);
    }, 1500);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setFileUrl(history[historyIndex - 1].url);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setFileUrl(history[historyIndex + 1].url);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.download = `artify-edited-${file.name}`;
    link.href = fileUrl;
    link.click();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Artify Creation',
        text: 'Check out my edited image!',
        url: window.location.href,
      });
    } else {
      navigator.clipboard?.writeText(window.location.href);
    }
  };

  const currentImageUrl = showOriginal ? originalFileUrl : fileUrl;
  const imageStyle = {
    filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`,
  };

  return html`
    <div class="artify-editor">
      <button class="back-button" onClick=${onBack}>← Back to Upload</button>
      
      <${HeaderControls}
        onUndo=${handleUndo}
        onRedo=${handleRedo}
        onDownload=${handleDownload}
        onShare=${handleShare}
        canUndo=${historyIndex > 0}
        canRedo=${historyIndex < history.length - 1}
      />

      <div class="editor-content">
        <${ReferenceEffects} 
          onEffectClick=${handleEffectClick}
          isProcessing=${isProcessing}
        />

        <div class="main-editor">
          <div class="image-display">
            <div class="image-container">
              <img
                src=${currentImageUrl}
                alt="Editing image"
                style=${imageStyle}
                class=${isProcessing ? 'processing' : ''}
              />
              ${isProcessing && html`
                <div class="processing-indicator">
                  <div class="spinner"></div>
                  <p>Processing your request...</p>
                </div>
              `}
            </div>
            
            <div class="image-controls">
              <button 
                class="toggle-btn"
                onClick=${() => setShowOriginal(!showOriginal)}
              >
                ${showOriginal ? '✨ Show Edited' : '🔍 Show Original'}
              </button>
            </div>
            
            <div class="file-info">
              <p><strong>File:</strong> ${file.name}</p>
              <p><strong>Size:</strong> ${(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>

          <div class="filter-controls">
            <h3>🎛️ Manual Adjustments</h3>
            <div class="control-group">
              <label>
                Brightness: ${brightness}%
                <input
                  type="range"
                  min="0"
                  max="200"
                  value=${brightness}
                  onInput=${(e) => setBrightness(e.target.value)}
                />
              </label>
              <label>
                Contrast: ${contrast}%
                <input
                  type="range"
                  min="0"
                  max="200"
                  value=${contrast}
                  onInput=${(e) => setContrast(e.target.value)}
                />
              </label>
              <label>
                Saturation: ${saturation}%
                <input
                  type="range"
                  min="0"
                  max="200"
                  value=${saturation}
                  onInput=${(e) => setSaturation(e.target.value)}
                />
              </label>
              <button 
                class="reset-btn"
                onClick=${() => {
                  setBrightness(100);
                  setContrast(100);
                  setSaturation(100);
                }}
              >
                🔄 Reset Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      <${PromptInput}
        prompt=${prompt}
        onPromptChange=${setPrompt}
        onSubmit=${handlePromptSubmit}
        isProcessing=${isProcessing}
      />

      ${history.length > 1 && html`
        <div class="history-panel">
          <h3>📜 History</h3>
              <div class="history-list">
                ${history.map((entry, index) => html`
                  <div
                    key=${index}
                    class="history-item ${index === historyIndex ? 'active' : ''}"
                    onClick=${() => {
                  setHistoryIndex(index);
                  setFileUrl(entry.url);
                }}
                  >
                    ${entry.description}
                  </div>
                `)}
          </div>
        </div>
      `}
    </div>
  `;
}

/**
 * Main Artify App Component
 */
function ArtifyApp() {
  const [file, setFile] = useState(null);

  console.log('ArtifyApp render - file:', file ? file.name : 'null');

  return html`
    <div class="artify-app">
      <header>
        <img src=${ARTIFY_LOGO} class="artify-logo" alt="Artify logo" />
      </header>
      <main>
        ${file ? 
          html`<${Editor} file=${file} onBack=${() => setFile(null)} />` : 
          html`<${LandingPage} setFile=${setFile} />`
        }
      </main>
    </div>
  `;
}

/**
 * Initialize the Artify block
 */
export default function init(el) {
  // Clear existing content
  el.innerHTML = '';

  // Add block class
  el.classList.add('artify-block');

  // Create container
  const container = createTag('div', { class: 'artify-container' });
  el.appendChild(container);

  // Render the app
  render(html`<${ArtifyApp} />`, container);
}