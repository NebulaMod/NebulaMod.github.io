const supertest = require('supertest');
const app = require('../src/server');
const request = supertest(app);

it('defaults to no-cache', async () => {
  return request.get('/')
    .set('Host', 'localhost')
    .expect('Cache-Control', 'no-cache');
});

it('serves JS with long-term caching', async () => {
  return request.get('/js/long-term-cached.js')
    .set('Host', 'localhost')
    .expect('Cache-Control', /immutable/)
    .expect('long-term-cached.js (no encoding)');
});

it('serves JS with long-term caching in branches', async () => {
  return request.get('/test-branch/js/long-term-cached.js')
    .set('Host', 'example.com')
    .expect('Cache-Control', /immutable/)
    .expect('test-branch long-term-cached.js (no encoding)');
});

it('does not cache 404', async () => {
  return request.get('/js/sdlkjfsljdkfjslkd.js')
    .set('Host', 'localhost')
    .expect(404)
    .expect('Cache-Control', 'no-cache');
});
