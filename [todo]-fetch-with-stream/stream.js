const fetchWithStream = async url => {
  const response = await fetch(url, {mode: 'no-cors'});
  const reader = response.body.getReader();
  const contentLength = response.headers.get('Content-Length');
  const resourceSize = parseInt(contentLength, 10);

  console.error('response', response);
  console.error('response.headers', response.headers);
  console.error('contentLength', contentLength);
  console.error('resourceSize', resourceSize);

  async function read(reader, totalChunkSize = 0, chunkCount = 0) {
    const {value: {length} = {}, done} = await reader.read();

    if (done) {
      return chunkCount;
    }

    const runningTotal = totalChunkSize + length;
    const percentComplete = Math.round((runningTotal / resourceSize) * 100);

    const progress = `${percentComplete}% (chunk ${chunkCount})`;

    console.log(progress);
    document.body.innerHTML += progress + '<br />';

    return read(reader, runningTotal, chunkCount + 1);
  }

  const chunkCount = await read(reader);
  console.log(`Finished! Received ${chunkCount} chunks.`);
};
