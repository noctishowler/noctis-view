const cameras = ['FORWARD', 'RIGHT', 'REAR', 'LEFT'];

let current = 0;

const nameEl = document.getElementById('cameraName');
const buttons = [...document.querySelectorAll('[data-camera]')];
const feed = document.getElementById('feed');
const placeholder = document.getElementById('placeholder');
const status = document.getElementById('status');

function setCamera(index) {
  current = (index + cameras.length) % cameras.length;

  const cameraName = cameras[current];

  nameEl.textContent = cameraName;

  buttons.forEach((button, i) => {
    button.classList.toggle('active', i === current);
  });

  /*
   * Raspberry Pi feed switching will be added here later.
   *
   * Example future structure:
   *
   * const cameraFeeds = {
   *   FORWARD: '...',
   *   RIGHT: '...',
   *   REAR: '...',
   *   LEFT: '...'
   * };
   *
   * connectToFeed(cameraFeeds[cameraName]);
   */

  showDisconnectedState();
}

function showDisconnectedState() {
  feed.pause();
  feed.removeAttribute('src');
  feed.srcObject = null;
  feed.style.display = 'none';

  placeholder.style.display = '';
  status.textContent = 'Waiting for Raspberry Pi camera feeds';
}

buttons.forEach((button, index) => {
  button.addEventListener('click', () => {
    setCamera(index);
  });
});

let pointerStartX = null;
let pointerStartY = null;

addEventListener('pointerdown', event => {
  pointerStartX = event.clientX;
  pointerStartY = event.clientY;
});

addEventListener('pointerup', event => {
  if (pointerStartX === null) return;

  const dx = event.clientX - pointerStartX;
  const dy = event.clientY - pointerStartY;

  if (
    Math.abs(dx) > 45 &&
    Math.abs(dx) > Math.abs(dy)
  ) {
    if (dx < 0) {
      setCamera(current + 1);
    } else {
      setCamera(current - 1);
    }
  }

  pointerStartX = null;
  pointerStartY = null;
});

/*
 * When the glasses/page wakes or resumes,
 * always return to FORWARD.
 */
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    setCamera(0);
  }
});

addEventListener('pageshow', () => {
  setCamera(0);
});

setCamera(0);