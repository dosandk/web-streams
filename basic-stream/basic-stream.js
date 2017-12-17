const makeRequest = async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/photos/');
  const decoder = new TextDecoder();
  const reader = response.body.getReader();

  read (reader, decoder);
};

async function read (reader, decoder) {
  const doNext = async reader => {
    const {done, value} = await reader.read();

    if (done) return;

    console.error(decoder.decode(value, {stream: true}));

    doNext(reader);
  };

  doNext(reader);
}
