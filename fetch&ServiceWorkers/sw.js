self.addEventListener('install', event => console.error('install', event));
self.addEventListener('activate', event => console.error('activate', event));
self.addEventListener('fetch', event => {
  const {request} = event;
  const {headers} = request;

  console.error('event', event);
  console.error('headers', headers);

  if (new URL(request.url).host === 'jsonplaceholder.typicode.com') {
    const headers = new Headers({'Content-Type': 'application/json'});
    const response = new Response(JSON.stringify({message: 'Hello World!'}), {headers});

    event.respondWith(Promise.resolve(response));
  }
});
