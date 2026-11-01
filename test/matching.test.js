import test from 'node:test';
import assert from 'node:assert/strict';
import { jobs, categories, questions, interests, mbtiTypes, values, environments } from '../data.js';
import { deriveType, makeProfile, rankJobs, scoreJob, sanitizeQuiz, isQuizComplete } from '../matching.js';

const answeredQuiz = overrides => ({
  answers: questions.map(() => 0), interests: ['I'], values: ['growth'], environments: [], knownType: '', ...overrides
});

test('catalogue contains 552 unique and complete occupational profiles in 30 fields', () => {
  assert.equal(jobs.length, 552);
  assert.equal(categories.length, 30);
  assert.equal(new Set(jobs.map(job => job.id)).size, jobs.length);
  assert.equal(new Set(jobs.map(job => job.title)).size, jobs.length);
  for (const job of jobs) {
    assert.ok(categories.some(category => category.id === job.category));
    assert.ok(job.description.length > 30);
    assert.ok(job.values.length && job.environments.length);
    assert.ok(job.values.every(id => values.some(v => v.id === id)));
    assert.ok(job.environments.every(id => environments.some(e => e.id === id)));
    assert.ok(job.types.every(type => mbtiTypes.includes(type)));
    assert.deepEqual(Object.keys(job.interests), interests.map(interest => interest.id));
    assert.ok(Object.values(job.interests).every(value => value >= 0 && value <= 1));
  }
});

test('MBTI is derived from answers, preserves tied axes, and supports a known type', () => {
  assert.equal(deriveType(questions.map(() => 0)), 'ESTJ');
  assert.equal(deriveType(questions.map(() => 1)), 'INFP');
  const seen = {};
  const mixed = questions.map(q => q.kind === 'personality' ? ((seen[q.axis] = (seen[q.axis] || 0) + 1) % 2) : 0);
  assert.equal(deriveType(mixed), 'XXXX');
  assert.equal(deriveType(mixed, 'INTP'), 'INTP');
  assert.equal(deriveType(mixed, 'INVALID'), 'XXXX');
});

test('explicitly chosen interests outweigh one scenario answer', () => {
  const profile = makeProfile(answeredQuiz({ interests: ['S'] }));
  assert.ok(profile.interests.S > profile.interests.R);
  assert.ok(profile.interests.S > profile.interests.E);
  assert.equal(Math.max(...Object.values(profile.interests)), 1);
});

test('a change from practical to creative interests changes the leading recommendations', () => {
  const practical = { interests: { R:1,I:.05,A:.05,S:.05,E:.05,C:.05 }, values:['structure'],environments:['hands'],type:'XXXX' };
  const creative = { interests: { R:.05,I:.05,A:1,S:.05,E:.05,C:.05 }, values:['creative'],environments:['screen'],type:'XXXX' };
  const rankedPractical = rankJobs(jobs,practical);
  const rankedCreative = rankJobs(jobs,creative);
  assert.notEqual(rankedPractical[0].id, rankedCreative[0].id);
  assert.ok(rankedPractical.slice(0,10).some(job => job.category === 'craft' || job.category === 'industry'));
  assert.ok(rankedCreative.slice(0,10).some(job => ['design','media','arts'].includes(job.category)));
});

test('ranking keeps every career and scores remain finite and bounded for all MBTI types', () => {
  for (const type of [...mbtiTypes, 'XXXX']) {
    const profile = makeProfile(answeredQuiz({ knownType: type }));
    const ranked = rankJobs(jobs,profile);
    assert.equal(ranked.length,jobs.length);
    assert.ok(ranked.every(job => Number.isFinite(job.match.score) && job.match.score >= 0 && job.match.score <= 100));
    assert.ok(ranked.every((job,i) => !i || ranked[i-1].match.score >= job.match.score));
  }
});

test('empty optional factors are omitted and remaining weights are normalized', () => {
  const profile = { interests: { R:1,I:0,A:0,S:0,E:0,C:0 }, values:[],environments:[],type:'XXXX' };
  const match = scoreJob(jobs.find(job => job.id === 'craft-1'),profile);
  assert.equal(match.score, 98);
  assert.equal(match.wishes,null);
  assert.equal(match.personality,null);
});

test('corrupt stored answers and unknown selections are rejected', () => {
  const safe = sanitizeQuiz({ answers:[-1,'1',200,{},null], interests:['Z','I','I','A','S','R'], values:['unknown'], environments:['moon','screen'], knownType:'<script>' });
  assert.ok(safe.answers.every(answer => answer === null));
  assert.deepEqual(safe.interests,['I','A','S']);
  assert.deepEqual(safe.values,[]);
  assert.deepEqual(safe.environments,['screen']);
  assert.equal(safe.knownType,'');
  assert.equal(isQuizComplete(safe),false);
  assert.equal(isQuizComplete(sanitizeQuiz(answeredQuiz())),true);
  assert.doesNotThrow(() => sanitizeQuiz(null));
});

test('quiz offers 24 questions, balanced MBTI axes and six-way scenarios', () => {
  assert.equal(questions.length, 24);
  for (const axis of ['EI','SN','TF','JP']) {
    const qs = questions.filter(q => q.axis === axis);
    assert.equal(qs.length, 4);
    for (const q of qs) {
      assert.ok(q.options.length >= 2);
      assert.equal(q.options[0][0], axis[0]);
      assert.equal(q.options[1][0], axis[1]);
      assert.ok(q.options.every(([letter]) => axis.includes(letter)));
    }
  }
  for (const q of questions.filter(q => q.kind === 'scenario')) {
    assert.deepEqual(q.options.map(([id]) => id).sort(), 'RIASEC'.split('').sort());
  }
});
