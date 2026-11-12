const { test, before, after } = require('node:test');
const assert = require('node:assert');
const app = require('../src/app');

let server;
let baseUrl;

before(() => {
  server = app.listen(0);
  baseUrl = `http://localhost:${server.address().port}`;
});

after(() => server.close());

test('GET / returns hello message', async () => {
  const res = await fetch(`${baseUrl}/`);
  assert.strictEqual(res.status, 200);
  const body = await res.json();
  assert.match(body.message, /Hello/);
});

test('GET /health returns ok', async () => {
  const res = await fetch(`${baseUrl}/health`);
  assert.strictEqual(res.status, 200);
  assert.strictEqual((await res.json()).status, 'ok');
});

test('POST /todos creates a todo', async () => {
  const res = await fetch(`${baseUrl}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'Deploy it' }),
  });
  assert.strictEqual(res.status, 201);
  assert.strictEqual((await res.json()).title, 'Deploy it');
});

test('POST /todos without title returns 400', async () => {
  const res = await fetch(`${baseUrl}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  assert.strictEqual(res.status, 400);
});
