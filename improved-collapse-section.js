// Improved version of the collapse section functionality

// Constants
const COLLAPSE_THRESHOLD = 3;
const MOBILE_BREAKPOINT = 600;
const SELECTORS = {
  COLLAPSIBLE_ITEMS: '[data-collapsible-item]', // More semantic
  SHOW_MORE_BUTTON: '.show-more-button',
  EXPANDED_CLASS: 'show-all',
  EXPANDED_VIEW_CLASS: 'expanded-view'
};

/**
 * Creates a "Show More" button for expandable sections
 * @param {HTMLElement} section - The section to create button for
 * @returns {Promise<HTMLElement|null>} The show more button element
 */
async function createShowMoreButton(section) {
  // Validation
  if (!section?.nodeType) {
    console.error('Invalid section element provided to createShowMoreButton');
    return null;
  }

  try {
    const seeMoreText = await replacePlaceholder('see-more-features');
    
    // Create button structure
    const showMoreButton = createTag('div', { class: 'show-more-button' });
    const button = createTag('button', { 
      type: 'button',
      'aria-expanded': 'false',
      'aria-label': `Show more items in ${section.getAttribute('aria-label') || 'section'}`
    }, seeMoreText);

    const iconSpan = createTag('span', {
      class: 'show-more-icon',
      'aria-hidden': 'true',
    }, ADD_MORE_ICON);
    
    button.appendChild(iconSpan);

    // Event handler with cleanup
    const clickHandler = () => {
      section.classList.add(SELECTORS.EXPANDED_CLASS);
      section.classList.add(SELECTORS.EXPANDED_VIEW_CLASS);
      
      // Update accessibility
      button.setAttribute('aria-expanded', 'true');
      
      // Clean up
      button.removeEventListener('click', clickHandler);
      showMoreButton.remove();
    };

    button.addEventListener('click', clickHandler);
    showMoreButton.append(button);
    
    return showMoreButton;
    
  } catch (error) {
    console.error('Failed to create show more button:', error);
    return null;
  }
}

/**
 * Handles the collapse functionality for a section
 * @param {HTMLElement} section - The section to potentially collapse
 * @returns {Promise<void>}
 */
async function handleCollapseSection(section) {
  // Early validation
  if (!section?.nodeType) {
    console.warn('Invalid section provided to handleCollapseSection');
    return;
  }

  // Get collapsible items with more specific selector
  const blocks = section.querySelectorAll(SELECTORS.COLLAPSIBLE_ITEMS);
  const existingShowMoreButton = section.querySelector(SELECTORS.SHOW_MORE_BUTTON);
  
  // Check if collapse is needed
  if (blocks.length <= COLLAPSE_THRESHOLD || existingShowMoreButton) {
    return;
  }

  try {
    // Create and append show more button
    const showMoreButton = await createShowMoreButton(section);
    if (!showMoreButton) {
      console.warn('Failed to create show more button');
      return;
    }
    
    section.append(showMoreButton);
    
    // Apply responsive styling through CSS classes instead of inline styles
    if (window.innerWidth > MOBILE_BREAKPOINT) {
      section.classList.add('desktop-view');
    }
    
    // Analytics decoration
    if (typeof decorateDefaultLinkAnalytics === 'function') {
      decorateDefaultLinkAnalytics(showMoreButton);
    }
    
  } catch (error) {
    console.error('Error handling collapse section:', error);
  }
}

/**
 * Enhanced version with resize handling and better performance
 */
class CollapseSectionManager {
  constructor() {
    this.resizeTimeout = null;
    this.init();
  }

  init() {
    // Handle resize events with debouncing
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  handleResize() {
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => {
      this.updateResponsiveClasses();
    }, 150);
  }

  updateResponsiveClasses() {
    const sections = document.querySelectorAll('[data-collapsible-section]');
    sections.forEach(section => {
      if (window.innerWidth > MOBILE_BREAKPOINT) {
        section.classList.add('desktop-view');
      } else {
        section.classList.remove('desktop-view');
      }
    });
  }

  async processSection(section) {
    return handleCollapseSection(section);
  }
}

// Usage example:
// const manager = new CollapseSectionManager();
// manager.processSection(sectionElement);

export { 
  createShowMoreButton, 
  handleCollapseSection, 
  CollapseSectionManager,
  COLLAPSE_THRESHOLD,
  SELECTORS 
};
