/* =========================================================
   NOCTIS VIEW
   Main application logic
========================================================= */


/* -----------------------------
   CAMERA CONFIGURATION
----------------------------- */

const cameras = [
  'FORWARD',
  'RIGHT',
  'REAR',
  'LEFT'
];

const cameraFeeds = {
  FORWARD: null,
  RIGHT: null,
  REAR: null,
  LEFT: null
};

let current = 0;


/* -----------------------------
   PRIMARY UI ELEMENTS
----------------------------- */

const nameEl =
  document.getElementById('cameraName');

const buttons =
  [...document.querySelectorAll('[data-camera]')];

const feed =
  document.getElementById('feed');

const standby =
  document.getElementById('standby');

const status =
  document.getElementById('status');

const mode =
  document.getElementById('mode');


/* =========================================================
   CAMERA CONTROL
========================================================= */


/* -----------------------------
   SELECT CAMERA
----------------------------- */

function setCamera(index) {

  current =
    (index + cameras.length)
    % cameras.length;

  const cameraName =
    cameras[current];

  nameEl.textContent =
    cameraName;


  buttons.forEach(
    (button, i) => {

      button.classList.toggle(
        'active',
        i === current
      );

    }
  );


  const source =
    cameraFeeds[cameraName];


  if (source) {

    connectFeed(
      cameraName,
      source
    );

  } else {

    showStandby(
      cameraName
    );

  }


  updateDiagnostics();

}


/* -----------------------------
   STANDBY MODE
----------------------------- */

function showStandby(cameraName) {

  feed.pause();

  feed.removeAttribute('src');

  feed.srcObject =
    null;

  feed.style.display =
    'none';

  standby.style.display =
    'flex';

  mode.textContent =
    'STANDBY';

  status.textContent =
    `${cameraName} feed unavailable`;

}


/* -----------------------------
   CONNECT VIDEO FEED
----------------------------- */

function connectFeed(
  cameraName,
  source
) {

  standby.style.display =
    'none';

  feed.style.display =
    'block';

  mode.textContent =
    cameraName;

  status.textContent =
    `Connecting ${cameraName} camera`;

  feed.srcObject =
    null;

  feed.src =
    source;


  feed.play()
    .then(() => {

      status.textContent =
        `${cameraName} camera active`;

      updateDiagnostics();

    })

    .catch(() => {

      showStandby(
        cameraName
      );

      updateDiagnostics();

    });

}


/* -----------------------------
   CAMERA BUTTONS
----------------------------- */

buttons.forEach(
  (button, index) => {

    button.addEventListener(
      'click',
      () => {

        setCamera(index);

      }
    );

  }
);


/* -----------------------------
   VIDEO ERROR HANDLING
----------------------------- */

feed.addEventListener(
  'error',
  () => {

    showStandby(
      cameras[current]
    );

    updateDiagnostics();

  }
);


/* =========================================================
   DIAGNOSTICS
========================================================= */


/* -----------------------------
   DIAGNOSTIC ELEMENTS
----------------------------- */

const toolsDrawer =
  document.getElementById('toolsDrawer');

const diagCamera =
  document.getElementById('diagCamera');

const diagMode =
  document.getElementById('diagMode');

const diagFeed =
  document.getElementById('diagFeed');

const diagReady =
  document.getElementById('diagReady');

const diagVisible =
  document.getElementById('diagVisible');

const diagViewport =
  document.getElementById('diagViewport');

const toolReconnect =
  document.getElementById('toolReconnect');

const toolForward =
  document.getElementById('toolForward');

const toolClose =
  document.getElementById('toolClose');


const toolButtons = [
  toolReconnect,
  toolForward,
  toolClose
].filter(Boolean);


let toolsOpen =
  false;

let toolsActionMode =
  false;

let toolsActionIndex =
  0;


/* -----------------------------
   UPDATE DIAGNOSTICS
----------------------------- */

function updateDiagnostics() {

  if (!toolsDrawer) return;


  const cameraName =
    cameras[current];


  if (diagCamera) {

    diagCamera.textContent =
      cameraName;

  }


  if (diagMode) {

    diagMode.textContent =
      mode.textContent;

  }


  if (diagFeed) {

    diagFeed.textContent =
      cameraFeeds[cameraName]
        ? 'CONFIGURED'
        : 'NOT CONFIGURED';

  }


  if (diagReady) {

    diagReady.textContent =
      String(feed.readyState);

  }


  if (diagVisible) {

    diagVisible.textContent =
      document.hidden
        ? 'NO'
        : 'YES';

  }


  if (diagViewport) {

    diagViewport.textContent =
      `${innerWidth}×${innerHeight}`;

  }

}


/* -----------------------------
   TOOL SELECTION
----------------------------- */

function updateToolFocus() {

  toolButtons.forEach(
    (button, index) => {

      button.classList.toggle(
        'tool-focused',
        toolsActionMode &&
        index === toolsActionIndex
      );

    }
  );

}


function enterToolActions() {

  if (!toolButtons.length) return;

  toolsActionMode =
    true;

  toolsActionIndex =
    0;

  updateToolFocus();

}


function leaveToolActions() {

  toolsActionMode =
    false;

  updateToolFocus();

}


function nextToolAction() {

  if (!toolButtons.length) return;

  toolsActionIndex =
    (toolsActionIndex + 1)
    % toolButtons.length;

  updateToolFocus();

}


function previousToolAction() {

  if (!toolButtons.length) return;

  toolsActionIndex =
    (
      toolsActionIndex
      - 1
      + toolButtons.length
    )
    % toolButtons.length;

  updateToolFocus();

}


/* -----------------------------
   OPEN / CLOSE DIAGNOSTICS
----------------------------- */

