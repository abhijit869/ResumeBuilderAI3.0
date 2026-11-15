import test from 'node:test';
import assert from 'node:assert/strict';

test('Firebase failures never create local identities or simulate reset success', async (t) => {
  let error = 'PASSWORD_LOGIN_DISABLED';
  t.mock.method(globalThis, 'fetch', async () => Response.json({ error: { code: 400, message: error } }, { status: 400 }));
  const { signInUser, signUpUser, sendPasswordReset } = await import('./auth-service');
  const email = 'auth-regression@example.invalid';
  const password = 'RegressionPassword42!';
  await assert.rejects(signUpUser(email, password, 'Regression'), /operation-not-allowed/);
  await assert.rejects(signInUser(email, password), /operation-not-allowed/);
  error = 'INVALID_LOGIN_CREDENTIALS';
  await assert.rejects(signInUser(email, password), /invalid-credential/);
  error = 'OPERATION_NOT_ALLOWED';
  await assert.rejects(sendPasswordReset(email), /operation-not-allowed/);
});

test('unsupported social sign-in does not return a fabricated user', async () => {
  const { signInWithGoogle, signInWithGithub, signInWithLinkedIn } = await import('./auth-service');
  for (const signIn of [signInWithGoogle, signInWithGithub, signInWithLinkedIn]) {
    await assert.rejects(signIn(), /operation-not-supported/);
  }
});

test('auth subscription reports signed out without a Firebase user', async () => {
  const { subscribeToAuthChanges } = await import('./auth-service');
  const profile = await new Promise<unknown>((resolve) => {
    const unsubscribe = subscribeToAuthChanges((user) => {
      resolve(user);
      unsubscribe();
    });
  });
  assert.equal(profile, null);
});
