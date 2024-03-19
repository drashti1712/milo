import branchInit from "../../deps/branch-io.js";

export default function init(el) {
  console.log(el);
  setTimeout(() => {
    const header = document.querySelector('.global-navigation');
    console.log(header);
    branchInit(header);
  }, 3000);
}
