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


/*
 * Pi camera addresses will eventually
 * be added here.
 */

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


/*
 * If a stream dies after starting,
 * return to standby.
 */

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
   DIAGNOSTICS
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


function openTools() {

  if (!toolsDrawer) return;


  toolsOpen =
    true;

  toolsDrawer.classList.add(
    'open'
  );

  toolsDrawer.setAttribute(
    'aria-hidden',
    'false'
  );

  updateDiagnostics();

}


function closeTools() {

  if (!toolsDrawer) return;


  toolsOpen =
    false;

  toolsDrawer.classList.remove(
    'open'
  );

  toolsDrawer.setAttribute(
    'aria-hidden',
    'true'
  );

}


if (toolClose) {

  toolClose.addEventListener(
    'click',
    closeTools
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


addEventListener(
  'resize',
  updateDiagnostics
);


/*
 * Keep diagnostics updated
 * as the video state changes.
 */

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
 * Meta Display / Neural Band:
 *
 * ArrowLeft  = next camera
 * ArrowRight = previous camera
 * ArrowDown  = open tools
 * ArrowUp    = close tools
 */

document.addEventListener(
  'keydown',
  event => {

    switch (
      event.key
    ) {


      case 'ArrowLeft':

        event.preventDefault();

        if (!toolsOpen) {

          setCamera(
            current + 1
          );

        }

        break;


      case 'ArrowRight':

        event.preventDefault();

        if (!toolsOpen) {

          setCamera(
            current - 1
          );

        }

        break;


      case 'ArrowDown':

        event.preventDefault();

        if (!toolsOpen) {

          openTools();

        }

        break;


      case 'ArrowUp':

        event.preventDefault();

        if (toolsOpen) {

          closeTools();

        }

        break;

    }

  }
);


/* -----------------------------
   TOUCH / POINTER CONTROLS
----------------------------- */

/*
 * Keep browser / phone swipe
 * controls available for testing.
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


    /*
     * Vertical swipe.
     */

    if (
      Math.abs(dy) > 45 &&
      Math.abs(dy) >
      Math.abs(dx)
    ) {

      if (dy > 0) {

        if (!toolsOpen) {

          openTools();

        }

      } else {

        if (toolsOpen) {

          closeTools();

        }

      }


      pointerStartX =
        null;

      pointerStartY =
        null;

      return;

    }


    /*
     * Horizontal swipe.
     *
     * Continuous looping:
     *
     * FORWARD
     * RIGHT
     * REAR
     * LEFT
     * FORWARD
     */

    if (
      !toolsOpen &&
      Math.abs(dx) > 45 &&
      Math.abs(dx) >
      Math.abs(dy)
    ) {

      if (dx < 0) {

        setCamera(
          current + 1
        );

      } else {

        setCamera(
          current - 1
        );

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

/*
 * When the web app becomes
 * visible again:
 *
 * close tools
 * return to Forward
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
 * Also reset when the browser
 * restores the page.
 */

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