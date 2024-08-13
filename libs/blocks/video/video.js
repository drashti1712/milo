import { createIntersectionObserver, getConfig } from '../../utils/utils.js';
import { applyHoverPlay, getVideoAttrs, applyInViewPortPlay } from '../../utils/decorate.js';

const ROOT_MARGIN = 1000;

const loadVideo = (a, pEl = null) => {
  const { pathname, hash, dataset } = a;
  let videoPath = `.${pathname}`;
  if (pathname.match('media_.*.mp4')) {
    const { codeRoot } = getConfig();
    const root = codeRoot.endsWith('/')
      ? codeRoot
      : `${codeRoot}/`;
    const mediaFilename = pathname.split('/').pop();
    videoPath = `${root}${mediaFilename}`;
  }

  const attrs = getVideoAttrs(hash, dataset);
  const video = `<video ${attrs}>
        <source src="${videoPath}" type="video/mp4" />
      </video>`;
  if (!a.parentNode && !a.classList.contains('delay-video')) return;
  if (pEl) pEl.appendChild(a);
  a.insertAdjacentHTML('afterend', video);
  const videoElem = document.body.querySelector(`source[src="${videoPath}"]`)?.parentElement;
  applyHoverPlay(videoElem);
  applyInViewPortPlay(videoElem);
  a.remove();
};

window.lazyloadedFn = [];

export default function init(elem) {
  let a = elem;
  if(elem.nodeName !== 'A') a = elem.querySelector('a');
  a.classList.add('hide-video');
  if (a.textContent.includes('no-lazy')) {
    // loadVideo(a);
    window.lazyloadedFn.push([loadVideo, a, elem]);
  } else {
    createIntersectionObserver({
      el: a,
      options: { rootMargin: `${ROOT_MARGIN}px` },
      callback: loadVideo,
    });
  }
}
