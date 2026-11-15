import test from 'node:test';
import assert from 'node:assert/strict';
import {
  classifyDeviceEnvironment,
  computeAdaptiveStyleTokens,
  diagnoseClientEnvironment,
} from './self-healing-engine';

test('classifyDeviceEnvironment categorizes all standard device form factors', () => {
  assert.equal(classifyDeviceEnvironment(375), 'mobile');
  assert.equal(classifyDeviceEnvironment(414), 'mobile');
  assert.equal(classifyDeviceEnvironment(768), 'tablet');
  assert.equal(classifyDeviceEnvironment(1024), 'laptop');
  assert.equal(classifyDeviceEnvironment(1366), 'laptop');
  assert.equal(classifyDeviceEnvironment(1440), 'desktop');
  assert.equal(classifyDeviceEnvironment(1920), 'desktop');
  assert.equal(classifyDeviceEnvironment(2560), 'ultrawide');
});

test('computeAdaptiveStyleTokens enforces touch target minimums and font scale by device', () => {
  const mobileTokens = computeAdaptiveStyleTokens('mobile', 'light');
  assert.equal(mobileTokens.touchTargetMinPx, 44);
  assert.ok(mobileTokens.fontSizeScale < 1.0);

  const desktopTokens = computeAdaptiveStyleTokens('desktop', 'light');
  assert.ok(desktopTokens.fontSizeScale >= 1.0);
  assert.equal(desktopTokens.touchTargetMinPx, 38);
});

test('computeAdaptiveStyleTokens dynamically computes high-contrast WCAG AAA tokens for light and dark modes', () => {
  const lightTokens = computeAdaptiveStyleTokens('laptop', 'light', false);
  assert.equal(lightTokens.textPrimary, '#0F172A');
  assert.equal(lightTokens.surfaceBg, '#FAF9F6');

  const darkTokens = computeAdaptiveStyleTokens('laptop', 'dark', false);
  assert.equal(darkTokens.textPrimary, '#F8FAFC');
  assert.equal(darkTokens.surfaceBg, '#0B0F19');

  const boostedDark = computeAdaptiveStyleTokens('laptop', 'dark', true);
  assert.equal(boostedDark.textPrimary, '#FFFFFF');
  assert.equal(boostedDark.surfaceBg, '#000000');
});

test('diagnoseClientEnvironment provides graceful fallback for SSR and node environments', () => {
  const diagnosis = diagnoseClientEnvironment();
  assert.equal(diagnosis.blurDefenseActive, true);
  assert.ok(Array.isArray(diagnosis.healingApplied));
  assert.equal(typeof diagnosis.devicePixelRatio, 'number');
});
