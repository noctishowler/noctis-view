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
 *
 * Example:
 *
 * FORWARD: "https://pi-address/forward"
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

    })

    .catch(() => {

      showStandby(
        cameraName
      );

    });

}


/*
 * If a stream dies after starting,
 * immediately return to standby.
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
   BUTTON CONTROLS
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

let toolsOpen = false;


function updateDiagnostics() {

  const cameraName =
    cameras[current];

  diagCamera.textContent =
    cameraName;

  diagMode.textContent =
    mode.textContent;

  diagFeed.textContent =
    cameraFeeds[cameraName]
      ? 'CONFIGURED'
      : 'NOT CONFIGURED';

  diagReady.textContent =
    String(feed.readyState);

  diagVisible.textContent =
    document.hidden
      ? 'NO'
      : 'YES';

  diagViewport.textContent =
    `${innerWidth}×${innerHeight}`;

}


function openTools() {

  toolsOpen = true;

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

  toolsOpen = false;

  toolsDrawer.classList.remove(
    'open'
  );

  toolsDrawer.setAttribute(
    'aria-hidden',
    'true'
  );

}


document
  .getElementById('toolClose')
  .addEventListener(
    'click',
    closeTools
  );


document
  .getElementById('toolForward')
  .addEventListener(
    'click',
    () => {

      setCamera(0);

      updateDiagnostics();

    }
  );


document
  .getElementById('toolReconnect')
  .addEventListener(
    'click',
    () => {

      setCamera(current);

      updateDiagnostics();

    }
  );


addEventListener(
  'resize',
  updateDiagnostics
);

/* -----------------------------
   SWIPE CONTROLS
----------------------------- */

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
      pointerStartX === null
    ) return;


    const dx =
      event.clientX
      - pointerStartX;

    const dy =
      event.clientY
      - pointerStartY;


    /*
     * Ignore mostly vertical gestures.
     */

    if (
      Math.abs(dx) > 45 &&
      Math.abs(dx) >
      Math.abs(dy)
    ) {

      /*
       * Swipe left:
       *
       * Forward
       * Right
       * Rear
       * Left
       */

      if (dx < 0) {

        setCamera(
          current + 1
        );

      }


      /*
       * Swipe right:
       *
       * reverse direction
       */

      else {

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
 * Whenever the web app becomes
 * visible again, return to the
 * forward camera.
 */

document.addEventListener(
  'visibilitychange',
  () => {

    if (!document.hidden) {

      setCamera(0);

    }

  }
);


/*
 * Also reset when the browser
 * restores the page.
 */

addEventListener(
  'pageshow',
  () => {

    setCamera(0);

  }
);


/* -----------------------------
   STARTUP
----------------------------- */

setCamera(0);