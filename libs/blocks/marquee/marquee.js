/*
 * Marquee - v6.0
 */

import { decorateButtons, getBlockSize, decorateBlockBg } from '../../utils/decorate.js';
import { createTag } from '../../utils/utils.js';

// [headingSize, bodySize, detailSize]
const blockTypeSizes = {
  marquee: {
    small: ['xl', 'm', 'm'],
    medium: ['xl', 'm', 'm'],
    large: ['xxl', 'xl', 'l'],
    xlarge: ['xxl', 'xl', 'l'],
  },
};

function decorateText(el, size) {
  const headings = el.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const heading = headings[headings.length - 1];
  const config = blockTypeSizes.marquee[size];
  const decorate = (headingEl, typeSize) => {
    headingEl.classList.add(`heading-${typeSize[0]}`);
    headingEl.nextElementSibling?.classList.add(`body-${typeSize[1]}`);
    const sib = headingEl.previousElementSibling;
    if (sib) {
      const className = sib.querySelector('img, .icon') ? 'icon-area' : `detail-${typeSize[2]}`;
      sib.classList.add(className);
      sib.previousElementSibling?.classList.add('icon-area');
    }
  };
  decorate(heading, config);
}

function decorateMultipleIconArea(iconArea) {
  iconArea.querySelectorAll(':scope > picture').forEach((picture) => {
    const src = picture.querySelector('img')?.getAttribute('src');
    const a = picture.nextElementSibling;
    if (src?.endsWith('.svg') || a?.tagName !== 'A') return;
    if (!a.querySelector('img')) {
      a.innerHTML = '';
      a.className = '';
      a.appendChild(picture);
    }
  });
  if (iconArea.childElementCount > 1) iconArea.classList.add('icon-area-multiple');
}

function extendButtonsClass(text) {
  const buttons = text.querySelectorAll('.con-button');
  if (buttons.length === 0) return;
  buttons.forEach((button) => { button.classList.add('button-justified-mobile'); });
}

const decorateImage = (media) => {
  media.classList.add('image');

  const imageLink = media.querySelector('a');
  const picture = media.querySelector('picture');
// const pics = media.querySelectorAll('picture');
//   console.log(pics);
//   if( media.closest('.marquee').classList.contains('split') ) {
//     const binaryVP = [['mobile-only'], ['tablet-only', 'desktop-only']];
//     const allVP = [['mobile-only'], ['tablet-only'], ['desktop-only']];
//     const vp = pics.length === 2 ? binaryVP : allVP;
//     if (pics.length > 1) {
//       pics.forEach( (pic,i) => {
//         pic.classList.add(...vp[i]);
//         const position = pic.nextSibling.data?.trim();
//         pic.nextSibling.data = null;
//         console.log(position);
//         media.querySelectorAll('br').forEach(br => br.remove());
//         if( position === 'bottom' ) {
//           pic.classList.add('bottom');
//           pic.style.order = '1';
//         }
//       });
//     } else {
//       pics[0].classList.add(...allVP[0], ...allVP[1], ...allVP[2]);
//     }
//   }
  if (imageLink && picture && !imageLink.parentElement.classList.contains('modal-img-link')) {
    imageLink.textContent = '';
    imageLink.append(picture);
  }
};

export default function init(el) {
  const excDark = ['light', 'quiet'];
  if (!excDark.some((s) => el.classList.contains(s))) el.classList.add('dark');
  const children = el.querySelectorAll(':scope > div');
  console.log(children);
  const foregroundAll = Array.from(children).slice(1);
  console.log(foregroundAll);
  const binaryVP = [['mobile-only'], ['tablet-only', 'desktop-only']];
    const allVP = [['mobile-only'], ['tablet-only'], ['desktop-only']];
    let vp;
    if (foregroundAll.length > 1) {
      vp = foregroundAll.length === 2 ? binaryVP : allVP;
    } else if (foregroundAll.length === 1) {
      vp = [['mobile-only', 'tablet-only', 'desktop-only']];
    }
  foregroundAll.forEach((foreground, i) => {
    // const foreground = children[children.length - 1];
    if (children.length > 1) {
      children[0].classList.add('background');
      decorateBlockBg(el, children[0], { useHandleFocalpoint: true });
    }
    foreground.classList.add('foreground', 'container', ...vp[i]);
    console.log(el);
    const headline = foreground.querySelector('h1, h2, h3, h4, h5, h6');
    const text = headline.closest('div');
    text.classList.add('text');
    const media = foreground.querySelector(':scope > div:not([class])');
    console.log(media);
    if (media) {
      media.classList.add('media', ...vp[i]);
      if (!media.querySelector('video, a[href*=".mp4"]')) decorateImage(media);
    }
  
    const firstDivInForeground = foreground.querySelector(':scope > div');
    if (firstDivInForeground?.classList.contains('media')) el.classList.add('row-reversed');
  
    const size = getBlockSize(el);
    decorateButtons(text, size === 'large' ? 'button-xl' : 'button-l');
    decorateText(text, size);
    const iconArea = text.querySelector('.icon-area');
    if (iconArea?.childElementCount > 1) decorateMultipleIconArea(iconArea);
    extendButtonsClass(text);
    if (el.classList.contains('split')) {
      if (foreground && media) {
        media.classList.add('bleed');
        foreground.insertAdjacentElement('beforebegin', media);
      }
  
      let mediaCreditInner;
      const txtContent = media?.lastChild.textContent.trim();
      if (txtContent) {
        mediaCreditInner = createTag('p', { class: 'body-s' }, txtContent);
      } else if (media.lastElementChild?.tagName !== 'PICTURE') {
        mediaCreditInner = media.lastElementChild;
      }
  
      if (mediaCreditInner) {
        const mediaCredit = createTag('div', { class: 'media-credit container' }, mediaCreditInner);
        el.appendChild(mediaCredit);
        el.classList.add('has-credit');
        media?.lastChild.remove();
      }
    }
  });
}
