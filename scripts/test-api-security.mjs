import assert from 'node:assert/strict';

const base = process.env.BASE_URL || 'http://localhost:3000';
const cases = [
  ['/api/health', 'GET', undefined, 200],
  ['/api/db/sync?userId=someone-else', 'GET', undefined, 401],
  ['/api/db/sync', 'POST', { userId: 'someone-else', resumes: [] }, 401],
  ['/api/auth/record', 'POST', { userId: 'someone-else', action: 'login' }, 401],
  ['/api/ai/resume', 'POST', null, 400],
];

for (const [path, method, body, expected] of cases) {
  const response = await fetch(`${base}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    ...(method === 'POST' ? { body: JSON.stringify(body) } : {}),
    signal: AbortSignal.timeout(15000),
  });
  assert.equal(response.status, expected, `${method} ${path}`);
  assert.match(response.headers.get('content-type'), /application\/json/);
  console.log(`PASS ${method} ${path}: ${expected}`);
}
