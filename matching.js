import { interests, mbtiTypes, questions, values as valueList, environments as environmentList } from './data.js';

const scenarioCount = questions.filter(q => q.kind === 'scenario').length || 1;

export function deriveType(answers, knownType = '') {
  if (mbtiTypes.includes(knownType)) return knownType;
  return ['EI', 'SN', 'TF', 'JP'].map(axis => {
    const selected = questions.flatMap((q, i) => q.axis === axis && q.options[answers[i]] ? [q.options[answers[i]][0]] : []);
    const left = selected.filter(value => value === axis[0]).length;
    const right = selected.filter(value => value === axis[1]).length;
    return left === right ? 'X' : left > right ? axis[0] : axis[1];
  }).join('');
}

export function makeProfile(quiz) {
  const scores = Object.fromEntries(interests.map(({ id }) => [id, .25]));
  questions.forEach((q, i) => {
    if (q.kind === 'scenario' && q.options[quiz.answers[i]]) scores[q.options[quiz.answers[i]][0]] += .8 / scenarioCount;
  });
  for (const id of quiz.interests) if (id in scores) scores[id] += .65;
  const max = Math.max(...Object.values(scores));
  for (const id of Object.keys(scores)) scores[id] /= max;
  return { interests: scores, values: quiz.values, environments: quiz.environments, type: deriveType(quiz.answers, quiz.knownType) };
}

export function scoreJob(job, profile) {
  // 60 % Interessen, 25 % Arbeitswünsche (Werte + Umgebung), maximal 15 % MBTI-Impuls.
  const totalInterest = Object.values(profile.interests).reduce((a, b) => a + b, 0);
  const interest = Object.entries(profile.interests).reduce((sum, [id, value]) => sum + value * job.interests[id], 0) / (totalInterest || 1);
  const value = profile.values.length ? profile.values.filter(v => job.values.includes(v)).length / profile.values.length : null;
  const environment = profile.environments.length ? profile.environments.filter(v => job.environments.includes(v)).length / profile.environments.length : null;
  const preferences = [value, environment].filter(v => v !== null);
  const wishes = preferences.length ? preferences.reduce((a, b) => a + b, 0) / preferences.length : null;
  const axes = profile.type.split('').map((letter, i) => ({ letter, i })).filter(({ letter }) => letter !== 'X');
  const personality = axes.length ? Math.max(...job.types.map(type => axes.filter(({ letter, i }) => type[i] === letter).length / axes.length)) : null;
  const parts = [[interest, .6], [wishes, .25], [personality, .15]].filter(([v]) => v !== null);
  const score = Math.round(100 * parts.reduce((sum, [v, weight]) => sum + v * weight, 0) / parts.reduce((sum, [, weight]) => sum + weight, 0));
  const strongest = Object.keys(profile.interests).sort((a, b) => profile.interests[b] * job.interests[b] - profile.interests[a] * job.interests[a]).slice(0, 2);
  return { score, interest: Math.round(interest * 100), wishes: wishes === null ? null : Math.round(wishes * 100), personality: personality === null ? null : Math.round(personality * 100), strongest };
}

export function rankJobs(jobs, profile) {
  return jobs.map(job => ({ ...job, match: scoreJob(job, profile) })).sort((a, b) => b.match.score - a.match.score || a.title.localeCompare(b.title, 'de'));
}

export function isQuizComplete(quiz) {
  return questions.every((q, i) => Number.isInteger(quiz.answers[i]) && !!q.options[quiz.answers[i]]) && quiz.interests.length > 0 && quiz.values.length > 0;
}

export function sanitizeQuiz(value) {
  const list = (input, allowed, max) => Array.isArray(input) ? [...new Set(input.filter(v => allowed.includes(v)))].slice(0, max) : [];
  return {
    answers: questions.map((q, i) => Number.isInteger(value?.answers?.[i]) && q.options[value.answers[i]] ? value.answers[i] : null),
    interests: list(value?.interests, 'RIASEC'.split(''), 3),
    values: list(value?.values, valueList.map(v => v.id), 3),
    environments: list(value?.environments, environmentList.map(e => e.id), environmentList.length),
    knownType: mbtiTypes.includes(value?.knownType) ? value.knownType : ''
  };
}
