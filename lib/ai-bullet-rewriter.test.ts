import test from 'node:test';
import assert from 'node:assert/strict';
import { upgradeBulletsToImpactStyle } from './ai-bullet-rewriter';

test('upgradeBulletsToImpactStyle replaces weak prefixes with strong action verbs and preserves metrics', () => {
  const input = [
    'Worked on backend microservices for 120K daily users',
    'Responsible for weekly sprint planning across 8 engineers',
  ];
  const result = upgradeBulletsToImpactStyle(input, {
    roleTitle: 'Senior Software Engineer',
    company: 'Apex Cloud',
    tone: 'impact_xyz',
  });

  assert.equal(result.bullets.length, 2);
  assert.equal(result.bulletComparisons.length, 2);
  assert.match(result.bullets[0], /^Engineered and delivered backend microservices for 120K daily users/);
  assert.match(result.bullets[1], /^Spearheaded and directed weekly sprint planning across 8 engineers/);
  assert.equal(result.bulletComparisons[0].actionVerb, 'Engineered');
  assert.equal(result.bulletComparisons[1].actionVerb, 'Spearheaded');
});

test('upgradeBulletsToImpactStyle adapts verbs and framing for executive and technical tones', () => {
  const input = ['Led cloud migration project'];
  const execResult = upgradeBulletsToImpactStyle(input, {
    roleTitle: 'VP of Engineering',
    company: 'Global Systems',
    tone: 'executive',
  });
  const techResult = upgradeBulletsToImpactStyle(input, {
    roleTitle: 'Staff Engineer',
    company: 'Global Systems',
    tone: 'technical',
  });

  assert.equal(execResult.bulletComparisons[0].actionVerb, 'Directed');
  assert.equal(techResult.bulletComparisons[0].actionVerb, 'Engineered');
  assert.notEqual(execResult.bullets[0], techResult.bullets[0]);
});

test('upgradeBulletsToImpactStyle generates starter bullets when input is empty', () => {
  const result = upgradeBulletsToImpactStyle([], {
    roleTitle: 'Product Manager',
    company: 'Nova Labs',
  });

  assert.equal(result.bullets.length, 2);
  assert.ok(result.bullets[0].includes('Product Manager'));
  assert.ok(result.bullets[0].includes('Nova Labs'));
  assert.ok(result.missingInfoQuestions.length >= 1);
});
