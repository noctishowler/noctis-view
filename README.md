Noctis View

Noctis View is a lightweight web app for Meta Ray-Ban Display glasses that provides access to external cameras mounted around the Noctis fursuit head.

The goal is a simple, low-latency situational-awareness system controlled primarily through the Meta Neural Band.

Current Status

The interface and controls are functional. Raspberry Pi camera hardware has not yet been connected, so all four camera positions currently display the animated standby screen.

Current camera positions:

* Forward
* Right
* Rear
* Left

Camera selection loops continuously in either direction.

Controls

Camera View

Gesture	Action
Swipe Left	Look left
Swipe Right	Look right
Swipe Down	Open diagnostics

Swiping right cycles:

FORWARD → RIGHT → REAR → LEFT → FORWARD

Swiping left cycles in the opposite direction.

Diagnostics

Swipe down again after opening diagnostics to enter the action row.

Gesture	Action
Swipe Left / Right	Select action
Pinch / Enter	Activate action
Swipe Up	Back / close diagnostics

Available actions are Reconnect, Reset Forward, and Close.

Touch/pointer gestures are also supported for testing from a phone or conventional browser.

Wake / Resume

Whenever the app becomes visible again, Noctis View closes diagnostics and resets to the FORWARD camera.

Forward is intentionally always the default rather than remembering the last selected camera.

Raspberry Pi Cameras

The planned system uses a Raspberry Pi to manage four external camera feeds.

const cameraFeeds = {
  FORWARD: null,
  RIGHT: null,
  REAR: null,
  LEFT: null
};

These entries will eventually point to the Raspberry Pi streams. Until then, each camera displays the standby animation.

Development priorities for the video system are low latency, reliable switching, and low processing overhead.

Project Files

noctis-view/
├── index.html
├── style.css
├── app.js
├── IMG_1834.gif
└── README.md

* index.html — Interface structure
* style.css — Noctis View theme and layout
* app.js — Camera, gesture, diagnostics, and resume logic
* IMG_1834.gif — Animated standby display

Next Step

Connect the Raspberry Pi camera hardware and test streaming methods to determine the lowest-latency practical way to deliver the four feeds to the Meta Display.