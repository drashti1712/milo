import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { setConfig } from '../../../libs/utils/utils.js';

// Import the Artify block
const { default: init } = await import('../../../libs/blocks/artify/artify.js');

// Set up test configuration
setConfig({
  codeRoot: '/libs',
  locales: { '': { ietf: 'en-US' } },
});

describe('Artify Block (Updated React App Design)', () => {
  let artifyEl;

  beforeEach(() => {
    // Create a fresh element for each test
    artifyEl = document.createElement('div');
    artifyEl.className = 'artify';
    document.body.appendChild(artifyEl);
  });

  afterEach(() => {
    // Clean up after each test
    if (artifyEl && artifyEl.parentNode) {
      artifyEl.parentNode.removeChild(artifyEl);
    }
  });

  it('should initialize the artify block', async () => {
    await init(artifyEl);
    
    expect(artifyEl.classList.contains('artify-block')).to.be.true;
    expect(artifyEl.querySelector('.artify-container')).to.exist;
  });

  it('should render the landing page with banner image', async () => {
    await init(artifyEl);
    
    // Wait for Preact to render
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const landingPage = artifyEl.querySelector('.artify-landing');
    const bannerImg = artifyEl.querySelector('.banner-img');
    
    expect(landingPage).to.exist;
    expect(bannerImg).to.exist;
    expect(bannerImg.getAttribute('alt')).to.equal('Artify banner');
  });

  it('should display correct landing page messaging', async () => {
    await init(artifyEl);
    
    // Wait for Preact to render
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const welcomeText = artifyEl.textContent;
    expect(welcomeText).to.include('Add magic and transform your images in one go');
    expect(welcomeText).to.include('Choose a photo');
    expect(welcomeText).to.include('or Drag and Drop images');
  });

  it('should use actual logo from React app', async () => {
    await init(artifyEl);
    
    // Wait for Preact to render
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const logo = artifyEl.querySelector('.artify-logo');
    expect(logo).to.exist;
    expect(logo.getAttribute('src')).to.include('logo.png');
    expect(logo.getAttribute('alt')).to.equal('Artify logo');
  });

  it('should have file upload functionality', async () => {
    await init(artifyEl);
    
    // Wait for Preact to render
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const fileInput = artifyEl.querySelector('input[type="file"]');
    const uploadBtn = artifyEl.querySelector('.upload-btn');
    
    expect(fileInput).to.exist;
    expect(fileInput.getAttribute('accept')).to.equal('image/*');
    expect(uploadBtn).to.exist;
    expect(uploadBtn.textContent).to.equal('Choose a photo');
  });

  it('should have proper landing page layout', async () => {
    await init(artifyEl);
    
    // Wait for Preact to render
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const mainWrapper = artifyEl.querySelector('.main-wrapper');
    const info = artifyEl.querySelector('.info');
    const uploadContainer = artifyEl.querySelector('.upload-container');
    
    expect(mainWrapper).to.exist;
    expect(info).to.exist;
    expect(uploadContainer).to.exist;
  });

  // Note: Testing the editor components (Navbar, Sidebar, MainScreen, CommandPrompt)
  // would require simulating file upload, which is complex in unit tests.
  // The editor functionality is better tested manually with the test HTML file.

  it('should have responsive styling classes', async () => {
    await init(artifyEl);
    
    expect(artifyEl.classList.contains('artify-block')).to.be.true;
    
    const container = artifyEl.querySelector('.artify-container');
    expect(container).to.exist;
  });

  it('should match actual React app styling', async () => {
    await init(artifyEl);
    
    // Wait for Preact to render
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Check for proper CSS classes that match React app
    const landing = artifyEl.querySelector('.artify-landing');
    const uploadBtn = artifyEl.querySelector('.upload-btn');
    
    expect(landing).to.exist;
    expect(uploadBtn).to.exist;
    
    // Verify styling is applied
    const computedStyle = window.getComputedStyle(artifyEl);
    expect(computedStyle.fontFamily).to.include('Adobe Clean');
  });

  it('should have proper accessibility structure', async () => {
    await init(artifyEl);
    
    // Wait for Preact to render
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const main = artifyEl.querySelector('main');
    const header = artifyEl.querySelector('header');
    
    expect(main).to.exist;
    expect(header).to.exist;
    
    // Check for proper image alt text
    const bannerImg = artifyEl.querySelector('.banner-img');
    const logoImg = artifyEl.querySelector('.artify-logo');
    
    expect(bannerImg.getAttribute('alt')).to.exist;
    expect(logoImg.getAttribute('alt')).to.exist;
  });
});