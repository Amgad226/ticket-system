

const nav = document.querySelector('#nav');
const buttons = document.querySelector('.nav-button');
const toggleButton = document.querySelector('#toggle-button');
const body = document.querySelector('body');
const container = document.querySelector('#messages-container');
const colorPicker = document.getElementById('colorPicker');
const colorDiv = document.getElementById('colorDiv');
const scrollHandle = document.querySelector('::-webkit-scrollbar-thumb');

toggleButton.addEventListener('click', function() {

  if (toggleButton.classList.contains('color-dark')) {
    toggleButton.classList.remove('color-dark');
    toggleButton.classList.add('color-light');
  } else {
    toggleButton.classList.remove('color-light');
    toggleButton.classList.add('color-dark');
  }



  container.classList.toggle('lighter');

  // nav.className = '';
  if (nav.classList.contains('color-dark')) {
    nav.classList.remove('color-dark');
    nav.classList.add('color-light');
  } else {
    nav.classList.remove('color-light');
    nav.classList.add('color-dark');
  }

//   buttons.forEach(button => {
    
  if (buttons.classList.contains('color-dark')) {
    buttons.classList.remove('color-dark');
    buttons.classList.add('color-light');
  } else {
    buttons.classList.remove('color-light');
    buttons.classList.add('color-dark');
  }

// });
body.classList.toggle('dark');
// favorite

});


colorPicker.addEventListener('input', () => {
  nav.style.color = colorPicker.value;
  buttons.style.color = colorPicker.value;
  toggleButton.style.color = colorPicker.value;
  // scrollHandle.style.background = colorPicker.value;
  document.body.style.setProperty('--scroll-color', colorPicker.value);
  document.body.classList.add('scroll-color');
});
