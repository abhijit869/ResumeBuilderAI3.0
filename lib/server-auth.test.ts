import test from 'node:test';
import assert from 'node:assert/strict';
import { authenticateRequest } from './server-auth';

test('authentication rejects missing credentials', async () => {
  const result = await authenticateRequest(new Request('http://localhost'));
  assert.ok(result instanceof Response);
  assert.equal(result.status, 401);
});

test('authentication verifies tokens and fails closed', async (t) => {
  const request = () => new Request('http://localhost', { headers: { Authorization: 'Bearer test-token' } });
  const mock = t.mock.method(globalThis, 'fetch', async (_input: unknown, init?: RequestInit) => {
    assert.equal(JSON.parse(init?.body as string).idToken, 'test-token');
    return Response.json({ users: [{ localId: 'verified-uid' }] });
  });
  assert.deepEqual(await authenticateRequest(request()), { uid: 'verified-uid' });
  mock.mock.mockImplementation(async () => Response.json({}, { status: 400 }));
  assert.equal((await authenticateRequest(request()) as Response).status, 401);
  mock.mock.mockImplementation(async () => Response.json({ users: [{ localId: 'disabled', disabled: true }] }));
  assert.equal((await authenticateRequest(request()) as Response).status, 401);
  mock.mock.mockImplementation(async () => { throw new Error('offline'); });
  assert.equal((await authenticateRequest(request()) as Response).status, 503);
});
