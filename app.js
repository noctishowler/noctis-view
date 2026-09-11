const cameras = [
  'FORWARD',
  'RIGHT',
  'REAR',
  'LEFT'
];

let current = 0;

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


/* -----------------------------
   CAMERA FEEDS
----------------------------- */

const cameraFeeds = {

  FORWARD: null,
  RIGHT: null,
  REAR: null,
  LEFT: null

};


/* -----------------------------
   CAMERA SELECTION
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

  feed.removeAttribute(
    'src'
  );

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

  updateDiagnostics();

}


/* -----------------------------
   VIDEO MODE
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

    });

}


/* -----------------------------
   VIDEO ERROR HANDLING
----------------------------- */

feed.addEventListener(
  'error',
  () => {

    showStandby(
      cameras[current]
    );

  }
);


/* -----------------------------
   CAMERA BUTTONS
----------------------------- */

buttons.forEach(
  (button, index) => {

    button.addEventListener(
      'click',
      () => {

        setCamera(
          index
        );

      }
    );

  }
);


/* -----------------------------
   DIAGNOSTICS ELEMENTS
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


let toolsOpen =
  false;

let toolsActionMode =
  false;

let toolsActionIndex =
  0;


const toolButtons = [
  toolReconnect,
  toolForward,
  toolClose
].filter(Boolean);


/* -----------------------------
   DIAGNOSTICS STATUS
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
      String(
        feed.readyState
      );

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
   TOOL BUTTON FOCUS
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
   OPEN / CLOSE TOOLS
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
   TOOL BUTTON ACTIONS
----------------------------- */

if (toolClose) {

  toolClose.addEventListener(
    'click',
    () => {

      closeTools();

    }
  );

}


if (toolForward) {

  toolForward.addEventListener(
    'click',
    () => {

      setCamera(0);

      updateDiagnostics();

    }
  );

}


if (toolReconnect) {

  toolReconnect.addEventListener(
    'click',
    () => {

      setCamera(
        current
      );

      updateDiagnostics();

    }
  );

}


/* -----------------------------
   DIAGNOSTIC UPDATES
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


/* -----------------------------
   META DISPLAY CONTROLS
----------------------------- */

/*
 * Main view:
 *
 * Left  = next camera
 * Right = previous camera
 * Down  = open diagnostics
 *
 *
 * Diagnostics view:
 *
 * Down = enter button row
 * Up   = leave button row
 *
 *
 * Button row:
 *
 * Left / Right = choose button
 * Enter        = activate button
 *
 *
 * If not in button row:
 *
 * Up = close diagnostics
 */

document.addEventListener(
  'keydown',
  event => {

    switch (
      event.key
    ) {


      case 'ArrowLeft':

        event.preventDefault();

        if (toolsOpen) {

          if (toolsActionMode) {

            previousToolAction();

          }

        } else {

          setCamera(
            current + 1
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
            current - 1
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


/* -----------------------------
   TOUCH / POINTER CONTROLS
----------------------------- */

/*
 * Retain phone/browser swipe
 * support for testing.
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

      /*
       * Swipe down
       */

      if (dy > 0) {

        if (!toolsOpen) {

          openTools();

        } else if (!toolsActionMode) {

          enterToolActions();

        }

      }


      /*
       * Swipe up
       */

      else {

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

            nextToolAction();

          } else {

            previousToolAction();

          }

        }

      } else {

        /*
         * Swipe left:
         *
         * FORWARD
         * RIGHT
         * REAR
         * LEFT
         * FORWARD...
         */

        if (dx < 0) {

          setCamera(
            current + 1
          );

        }


        /*
         * Swipe right:
         *
         * reverse loop
         */

        else {

          setCamera(
            current - 1
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


/* -----------------------------
   WAKE / RESUME
----------------------------- */

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


addEventListener(
  'pageshow',
  () => {

    closeTools();

    setCamera(0);

    updateDiagnostics();

  }
);


/* -----------------------------
   STARTUP
----------------------------- */

setCamera(0);

updateDiagnostics();