import TransformStream from './transform-stream.js';

function decoder () {
  const textDecoder = new TextDecoder();

  return new TransformStream({
    transform (chunk, controller) {
      const decodedChunk = textDecoder.decode(chunk, {stream: true});

      console.error('decodedChunk');

      controller.enqueue(decodedChunk)
    }
  });
}

export default decoder;
