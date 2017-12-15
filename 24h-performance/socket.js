const token = process.argv[2];
const driver = process.argv[3];
const eventSendingInterval = process.argv[4];
const WebSocket = require('ws');
const SOCKET_URL = 'wss://api.test.breakerlog.com/carm/hos-events';

let ws;
let timer;
let reconnectionTime;

const event = {
  comment: "",
  discriminator: "driver_edit",
  driverId: "78688378-b3c7-49c7-a546-1b1f25cb12ea",
  dutyStatus: "off",
  editDate: null,
  eldId: null,
  location: null,
  occurrence: Date.now(),
  originalEvent: null,
  position: null,
  vehicleId: null
};

initSocketConnection();

function initSocketConnection() {
  ws = new WebSocket(SOCKET_URL);

  /* Event listeners */
  ws.on('close', onClose);
  ws.on('error', error => console.log('::SOCKET ERROR::', new Date(), error.message || 'Unknown socket error', '::', driver));
  ws.on('open', onOpen);
}

function tryReconnect() {
  const attemptCount = 4;

  let count = 0;
  let time = 1000;

  (function timer() {
    reconnectionTime = setTimeout(function () {
      if (count < attemptCount) {
        initSocketConnection();
        count += 1;
        time *= count;
        timer();
      } else {
        clearTimeout(reconnectionTime);
      }
    }, time);
  }());
}

function onClose() {
  console.log('::SOCKET CLOSED::', new Date(), '::', driver);
  clearInterval(timer);
  tryReconnect();
}

function onOpen() {
  console.log('::SOCKET OPENED::', new Date(), '::', driver);
  clearTimeout(reconnectionTime);

  ws.send(JSON.stringify({
    token: token,
    eventsStartPoint: Date.now()
  }));

  timer = setInterval(() => {
    ws.send(JSON.stringify(event));
    console.log('::MESSAGE SENT::', driver, '::', new Date());
  }, eventSendingInterval);
}
