const countStrategy = new CountQueuingStrategy({
  highWaterMark: 2 // high water mark which specifies the maximum total size of all chunks in a queue
});

const stream = new WritableStream({
  start (controller) {

  },
  write (chunk,controller) {

  },
  close (controller) {

  },
  abort (reason) {

  }
}, countStrategy);

// start(controller) — A method that is called once, immediately after the WritableStream is constructed. Inside this method, you should include code that sets up the stream functionality, e.g. getting access to the underlying sink.
// write(chunk,controller) — A method that is called repeatedly every time a new chunk is ready to be written to the underlying sink (specified in the chunk parameter).
// close(controller) — A method that is called if the app signals that it has finished writing chunks to the stream. It should do whatever is necessary to finalize writes to the underlying sink, and release access to it.
// abort(reason) — A method that will be called if the app signals that it wishes to abruptly close the stream and put it in an errored state.


/*
    The second argument to the WritableStream constructor is the
    QueuingStrategy.
  */
const backpressure = new CountQueuingStrategy({ highWaterMark: 1000 })
