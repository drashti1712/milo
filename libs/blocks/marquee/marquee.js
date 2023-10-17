/*
 * Marquee - v6.0
 */

import { applyHoverPlay, decorateButtons, getBlockSize } from '../../utils/decorate.js';
import { createTag } from '../../utils/utils.js';

const decorateVideo = (container, video) => {
  if (video.nodeName === 'A' && video.href.includes('.mp4')) {
    // no special attrs handling
    container.innerHTML = `<video preload="metadata" playsinline autoplay muted loop>
      <source src="${video.href}" type="video/mp4" />
    </video>`;
  } else if (video.attributes.getNamedItem('controls')) {
    video.removeAttribute('controls');
    video.setAttribute('muted', '');
    video.setAttribute('autoplay', '');
    video.setAttribute('loop', '');

    const attrs = [...video.attributes].map((a) => a.name).join(' ');
    container.innerHTML = `<video preload="metadata" ${attrs}>
        <source src="${video.firstElementChild.src}" type="video/mp4" />
      </video>`;
  }
  applyHoverPlay(container.firstElementChild);
  container.classList.add('has-video');
};

const decorateBlockBg = (block, node) => {
  const viewports = ['mobile-only', 'tablet-only', 'desktop-only'];
  const childCount = node.childElementCount;
  const { children } = node;

  node.classList.add('background');

  if (childCount === 2) {
    children[0].classList.add(viewports[0]);
    children[1].classList.add(viewports[1], viewports[2]);
  }

  [...children].forEach(async (child, index) => {
    if (childCount === 3) {
      child.classList.add(viewports[index]);
    }
    const video = child.querySelector('video, a[href*=".mp4"]');
    if (video) {
      decorateVideo(child, video);
    }

    const pic = child.querySelector('picture');
    if (pic && (child.childElementCount === 2 || child.textContent?.trim())) {
      const { handleFocalpoint } = await import('../section-metadata/section-metadata.js');
      handleFocalpoint(pic, child, true);
    }
  });

  if (!node.querySelector(':scope img') && !node.querySelector(':scope video')) {
    block.style.background = node.textContent;
    node.remove();
  }
};

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

  if (imageLink && picture && !imageLink.parentElement.classList.contains('modal-img-link')) {
    imageLink.textContent = '';
    imageLink.append(picture);
  }
};

export default function init(el) {
  const isLight = el.classList.contains('light');
  if (!isLight) el.classList.add('dark');
  const children = el.querySelectorAll(':scope > div');
  const foreground = children[children.length - 1];
  if (children.length > 1) {
    children[0].classList.add('background');
    decorateBlockBg(el, children[0]);
  }
  foreground.classList.add('foreground', 'container');
  const headline = foreground.querySelector('h1, h2, h3, h4, h5, h6');
  const text = headline.closest('div');
  text.classList.add('text');
  const media = foreground.querySelector(':scope > div:not([class])');
  
  if (media) {
    media.classList.add('media');
    const video = media.querySelector('video, a[href*=".mp4"]');
    if (video) {
      decorateVideo(media, video);
    } else {
      decorateImage(media);
    }
  }

  const firstDivInForeground = foreground.querySelector(':scope > div');
  if (firstDivInForeground?.classList.contains('media')) el.classList.add('row-reversed');

  const size = getBlockSize(el);
  decorateButtons(text, size === 'large' ? 'button-xl' : 'button-l');
  decorateText(text, size);
  const iconArea = text.querySelector('.icon-area');
  if (iconArea?.childElementCount > 1) decorateMultipleIconArea(iconArea);
  extendButtonsClass(text);

  if (el.classList.contains('interactive')) {
    const hoverMedia = foreground.querySelector(':scope > div:not([class])');
    const hoverPictures = hoverMedia.querySelectorAll('picture');
    hoverPictures.forEach( picture => {
      picture.classList.add('hoverImg');
    })
    const pictures = media.querySelectorAll('picture');

    const pictureContainer = media.children[0];
    pictureContainer.classList.add('showImage');

    function handleClick(index) {
      hoverPictures[index].style.display = 'none';
      pictures[(index+1) % pictures.length].style.display = 'block';
      pictures[(index+1) % pictures.length].classList.add('show');
    };

    hoverPictures.forEach((picture, index) => {
      picture.onclick = function () {handleClick(index)};
    })

    function hover(picture1, picture2) {
      picture1.style.display = 'none';
      picture2.style.display = 'block';
      picture2.classList.add('show');
      if (picture2.style.display === 'block') {
        picture2.onmouseleave = function (e) {hoverOut(e);}
      }
    }

    function hoverOut(e) {
      if (e.target.style.display !== 'none') {
        e.target.style.display = 'none';
        e.target.previousElementSibling.style.display = 'block';
        e.target.previousElementSibling.classList.add('show');
      }
    }

    pictures[0].classList.add('show');
    pictures.forEach((picture, index) => {
      picture.classList.add('clickImage');
      if (!picture.classList.contains('show')) {
        picture.style.display = 'none';
      }
      picture.parentElement.appendChild(hoverPictures[index]);
      hoverPictures[index].style.display = 'none';
      picture.onmouseenter = function () {
        hover(pictures[index], hoverPictures[index]);
      };
    });

    const svgImage = document.createElement('img');
    svgImage.src = 'https://main--cc--adobecom.hlx.page/drafts/drashti/MWPW-137345/assets/genfill/see-it-in-action-white.svg';
    // as a bg image - encode svg in base64
    svgImage.style.position = 'absolute';
    svgImage.style.right = '240px';
    svgImage.style.top = '0';
    svgImage.style.width = '240px';
    // svgImage.style.display = 'none';
    media.insertBefore(svgImage, pictureContainer);
  }

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
      media.lastChild.remove();
    }
  }
}
