const changeImage = (clickedElement, pictureList, index) => {
  clickedElement.replaceWith(pictureList[index]);
  clickedElement = pictureList[index];
  clickedElement.onclick = function() {changeImage(clickedElement, pictureList, (index+1) % pictureList.length)};
}

export default function init(el) {
  const section = el.closest('.section');
  const marquee = section.querySelector('.marquee');
  const media = marquee.querySelector(".foreground > .media");
  media.style.padding = "64px";

  const svgImage = document.createElement("img");
  svgImage.src = "https://main--milo--adobecom.hlx.page/drafts/drashti/MWPW-137345/assets/interactive-marquee/desktop/see-it-in-action-white.svg";
  svgImage.style.position = "absolute";
  svgImage.style.top = "0";
  svgImage.style.left = "0";
  console.log(svgImage);
  // media.appendchild(svgImage);

  let clickedElement = media.querySelector('picture');
  const pictureList = el.querySelectorAll('picture');
  console.log(pictureList);
  pictureList.forEach(picture => {
    const imgElement = picture.querySelector('img');
    if (imgElement) {
      imgElement.removeAttribute('loading');
    }
  });
  console.log("picture list", pictureList);
  clickedElement.onclick = function() {changeImage(clickedElement, pictureList, 0)};
}
