// select needed DOM elements
const snContainerElement = document.getElementById('snContainer');
const snElement = document.querySelector('.sticky-note-wrapper');
snElement.style.background = 'linear-gradient(45deg, #45DB2F, #319C21)';

// get the template html of the sticky note
const snContainerHTML = snContainerElement.innerHTML;
const snHTML = snElement.innerHTML;

let isDragging = false; //will be true when your clicking on el
let offsetX, offsetY, el, i;
let inOrderIndex = 1;

//ev listeners
snElement.addEventListener('mousedown', mouseclickHandler);
document.addEventListener('mouseup', () => {
  isDragging = false;
});
document.addEventListener('mousemove', helperMouseMove);

// functions
function createNote() {
  if (snContainerElement.classList.contains('hidden')) {
    // unhidden first element if its already hidden
    snContainerElement.classList.remove('hidden');
    snElement.addEventListener('mousedown', iconsRouter);
    snElement.addEventListener('mouseup', iconsClickHandler);

    document.querySelector('.sn-title').addEventListener('click', autoSelec);
  } else {
    // if its not first element it will create a div and apply it to container
    const snDiv = document.createElement('div');
    snDiv.classList.add('sticky-note-wrapper');
    snDiv.innerHTML = snHTML;
    if (snContainerElement.innerHTML === '') {
      snDiv.style.background = 'linear-gradient(45deg, #45DB2F, #319C21)';
    }

    i = 0; // sticky notes counter
    snContainerElement.append(snDiv);
    document.querySelectorAll('.sticky-note-wrapper').forEach(elemn => {
      let gradient; //initalize gradient value

      elemn.removeEventListener('mousedown', mouseclickHandler); // remove ev listener if it already have
      elemn.removeEventListener('mousedown', iconsRouter);
      elemn.removeEventListener('mouseup', iconsClickHandler);
      elemn.addEventListener('mousedown', mouseclickHandler); // adding ev listener to every sticky note
      elemn.addEventListener('mousedown', iconsRouter);
      elemn.addEventListener('mouseup', iconsClickHandler);

      if (!String(elemn.style.background).match(/(linear-gradient\(.*\))/g)) {
        // check if there are no gradient already applied

        gradient = generateGradient();
        inOrderIndex++;
        elemn.style.background = `linear-gradient(45deg, ${gradient[0]}, ${gradient[1]})`;
        // get gradient and apply it
      }
    });
    document.querySelectorAll('.sn-title').forEach(childEl => {
      i++;
      childEl.value = childEl.value.trim(); // get rid of any space at beggining or end of text
      if (
        childEl.value.match(/Untitled Note #[1-9]+/g) ||
        childEl.value === ''
      ) {
        childEl.value = `Untitled Note #${i}`;
        // check if its an untitled note and then re enumarating it
      }

      childEl.removeEventListener('click', autoSelec);
      childEl.addEventListener('click', autoSelec);
    });
  }
}
function deleteNotes() {
  snContainerElement.innerHTML = '';
  createNote();
  snContainerElement.classList.add('hidden');
  /* clear sn container create new note and hide the container */
  inOrderIndex = 1; // reset background colors
}

function mouseclickHandler(e) {
  if (e.offsetY <= 35 && e.target.className === 'sticky-note-wrapper') {
    //check if its clicking on top of the note
    isDragging = true;

    // getting offset
    offsetX = e.offsetX;
    offsetY = e.offsetY;
    el = e.target; // get el
  } else {
    isDragging = false;
  }

  if (
    e.target.parentElement.classList.contains('collapsed') &&
    e.target.className !== 'sticky-note-wrapper'
  ) {
    isDragging = true;

    offsetX = e.offsetX + 16;
    offsetY = e.offsetY + 1;

    el = e.target.parentElement;
  }
}
function mouseMovementHandler(e, element) {
  let style = element.style;
  if (isDragging) {
    style.left = `${e.clientX - offsetX}px`;
    style.top = `${e.clientY - offsetY}px`;
    // positioning note following the mouse as long as user is dragging the note

    document.querySelectorAll('.sn-title').forEach(t => {
      t.blur();
    });
  }
}

function helperMouseMove(e) {
  if (el != null) {
    mouseMovementHandler(e, el); // call mouse movement handler passing the event and target element as params
  }
}

function generateGradient() {
  const gradientArr = [
    ['#45DB2F', '#319C21'],
    ['#17276e', '#3434ca'],
    ['#F5E400', '#DBCD00'],
    ['#DB1E13', '#C21A11'],
  ];

  if (inOrderIndex == gradientArr.length) {
    // make sure the index go back to 0 when its reachs the last element
    inOrderIndex = 0;
  }
  let choosedGradient = gradientArr[inOrderIndex];
  return choosedGradient;
}

let parent;
function iconsClickHandler(e) {
  if (e.target.classList.contains('dropdown')) {
    parent.classList.toggle('collapsed');
    if (e.target.classList.contains('bx-chevron-down')) {
      e.target.classList.replace('bx-chevron-down', 'bx-chevron-up');
    } else {
      e.target.classList.replace('bx-chevron-up', 'bx-chevron-down');
    }
  } else if (e.target.classList.contains('trash')) {
    e.target.parentElement.parentElement.innerHTML = '';
  }
}

function iconsRouter(e) {
  parent = e.path[2];
  iconsClickHandler(e);
}

function autoSelec(e) {
  if (e.target.value.match(/Untitled Note #[1-9]+/g)) {
    e.target.select();
  }
}
