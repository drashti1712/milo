import { createIntersectionObserver, getConfig } from '../../utils/utils.js';
import { applyHoverPlay, getVideoAttrs, applyInViewPortPlay } from '../../utils/decorate.js';

const ROOT_MARGIN = 1000;

const loadVideo = (a) => {
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
  if (!a.parentNode) return;
  a.insertAdjacentHTML('afterend', video);
  const videoElem = document.body.querySelector(`source[src="${videoPath}"]`)?.parentElement;
  applyHoverPlay(videoElem);
  applyInViewPortPlay(videoElem);
  a.remove();
};

// window.lazyloadedFn = []; //1

export default function init(elem) {
  let a = elem;
  if(elem.nodeName !== 'A') a = elem.querySelector('a');
  a.classList.add('hide-video');
  if (a.textContent.includes('no-lazy')) {
    setTimeout(() => {
      if (!elem.querySelector('a')) elem.appendChild(a);
      loadVideo(a);
    }, 7000);
    // window.lazyloadedFn.push([loadVideo, a]) //1
  } else {
    createIntersectionObserver({
      el: a,
      options: { rootMargin: `${ROOT_MARGIN}px` },
      callback: loadVideo,
    });
  }
}
