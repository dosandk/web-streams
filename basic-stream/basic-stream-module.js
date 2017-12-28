import streamAsyncIterator from './stream-async-iterator.js';
import decoder from './text-decoder.js';

const makeRequest = async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/photos/');
  // {
  //   done: Boolean, // Is this the end of the source’s data?
  //   value: Uint8Array // Could be anything, Uint8Array in our case
  // }
  response.body
    .pipeThrough(decoder())
    .pipeTo(writer);

  // for await (const value of streamAsyncIterator(stream)) {
  //   console.log('value', value);
  // }
};

window.onload = function () {
  this.makeRequest = makeRequest;
};

const writer = new WritableStream({
  write (chunk) {
    // const decoder = new TextDecoder();
    // document.body.innerHTML += decoder.decode(chunk, {stream: true})
    console.log('write chunk');
  },
  // When its finished,
  close () {
    // Make a note of how long it took from getting the stream, to rendering it.
    console.log('Stream closed!')
  }
});
