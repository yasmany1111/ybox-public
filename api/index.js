import { Router } from 'itty-router';
import { handle, handleOptions, getAuth, readRequestBody } from './handle.js';

const router = Router();

// TODO: Use headers, JWT tokens to validate
router.get('/key/:keyName', async (request) => {
  let getResponse = await KNOWLEDGE_BOX.get(`${request.params.keyName}`);

  if (getResponse && getResponse.length) {
    getResponse = JSON.parse(getResponse);
  }

  return handle({
    content: getResponse || null,
  });
});

router.post('/key/:keyName', async (request) => {
  const postBody = await request.json();

  const putResponse = await KNOWLEDGE_BOX.put(
    `${request.params.keyName}`,
    JSON.stringify(postBody.content)
  );

  return handle({
    message: 'created',
    body: postBody,
  });
});

router.all('*', () => new Response('404', { status: 404 }));

addEventListener('fetch', (e) => {
  if (e.request.method === 'OPTIONS') {
    // Handle CORS preflight requests
    e.respondWith(handleOptions(e.request));

    return;
  }

  e.respondWith(router.handle(e.request));
});
