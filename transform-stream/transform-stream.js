class TransformStream {
  constructor() {
    let readableController;
    let writableController;

    this.readable = new ReadableStream({
      start (controller) {
        console.error('readable start');
        readableController = controller;
      },
      cancel (reason) {
        console.error('readable cancel');
        writableController.error(reason);
      }
    });

    this.writable = new WritableStream({
      start (controller) {
        console.error('writable start');
        writableController = controller;
      },
      write (chunk) {
        console.error('writable write');
        readableController.enqueue(chunk);
      },
      close () {
        console.error('writable close');
        readableController.close();
      },
      abort (reason) {
        console.error('writable abort');
        readableController.error(reason);
      }
    });
  }
}
