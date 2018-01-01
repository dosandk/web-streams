//
// loads remote file using fetch() streams and "pipe" it to webaudio API
// remote file must have CORS enabled if on another domain
//
// mostly from http://stackoverflow.com/questions/20475982/choppy-inaudible-playback-with-chunked-audio-through-web-audio-api
//



function play(url) {
  var context = new (window.AudioContext || window.webkitAudioContext)();
  var audioStack = [];
  var nextTime = 0;


  fetch(url).then(function(response) {
    console.error('response', response);
    console.error('response.body', response.body);
    var reader = response.body.getReader();

    function read() {
      return reader.read().then(({ value, done })=> {
        context.decodeAudioData(value.buffer, function(buffer) {
          audioStack.push(buffer);
          if (audioStack.length) {
            scheduleBuffers();
          }
        }, function(err) {
          console.log("err(decodeAudioData): "+err);
        });
        if (done) {
          console.log('done');
          return;
        }
        read()
      });
    }
    read();
  })



  function scheduleBuffers() {
    while ( audioStack.length) {
      var buffer    = audioStack.shift();
      var source    = context.createBufferSource();
      source.buffer = buffer;
      source.connect(context.destination);
      if (nextTime == 0)
        nextTime = context.currentTime + 0.01;  /// add 50ms latency to work well across systems - tune this if you like
      source.start(nextTime);
      nextTime += source.buffer.duration; // Make the next buffer wait the length of the last buffer before being played
    };
  }
}



var url = 'https://upload.wikimedia.org/wikipedia/commons/4/45/J.S.Bach_%E2%80%93_BWV_578.oga'
play(url);

