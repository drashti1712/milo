import branchInit from "../../deps/branch-io.js";

export default function init(el) {
  const header = document.querySelector('.global-navigation');
  branchInit(header);
}
