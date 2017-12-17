const stream = new ReadableStream({
  start (controller) {

  },
  pull (controller) {
    /*
    * If an outside consumer continues to call reader.read()
    * and the stream does not have enough queued data in the underlying source,
    * your pull() method is invoked
    *
    * */
  },
  cancel () {
    /*
    * cancel() – Cancels the stream to signal a loss of interest
    * Inside a pull() method, your stream has the option to enqueue more data, close the stream, or do nothing.
    * */
  },
  type,
  autoAllocateChunkSize
}, {
  highWaterMark,
  size
});

// start(controller) — A method that is called once, immediately after the ReadableStream is constructed. Inside this method, you should include code that sets up the stream functionality, e.g. beginning generation of data or otherwise getting access to the source.
// pull(controller) — A method that, when included, is called repeatedly until the stream’s internal queue is full. This can be used to control the stream as more chunks are enqueued.
// cancel() — A method that, when included, will be called if the app signals that the stream is to be cancelled (e.g. if ReadableStream.cancel() is called). The contents should do whatever is necessary to release access to the stream source.
//   type and autoAllocateChunkSize — These are used — when included — to signify that the stream is to be a bytestream. Bytestreams will be covered separately in a future tutorial, as they are somewhat different in purpose and use case to regular (default) streams.


// Pull vs Push
// If you proactively enqueue data from within the start() method, your stream resembles a push source. You may wish to proactively enqueue data if you’re certain it will all be read by a consumer.
// If you only enqueue data into the stream when then pull() method is invoked, your stream resembles a pull source.