function openTools() {

  if (!toolsDrawer) return;

  toolsOpen =
    true;

  toolsActionMode =
    false;

  toolsDrawer.classList.add(
    'open'
  );

  toolsDrawer.setAttribute(
    'aria-hidden',
    'false'
  );

  updateToolFocus();

  updateDiagnostics();

}


function closeTools() {

  if (!toolsDrawer) return;

  toolsOpen =
    false;

  leaveToolActions();

  toolsDrawer.classList.remove(
    'open'
  );

  toolsDrawer.setAttribute(
    'aria-hidden',
    'true'
  );

}


/* -----------------------------
   TOOL ACTIONS
----------------------------- */

if (toolReconnect) {

  toolReconnect.addEventListener(
    'click',
    () => {

      setCamera(current);

    }
  );

}


if (toolForward) {

  toolForward.addEventListener(
    'click',
    () => {

      setCamera(0);

    }
  );

}


if (toolClose) {

  toolClose.addEventListener(
    'click',
    closeTools
  );

}


/* -----------------------------
   DIAGNOSTIC REFRESH EVENTS
----------------------------- */

addEventListener(
  'resize',
  updateDiagnostics
);

feed.addEventListener(
  'loadeddata',
  updateDiagnostics
);

feed.addEventListener(
  'playing',
  updateDiagnostics
);

feed.addEventListener(
  'waiting',
  updateDiagnostics
);

feed.addEventListener(
  'stalled',
  updateDiagnostics
);


/* =========================================================
   META DISPLAY INPUT
========================================================= */


/*
 * MAIN CAMERA VIEW
 *
 * Swipe right:
 * FORWARD → RIGHT → REAR →
 * LEFT → FORWARD
 *
 * Swipe left:
 * FORWARD → LEFT → REAR →
 * RIGHT → FORWARD
 *
 * Swipe down:
 * open diagnostics
 *
 *
 * DIAGNOSTICS
 *
 * Swipe down:
 * enter action row
 *
 * Swipe up:
 * leave action row
 * or close diagnostics
 *
 * Swipe left / right:
 * move between actions
 *
 * Enter:
 * activate selected action
 */

document.addEventListener(
  'keydown',
  event => {

    switch (event.key) {


      case 'ArrowLeft':

        event.preventDefault();

        if (toolsOpen) {

          if (toolsActionMode) {

            previousToolAction();

          }

        } else {

          setCamera(
            current - 1
          );

        }

        break;


      case 'ArrowRight':

        event.preventDefault();

        if (toolsOpen) {

          if (toolsActionMode) {

            nextToolAction();

          }

        } else {

          setCamera(
            current + 1
          );

        }

        break;


      case 'ArrowDown':

        event.preventDefault();

        if (!toolsOpen) {

          openTools();

        } else if (!toolsActionMode) {

          enterToolActions();

        }

        break;


      case 'ArrowUp':

        event.preventDefault();

        if (toolsActionMode) {

          leaveToolActions();

        } else if (toolsOpen) {

          closeTools();

        }

        break;


      case 'Enter':

        event.preventDefault();

        if (
          toolsOpen &&
          toolsActionMode &&
          toolButtons[toolsActionIndex]
        ) {

          toolButtons[
            toolsActionIndex
          ].click();

        }

        break;

    }

  }
);


/* =========================================================
   TOUCH / POINTER INPUT
========================================================= */


/*
 * Phone and desktop swipe support
 * mirrors the Meta controls.
 */

let pointerStartX =
  null;

let pointerStartY =
  null;


addEventListener(
  'pointerdown',
  event => {

    pointerStartX =
      event.clientX;

    pointerStartY =
      event.clientY;

  }
);


addEventListener(
  'pointerup',
  event => {

    if (
      pointerStartX === null ||
      pointerStartY === null
    ) {

      return;

    }


    const dx =
      event.clientX
      - pointerStartX;

    const dy =
      event.clientY
      - pointerStartY;


    /* -------------------------
       VERTICAL SWIPE
    ------------------------- */

    if (
      Math.abs(dy) > 45 &&
      Math.abs(dy) >
      Math.abs(dx)
    ) {

      if (dy > 0) {

        if (!toolsOpen) {

          openTools();

        } else if (!toolsActionMode) {

          enterToolActions();

        }

      } else {

        if (toolsActionMode) {

          leaveToolActions();

        } else if (toolsOpen) {

          closeTools();

        }

      }


      pointerStartX =
        null;

      pointerStartY =
        null;

      return;

    }


    /* -------------------------
       HORIZONTAL SWIPE
    ------------------------- */

    if (
      Math.abs(dx) > 45 &&
      Math.abs(dx) >
      Math.abs(dy)
    ) {

      if (toolsOpen) {

        if (toolsActionMode) {

          if (dx < 0) {

            previousToolAction();

          } else {

            nextToolAction();

          }

        }

      } else {

        if (dx < 0) {

          setCamera(
            current - 1
          );

        } else {

          setCamera(
            current + 1
          );

        }

      }

    }


    pointerStartX =
      null;

    pointerStartY =
      null;

  }
);


/* =========================================================
   WAKE / RESUME
========================================================= */


/*
 * Whenever Noctis View becomes
 * visible again:
 *
 * close diagnostics
 * reset to FORWARD
 */

document.addEventListener(
  'visibilitychange',
  () => {

    if (!document.hidden) {

      closeTools();

      setCamera(0);

    }

    updateDiagnostics();

  }
);


/*
 * Also reset when the page
 * is restored by the browser.
 */

addEventListener(
  'pageshow',
  () => {

    closeTools();

    setCamera(0);

    updateDiagnostics();

  }
);


/* =========================================================
   STARTUP
========================================================= */

setCamera(0);

updateDiagnostics();