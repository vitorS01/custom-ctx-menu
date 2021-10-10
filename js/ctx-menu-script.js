// nedeed DOM elements
const contextMenuElement = document.getElementById('contextMenu');
const ctxTxtMenuElement = document.getElementById('TextSelectionContextMenu');
const ctxBtnsElemesnts = document.querySelectorAll(
  '.main-ctx-menu-warapper [data-func]'
);

// evts listeners
document.addEventListener('contextmenu', e => {
  let tagName = e.target.nodeName;
  let attr = e.target.getAttribute('contenteditable');
  //check if user is right clicking a text field or img/video
  if (
    tagName !== 'INPUT' &&
    tagName !== 'TEXTAREA' &&
    tagName !== 'IMG' &&
    tagName !== 'VIDEO' &&
    tagName !== 'CANVAS' &&
    tagName !== 'IFRAME' &&
    tagName !== 'A' &&
    attr !== 'true'
  ) {
    // make sure doesn't have any duplicated menu and closing it before adding new one
    contextMenuElement.classList.add('ctx-menu-closed');
    ctxTxtMenuElement.classList.add('ctx-menu-closed');

    if (window.getSelection().toString().length == 0) {
      //is executed when the user isnt selecting any text
      e.preventDefault();
      contextMenuElement.classList.remove('ctx-menu-closed');
      ctxMenuPosition(e, contextMenuElement);
    } else {
      e.preventDefault();
      ctxTxtMenuElement.classList.remove('ctx-menu-closed');
      ctxMenuPosition(e, ctxTxtMenuElement);
    }
  } else {
    // close all ctx menus
    contextMenuElement.classList.add('ctx-menu-closed');
    ctxTxtMenuElement.classList.add('ctx-menu-closed');
  }
});
document.addEventListener('mousedown', () => {
  // close all ctx menus
  contextMenuElement.classList.add('ctx-menu-closed');
  ctxTxtMenuElement.classList.add('ctx-menu-closed');
});

// prevent remove the ctx menu from being right clicked and left clicked
document.querySelectorAll('.context-menu').forEach(el => {
  el.addEventListener('mousedown', e => {
    e.stopPropagation();
  });
  el.addEventListener('contextmenu', e => {
    e.preventDefault();
    e.stopPropagation();
  });
});

//btns functions
ctxBtnsElemesnts.forEach(el => {
  el.addEventListener('click', () => {
    //add click event listener to every single ctx menu btn
    let func = el.dataset.func; //get the type of function it should execute
    if (func === 'refreash') {
      reload();
    } else if (func === 'back') {
      backHistory();
    } else if (func === 'foward') {
      fowardHistory();
    } else if (func === 'newurl') {
      openURLOnNewTab();
    } else if (func === 'honeinsert') {
      hOneInsert();
    } else if (func === 'taginsert') {
      tagInsert();
    } else if (func === 'imginsert') {
      imgInsert();
    } else if (func === 'copy') {
      copy();
    } else if (func === 'addstickynote') {
      addStickyNote();
    } else if (func === 'deletestickynote') {
      deleteStickyNotes();
    }

    //close all ctx menus
    contextMenuElement.classList.add('ctx-menu-closed');
    ctxTxtMenuElement.classList.add('ctx-menu-closed');
  });
});
document.addEventListener('keyup', e => {
  let tagName = e.target.nodeName;
  let attr = e.target.getAttribute('contenteditable');
  const check =
    tagName !== 'INPUT' && tagName !== 'TEXTAREA' && attr !== 'true';

  let key = e.key;

  if (key === 'R' && e.shiftKey && check) {
    reload();
  } else if (key === 'ArrowLeft' && e.ctrlKey) {
    backHistory();
  } else if (key === 'ArrowRight' && e.ctrlKey) {
    fowardHistory();
  } else if (key === 'A' && e.shiftKey && check) {
    openURLOnNewTab();
  } else if (key === 'Escape') {
    // close the ctx menus when user press esc
    contextMenuElement.classList.add('ctx-menu-closed');
    ctxTxtMenuElement.classList.add('ctx-menu-closed');
  } else if (key === 'E' && e.shiftKey && check) {
    createNote();
  } else if (key === 'D' && e.shiftKey && check) {
    deleteStickyNotes();
  }
  // console.log('key: ', e.key);
  // console.log('shift key: ', e.shiftKey);
  // console.log('ctrl key: ', e.ctrlKey);
});

//functions

/**
 * change the ctx menu position
 * @param {Event} e
 */
function ctxMenuPosition(e, ctxMenuEl) {
  let ctxMenuStyle = ctxMenuEl.style;
  ctxMenuStyle.left = `${e.clientX}px`;
  ctxMenuStyle.top = `${e.clientY}px`;

  outOfScreen(e, ctxMenuEl, ctxMenuStyle);
}

/**
 * detect when the ctx menu gets out of the screen then fix its positioning
 * @param {Event} e
 * @param {HTMLElement} ctxMenuEl
 */
function outOfScreen(e, ctxMenuEl, ctxMenuStyle) {
  if (
    Number(ctxMenuStyle.left.slice(0, -2)) >=
    window.innerWidth - ctxMenuEl.clientWidth
  ) {
    ctxMenuStyle.left = `${window.innerWidth - (ctxMenuEl.clientWidth + 3)}px`;
  }
  if (
    Number(ctxMenuStyle.top.slice(0, -2)) >=
    window.innerHeight - ctxMenuEl.clientHeight
  ) {
    ctxMenuStyle.top = `${e.clientY - ctxMenuEl.clientHeight}px`;
  }
}

// ctx menu btn functions

function reload() {
  window.location.reload();
}
function backHistory() {
  history.back();
}
function fowardHistory() {
  history.forward();
}
function openURLOnNewTab() {
  let urlPrompt = prompt('what URL you want to go to? ', 'https://');
  if (urlPrompt != null && urlPrompt != '') {
    // make sure the user didn't canceled or typed an empty str
    window.open(urlPrompt).focus();
  }
}
function hOneInsert() {
  let textPrompt = prompt('type the h1 text: ');
  if (textPrompt != null) {
    let h1 = document.createElement('h1');
    h1.textContent = textPrompt;

    document.body.append(h1);
  }
}
function tagInsert() {
  let tagPrompt = prompt('what tag should it be?');

  if (tagPrompt != null && tagPrompt != '') {
    let textPrompt = prompt('type the tag text: ');
    // make sure the user didn't canceled or typed an empty str
    let tag = document.createElement(tagPrompt);
    tag.textContent = textPrompt == null ? '' : textPrompt;

    document.body.append(tag);
  }
}
function imgInsert() {
  let linkPrompt = prompt('type the img link here: ');
  if (linkPrompt != null) {
    let img = document.createElement('img');
    img.setAttribute('src', linkPrompt);
    img.setAttribute('alt', 'Unable to Load Image');

    document.body.append(img);
  }
}
function copy() {
  navigator.clipboard.writeText(window.getSelection().toString());
}
function addStickyNote() {
  createNote(); // call create note from sticky-note-script.js
}
function deleteStickyNotes() {
  deleteNotes(); // call dele notes from sticky-note-script.js
}
