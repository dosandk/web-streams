// References to all the element we will need.
const $video = document.querySelector('#camera-stream');
const $image = document.querySelector('#snap');
const $controls = document.querySelector('.controls');
const $takePhoto = document.querySelector('#take-photo');
const $deletePhoto = document.querySelector('#delete-photo');
const $downloadPhoto = document.querySelector('#download-photo');

if (navigator.getUserMedia){
  navigator.getUserMedia({video: true}, stream => {
      console.error('stream', stream);

      $video.src = window.URL.createObjectURL(stream);
      $video.play();
      $video.onplay = () => showVideo();
    },
    err => console.error(`Error: ${err}`)
  );
}
// if (navigator.getUserMedia){
//   navigator.getUserMedia({video: true}, stream => {
//       const mediaStream = new MakeMediaRecorderStream(stream);
//       const reader = mediaStream.getReader();
//       console.error('stream', stream);
//       console.error('mediaStream', mediaStream);
//       console.error('mediaStream reader', reader);
//
//       readTheRecorderStream(reader);
//     },
//     err => console.error(`Error: ${err}`)
//   );
// }

function MakeMediaRecorderStream(mediaStream) {
  // Constructor throws.
  const recorder = new MediaRecorder(mediaStream);

  return new ReadableStream({
    start(controller) {
      // Backpressure is not supported: if the client loses a single event.data,
      // the reconstructed recorded array of Blobs might not be playable.
      recorder.ondataavailable = event => controller.enqueue(event.data);
      recorder.onstop = () => controller.close();
      recorder.onerror = () => controller.error(new Error('The MediaRecorder errored!'));
      // We have also onstart, onpause and onresume events.
      recorder.start(100);
    },

    cancel() {
      if (recorder.state !== 'inactive') recorder.stop();
    }
  });
}

function readTheRecorderStream(reader) {
  return reader.read()
    .then(({ value, done }) => {
      if (done) {
        console.log("The stream has been closed");
        return;
      }

      console.log('value', value);
      console.log('window.URL.createObjectURL(value)', window.URL.createObjectURL(value));
      // $video.src = window.URL.createObjectURL(value);
      $video.src = window.URL.createObjectURL(value);
      $video.play();

      $image.src =  window.URL.createObjectURL(value);
      console.log('reader: ' + value.size + ' Bytes');
      // debugger;

      return readTheRecorderStream(reader);
    },
    e => console.error("The stream became errored and cannot be read from!", e))
}

// const readableStream = new ReadableStream({
//   start (controller) {
//     if (navigator.getUserMedia){
//       navigator.getUserMedia({video: true}, stream => {
//           const mediaStream = new MediaRecorder(stream);
//           console.error('mediaStream', mediaStream.getReader());
//           console.error('stream', stream);
//           console.error('stream.getVideoTracks()', stream.getVideoTracks());
//           console.error('stream.getReader()', stream.getReader());
//           // controller.enqueue(stream);
//         },
//         err => console.error(`Error: ${err}`)
//       );
//     }
//   },
//   cancel() {
//     $video.pause();
//   }
// });

const writableStream = new WritableStream({
  start (controller) {
    console.error('start', controller);
  },

  write (chunk) {
    console.error('write', chunk);
  },

  cancel () {
    console.error('cancel');
  }
});

// const reader = readableStream.getReader();
// const writer = writableStream.getWriter();
//
// console.error('readableStream', readableStream);
// console.error('writableStream', writableStream);
// console.error('reader', reader);
// console.error('writer', writer);

// readableStream.pipeThrough(writableStream);

// async function read (reader) {
//   console.error('reader', reader);
//   console.error('reader.read 1', await reader.read());
//   console.error('reader.read 2', await reader.read());
//   console.error('reader.read 3', await reader.read());
//   console.error('reader.read 4', await reader.read());
// }
//
// read(reader);

function showVideo(){
  hideUI();
  showUI();
}

function showUI () {
  $video.classList.add('visible');
  $controls.classList.add('visible');
}

function hideUI(){
  $controls.classList.remove('visible');
  $video.classList.remove('visible');
}

$takePhoto.addEventListener('click', () => {
  const snap = takeSnapshot();

  // Show image.
  $image.setAttribute('src', snap);
  $image.classList.add('visible');

  // Enable delete and save buttons
  $deletePhoto.classList.remove("disabled");
  $downloadPhoto.classList.remove("disabled");

  // Set the href attribute of the download button to the snap url.
  $downloadPhoto.href = snap;

  // Pause video playback of stream.
  $video.pause();

});


$deletePhoto.addEventListener('click', () => {
  $image.setAttribute('src', '');
  $image.classList.remove('visible');

  // Disable delete and save buttons
  $deletePhoto.classList.add('disabled');
  $downloadPhoto.classList.add('disabled');

  $video.play();
});

function takeSnapshot(){
  // Here we're using a trick that involves a hidden canvas element.

  const $canvas = document.querySelector('canvas');
  const context = $canvas.getContext('2d');

  const width = $video.videoWidth;
  const height = $video.videoHeight;

  if (width && height) {
    // Setup a canvas with the same dimensions as the video.
    $canvas.width = width;
    $canvas.height = height;

    // Make a copy of the current frame in the video on the canvas.
    context.drawImage($video, 0, 0, width, height);

    // Turn the canvas image into a dataURL that can be used as a src for our photo.
    return $canvas.toDataURL('image/png');
  }
}

