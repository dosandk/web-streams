import TransformStream from './transform-stream.js';

function decoder () {
  const textDecoder = new TextDecoder();

  return new TransformStream({
    start () {
      console.log('Transformations started 🚀')
    },

    transform (chunk, controller) {
      const decodedChunk = textDecoder.decode(chunk, {stream: true});

      console.groupCollapsed('TransformStream');
      console.log('chunk', chunk);
      console.log('decodedChunk', decodedChunk);
      console.groupEnd();

      controller.enqueue(decodedChunk)
    }
  });
}

export default decoder;
