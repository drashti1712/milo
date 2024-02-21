import { createTag } from '../../utils/utils.js';

function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
      .then(() => {
          alert('Copied to clipboard: ' + text);
      })
      .catch(err => {
          console.error('Failed to copy: ', err);
      });
}

function submitForm(form) {
  form.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting normally
    
    const formData = {};
    form.querySelectorAll('input:not([type="submit"])').forEach(i => {
      formData[i.id] = i.value;
    });
    const copyText = btoa(JSON.stringify(formData));
    copyToClipboard(copyText);
    // copyText.select();
    // document.execCommand("copy");
    console.log(formData);
    console.log(btoa(JSON.stringify(formData)));
    // var selectors = form.querySelector('#selectors').value;
    // var svgLink = form.querySelector('#svgLink').value;
    
    // console.log('Mode:', mode);
    // console.log('Selectors:', selectors);
    // console.log('SVG Link:', svgLink);
});
}

function createForm(intEl) {
  const blockName = intEl.firstElementChild.innerText;
  const inputFields = intEl.lastElementChild.innerText?.split('|');
  console.log(blockName);
  intEl.innerHTML = '';
  intEl.classList.add(`${blockName}`);
  console.log(inputFields);
  const form = createTag('form', { class: `${blockName}-form` });
  intEl.appendChild(form);
  inputFields.forEach(field => {
    const label = createTag('label', { for: `${field.toLowerCase().trim()}` });
    label.textContent = field.trim();
    form.appendChild(label);
    var input = createTag('input');
    input.type = 'text';
    input.id = field.trim();
    input.name = field.trim();
    input.required = true;
    form.appendChild(input);
  })
  var submitButton = createTag('input');
  submitButton.type = 'submit';
  submitButton.value = 'Copy Base64';
  form.appendChild(submitButton);
  submitForm(form);
}



export default async function init(el) {
  console.log(el);
  const intEl = el.querySelector('div');
  console.log(intEl.firstElementChild);
  createForm(intEl);
}
