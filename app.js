import { jobs, categories, interests, values, environments, questions, mbtiTypes, typeNames } from './data.js';
const Q = questions.length; // Anzahl Fragen; danach folgen Interessen, Werte und Umgebungen.
const TOTAL_STEPS = Q + 3;
import { makeProfile, rankJobs, scoreJob, isQuizComplete, sanitizeQuiz } from './matching.js';

const paths = {
  'arrow-up-right': '<path d="M7 17 17 7M7 7h10v10"/>', arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
  back: '<path d="M20 12H4m6-6-6 6 6 6"/>', check: '<path d="m5 12 4 4L19 6"/>', x: '<path d="m6 6 12 12M6 18 18 6"/>',
  bookmark: '<path d="M6 4h12v17l-6-4-6 4V4Z"/>', search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
  code: '<path d="m8 7-5 5 5 5m8-10 5 5-5 5M14 4l-4 16"/>', pen: '<path d="m15 4 5 5M4 20l5-1L21 7l-5-5L4 14v6Z"/>',
  heart: '<path d="M20.5 5.5a5 5 0 0 0-7 0L12 7l-1.5-1.5a5 5 0 0 0-7 7L12 21l8.5-8.5a5 5 0 0 0 0-7Z"/>',
  users: '<circle cx="9" cy="8" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3M16 5a3 3 0 0 1 0 6m2 4c2 .5 3 2 3 4v2"/>',
  tool: '<path d="M14 6a5 5 0 0 0-6 6L2 18a3 3 0 0 0 4 4l6-6a5 5 0 0 0 6-6l-3 3-4-4 3-3Z" transform="translate(1 -2)"/>',
  flask: '<path d="M9 3h6M10 3v6L4 19a1.5 1.5 0 0 0 1.3 2h13.4a1.5 1.5 0 0 0 1.3-2L14 9V3M7 15h10"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  sparkles: '<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3ZM20 2v4m-2-2h4"/>',
  plant: '<path d="M12 21v-9M12 15C4 16 3 12 3 7c6 0 9 2 9 8ZM12 12c0-6 3-9 9-9 0 6-3 9-9 9ZM6 21h12"/>',
  leaf: '<path d="M20 3C7 2 2 8 5 15s16 5 15-12ZM4 21 15 10"/>',
  rocket: '<path d="M14 4c3-2 7-2 7-2s0 4-2 7l-8 8-5-5 8-8ZM6 12H2l4-6h6m-1 11v5l6-4v-7M4 16l-2 6 6-2"/><circle cx="16" cy="7" r="1"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="m16 8-2.5 5.5L8 16l2.5-5.5L16 8Z"/>',
  shuffle: '<path d="M3 5h3l12 14h3m-4-4 4 4-4 4M3 19h3l4-5m4-5 4-4h3m-4-4 4 4-4 4"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 1v2m0 18v2M1 12h2m18 0h2M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2"/>',
  type: '<path d="M4 6V3h16v3M12 3v18m-4 0h8"/>', coffee: '<path d="M3 8h14v6a6 6 0 0 1-6 6H9a6 6 0 0 1-6-6V8ZM17 9h2a3 3 0 0 1 0 6h-2M6 2v2m4-2v2m4-2v2M2 23h17"/>',
  settings: '<circle cx="12" cy="12" r="4"/><path d="m10 2-.5 3-2 1-3-.5-2 3 2 2v3l-2 2 2 3 3-.5 2 1 .5 3h4l.5-3 2-1 3 .5 2-3-2-2v-3l2-2-2-3-3 .5-2-1-.5-3h-4Z"/>',
  building: '<path d="M4 21V3h12v18M16 9h5v12M2 21h21M8 7h4M8 11h4M8 15h4M9 21v-3h3v3"/>',
  chart: '<path d="M3 3v18h19M7 16l5-6 4 3 6-9m-5 0h5v5"/>',
  megaphone: '<path d="m3 9 16-6v18L3 15V9Zm0 3H1m5 4 2 6h4l-2-5M22 9v6"/>',
  shield: '<path d="m12 2 9 4v6c0 6-9 10-9 10S3 18 3 12V6l9-4Z"/><path d="m8 12 3 3 5-6"/>',
  truck: '<path d="M1 5h13v12H1V5Zm13 4h5l4 4v4h-9"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="18" r="3"/>',
  music: '<path d="M9 18V5l12-3v13M9 9l12-3"/><ellipse cx="6" cy="18" rx="3" ry="3"/><ellipse cx="18" cy="15" rx="3" ry="3"/>',
  activity: '<path d="M1 12h5l3-9 6 18 3-9h5"/>',
  factory: '<path d="M3 21V10l6 4V8l7 5V3h4l2 18H3ZM6 18h2m3 0h2m3 0h2"/>',
  bag: '<path d="M4 7h16l1 14H3L4 7Zm4 2V5a4 4 0 0 1 8 0v4"/>',
  film: '<rect x="2" y="6" width="14" height="12" rx="2"/><path d="m16 10 6-3v10l-6-3"/>',
  anchor: '<circle cx="12" cy="5" r="2"/><path d="M12 7v14M8 11h8M4 13a8 8 0 0 0 16 0"/>',
  scissors: '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4 8.1 15.9M14.5 14.5 20 20M8.1 8.1 12 12"/>',
  landmark: '<path d="M3 21h18M5 21V10m4 11V10m6 11V10m4 11V10M2 10l10-7 10 7Z"/>',
  pulse: '<path d="M3 12h4l3-8 4 16 3-8h4"/>',
  bolt: '<path d="m13 1-9 13h7l-1 9L21 9h-8l0-8Z"/>',
  globe: '<circle cx="12" cy="12" r="10"/><ellipse cx="12" cy="12" rx="4" ry="10"/><path d="M2 12h20M4 6h16M4 18h16"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  lock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V6a4 4 0 0 1 8 0v4M12 14v3"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v.5"/>',
  download: '<path d="M12 3v12m-5-5 5 5 5-5M3 16v5h18v-5"/>'
};
const icon = (name, cls = '') => `<svg class="icon ${cls}" viewBox="0 0 24 24" aria-hidden="true">${paths[name] || paths.sparkles}</svg>`;
const esc = value => String(value).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
const hydrateIcons = (root = document) => root.querySelectorAll('[data-icon]').forEach(el => { el.innerHTML = icon(el.dataset.icon); });
const main = document.querySelector('main');
const dialog = document.querySelector('dialog');
const storageKey = 'jobkompass:v1';
let storageAvailable = true;
function readSavedState() { try { return JSON.parse(localStorage.getItem(storageKey)) || {}; } catch { storageAvailable = false; return {}; } }
const saved = readSavedState();
let quiz = sanitizeQuiz(saved.quiz);
let quizStep = Number.isInteger(saved.step) ? Math.min(Q + 2, Math.max(0, saved.step)) : 0;
let bookmarks = new Set(Array.isArray(saved.bookmarks) ? saved.bookmarks.filter(id => jobs.some(job => job.id === id)) : []);
let profile = isQuizComplete(quiz) ? makeProfile(quiz) : null;
let filters = { search: '', category: 'all', sort: 'default', limit: 12 };
let homeCategory = 'all';
let toastTimer;

function persist() {
  try { localStorage.setItem(storageKey, JSON.stringify({ quiz, step: quizStep, bookmarks: [...bookmarks] })); }
  catch { storageAvailable = false; notify('Dein Browser erlaubt kein Speichern. Deine Auswahl bleibt für diese Sitzung erhalten.'); }
}
function notify(message) {
  const toast = document.querySelector('.toast');
  clearTimeout(toastTimer); toast.textContent = message; toast.classList.add('show');
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3500);
}
function updateBookmarkCount() {
  document.querySelectorAll('.saved-count').forEach(el => { el.textContent = bookmarks.size; });
  document.querySelector('.saved-link').setAttribute('aria-label', `Merkliste (${bookmarks.size} ${bookmarks.size === 1 ? 'Beruf' : 'Berufe'})`);
}
function getCategory(job) { return categories.find(category => category.id === job.category); }
function getRoute() { const route = location.hash.slice(1) || 'home'; return ['home','explore','saved','quiz','results','how'].includes(route) ? route : 'home'; }
function navigate(route) { if (location.hash === `#${route}`) render(); else location.hash = route; }

function card(job) {
  const category = getCategory(job);
  const isSaved = bookmarks.has(job.id);
  const tags = Object.entries(job.interests).sort((a, b) => b[1] - a[1]).slice(0, 2).map(([id]) => interests.find(i => i.id === id).title.split(' & ')[0]);
  return `<article class="job-card" data-job-card="${job.id}">
    <div class="card-top"><span class="job-icon ${category.color}">${icon(category.icon)}</span>
      <button class="icon-button bookmark-button ${isSaved ? 'saved' : ''}" data-bookmark="${job.id}" aria-label="${esc(job.title)} ${isSaved ? 'aus Merkliste entfernen' : 'merken'}" aria-pressed="${isSaved}">${icon('bookmark')}</button>
    </div>
    <div class="eyebrow">${category.name}</div>
    <h3><button class="card-title-button" data-detail="${job.id}">${job.title}</button></h3>
    <p>${job.description}</p>
    <div class="card-bottom">${job.match ? `<span class="match">${job.match.score} / 100 <span style="font-weight:400;font-size:9px">Orientierungswert</span></span>` : `<div class="card-tags">${tags.map(tag => `<span>${tag}</span>`).join('')}</div>`}
    <button class="card-arrow" data-detail="${job.id}" aria-label="Details zu ${esc(job.title)}">${icon('arrow-up-right')}</button></div>
  </article>`;
}

function heroArt() {
  return `<div class="hero-art" aria-hidden="true">
    <div class="art-backdrop"></div><div class="art-grid"></div><div class="orbit"></div>
    <div class="hero-job"><div class="hero-job-visual"><div class="art-window-dots"><i></i><i></i><i></i></div>
      <svg viewBox="0 0 300 205" fill="none">
        <path d="M239 15v32m-16-16h32M44 139v20m-10-10h20" stroke="#8c819f" stroke-width="1.3"/>
        <path d="m229 92 24 8-18 18-6-26Z" fill="#efdd9c" stroke="#29332d" stroke-width="1.5"/>
        <ellipse cx="149" cy="204" rx="88" ry="18" fill="#c8bdd9"/>
        <path d="M78 205c0-56 15-89 67-89 49 0 79 29 85 89" fill="#333d35" stroke="#29332d" stroke-width="2"/>
        <path d="m124 121 20 30 24-31" fill="#f6f5ef" stroke="#29332d" stroke-width="2"/>
        <path d="m137 115 1-25h26v31c-7 16-19 15-27-6Z" fill="#efbc99" stroke="#29332d" stroke-width="2"/>
        <path d="M102 65c-5-37 70-56 91-9 5 13-9 22-12 32l-72 5-7-28Z" fill="#d55b42" stroke="#29332d" stroke-width="2"/>
        <path d="M115 59c9 3 28 0 42-16 4 14 13 22 25 25v26c-4 27-17 37-34 35-24-3-34-21-33-47V59Z" fill="#f0c4a5" stroke="#29332d" stroke-width="2"/>
        <path d="M115 78c-15-10-20 8-9 16l9 1" fill="#f0c4a5" stroke="#29332d" stroke-width="2"/>
        <path d="M134 79v6m29-6v6m-17-3-3 14h7m-15 8c8 8 17 8 23-1" stroke="#29332d" stroke-width="2.3" stroke-linecap="round"/>
        <path d="m105 170 53 11 35-24 18 48H93l12-35Z" fill="#e5ecca" stroke="#29332d" stroke-width="2"/>
        <path d="m105 170 47 24 41-37M151 194v11" stroke="#29332d" stroke-width="1.5"/>
        <path d="M51 93c-2-10-15-14-23-5s-1 26 12 25c10-1 12-11 6-14-9-4-15 7-8 10" stroke="#8c819f" stroke-width="1.5" stroke-linecap="round"/>
        <path d="m218 160 8-4 8 4-8 4-8-4ZM226 156v-14" stroke="#29332d" stroke-width="1.5"/>
      </svg></div>
      <div class="hero-job-content"><div class="eyebrow">Das könnte dein Ding sein</div><h3>UX/UI-Designer/in</h3><div class="art-tags"><span>Kreativer Kopf</span><span>Digital unterwegs</span></div><div class="hero-job-bottom"><span>Ein Beruf. Viele Möglichkeiten.</span>${icon('arrow-up-right')}</div></div>
    </div>
    <div class="art-float art-float-one"><span class="float-icon">${icon('sparkles')}</span><div><strong>Hallo, Potenzial!</strong><small>Da steckt mehr in dir.</small></div></div>
    <div class="art-float art-float-two"><span class="float-icon">${icon('check')}</span><div><strong>Fühlt sich nach dir an.</strong><small>Und darum geht’s.</small></div></div>
    <svg class="art-star" viewBox="0 0 100 100" fill="currentColor"><path d="m50 0 8 32 25-20-16 29 33 9-33 8 16 30-25-20-8 32-8-32-25 20 16-30L0 50l33-9-16-29 25 20L50 0Z"/></svg>
    <div class="art-note">KEIN PLAN?<br>GUTER<br>ANFANG.</div>
    <svg class="art-arrow" viewBox="0 0 120 70" fill="none"><path d="M4 12c35 49 77 26 54 10-25-18-41 32 52 32m-13-14 13 14-17 9" stroke="#667958" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>
    <span class="art-caption">Weniger „Was jetzt?“, mehr „Das bin ich.“</span>
  </div>`;
}

function homeJobs() {
  const featured = ['design-1','digital-6','health-2','nature-1','craft-1','marketing-2'];
  return homeCategory === 'all' ? featured.map(id => jobs.find(job => job.id === id)) : jobs.filter(job => job.category === homeCategory).slice(0, 6);
}
function homePage() {
  const featuredCategories = ['digital','design','health','craft','nature'];
  return `<div class="wrap page-enter">
    <section class="hero"><div class="hero-copy">
      <div class="eyebrow eyebrow-label"><span class="status-dot"></span> Für alle, die noch suchen. Und sich.</div>
      <h1>Dein Ding ist<br>irgendwo<br><em>da draußen.</em></h1>
      <p class="hero-description">Nur was genau? Finden wir’s raus. Mit Fragen, die Spaß machen, und Berufen, an die du vielleicht noch nie gedacht hast.</p>
      <div class="hero-actions"><button class="button button-coral" data-start>${profile ? 'Deine Matches' : 'Finde dein Ding'} ${icon('arrow-up-right')}</button><a class="hero-secondary" href="#explore">Erst mal stöbern ${icon('arrow')}</a></div>
      <div class="hero-notes"><span>${icon('clock')} ca. 5 Minuten</span><span>${icon('check')} Kostenlos</span><span>${icon('lock')} Ohne Anmeldung</span></div>
    </div>${heroArt()}</section>
    <div class="fact-strip"><div class="fact"><strong>${jobs.length}</strong><span>Berufe zum<br>Entdecken</span></div><div class="fact"><strong>16</strong><span>Persönlichkeits-<br>typen als Impuls</span></div><div class="fact"><strong>100%</strong><span>du selbst.<br>Keine Schublade.</span></div><div class="strip-note">${icon('compass')} Du brauchst keinen perfekten Plan.<br>Nur ein bisschen Neugier.</div></div>
    <section class="section" aria-labelledby="discover-heading"><div class="section-top"><div><div class="eyebrow">Die Welt ist größer als dein Stundenplan</div><h2 id="discover-heading">So viele Wege.<br>Welcher ist deiner?</h2></div><p>Von „mit Menschen“ bis „mit Maschinen“.<br>Hier wartet mehr als der Klassiker von der letzten Berufsmesse.</p></div>
      <div class="category-row" aria-label="Berufsfelder auswählen"><button class="chip ${homeCategory === 'all' ? 'active' : ''}" data-home-category="all" aria-pressed="${homeCategory === 'all'}">${icon('sparkles')} Ein bisschen von allem</button>${featuredCategories.map(id => { const cat = categories.find(c => c.id === id); return `<button class="chip ${homeCategory === id ? 'active' : ''}" data-home-category="${id}" aria-pressed="${homeCategory === id}">${icon(cat.icon)} ${cat.name}</button>`; }).join('')}</div>
      <div class="job-grid" id="home-grid">${homeJobs().map(card).join('')}</div>
      <div class="center-action"><a class="button button-outline" href="#explore">Alle ${jobs.length} Berufe entdecken ${icon('arrow')}</a></div>
    </section>
    <section class="section how-section" id="how" aria-labelledby="how-heading"><div class="how-title"><div class="eyebrow">Kein Bewerbungsgespräch.<br>Versprochen.</div><h2 id="how-heading">Ein paar Fragen.<br>Eine neue Richtung.</h2></div>
      <div class="steps"><div><div class="step-number">01 /</div><h3>Erzähl mal von dir.</h3><p>Team „erst mal planen“ oder „einfach machen“? Beantworte ${questions.length} kleine Alltagsfragen und wähle, was dir wichtig ist.</p></div><div><div class="step-number">02 /</div><h3>Wir verbinden die Punkte.</h3><p>Deine Interessen und Arbeitswünsche treffen auf ${jobs.length} Berufsideen. Dein MBTI-Typ gibt einen kleinen Extra-Impuls.</p></div><div><div class="step-number">03 /</div><h3>Entdecke dein „Was wäre, wenn?“</h3><p>Finde neue Ideen, schau dir die Gründe an und merke dir Favoriten. Dein nächster Schritt darf klein anfangen.</p></div></div>
      <p class="small-note">${icon('info')} Ein Kompass, kein Orakel: Das Matching ist eine spielerische Orientierung, kein Eignungstest. Ein Persönlichkeitstyp entscheidet nicht darüber, was du werden kannst.</p>
    </section>
    <section class="cta-banner"><div><div class="eyebrow" style="margin-bottom:12px">Neugierig auf dich selbst?</div><h2>Deine Zukunft hat noch<br>ein paar gute Ideen.</h2><p>Entdecke die ersten. Ganz ohne Lebenslauf.</p></div><span class="cta-decoration" aria-hidden="true">✳</span><button class="button button-dark" data-start>Los geht’s ${icon('arrow-up-right')}</button></section>
  </div>`;
}

function filtersMarkup(route) {
  return `<div class="filter-bar"><div><label class="field-label" for="job-search">Welcher Beruf interessiert dich?</label><div class="search-field">${icon('search')}<input type="search" id="job-search" placeholder="Beruf, Thema oder Berufsfeld suchen …" value="${esc(filters.search)}" autocomplete="off"></div></div>
    <div><label class="field-label" for="category-filter">Berufsfeld</label><select id="category-filter"><option value="all">Alle ${categories.length} Berufsfelder</option>${categories.map(cat => `<option value="${cat.id}" ${filters.category === cat.id ? 'selected' : ''}>${cat.name}</option>`).join('')}</select></div>
    <div><label class="field-label" for="sort-filter">Sortieren nach</label><select id="sort-filter"><option value="default" ${filters.sort === 'default' ? 'selected' : ''}>${route === 'results' ? 'Beste Matches' : 'Entdecken'}</option><option value="az" ${filters.sort === 'az' ? 'selected' : ''}>Beruf A–Z</option><option value="za" ${filters.sort === 'za' ? 'selected' : ''}>Beruf Z–A</option></select></div></div>
    <div class="filter-summary"><span id="result-count" role="status" aria-live="polite"></span><button class="text-button" data-clear-filters>Filter zurücksetzen</button></div><div class="job-grid" id="catalogue-grid"></div><div class="center-action" id="load-more-area"></div>`;
}
function cataloguePage(route) {
  const result = route === 'results';
  const isSaved = route === 'saved';
  return `<div class="wrap page-enter"><header class="page-header"><div class="eyebrow">${result ? 'Deine Antworten. Neue Möglichkeiten.' : isSaved ? 'Für später. Und vielleicht für immer.' : 'Wohin darf’s gehen?'}</div><h1>${result ? 'Das könnte dein Ding sein.' : isSaved ? 'Deine „Klingt gut!“-Liste.' : 'Es gibt mehr als Plan A.'}</h1><p>${result ? 'Hier sind Berufsideen, die zu deinen Antworten passen. Schau dir die Gründe an und bleib neugierig – auch auf unerwartete Wege.' : isSaved ? 'Alle Berufe, bei denen du kurz hängen geblieben bist. Deine Favoriten bleiben in diesem Browser gespeichert.' : `${jobs.length} Berufsideen, ${categories.length} Berufsfelder und jede Menge Möglichkeiten. Such nach einem Thema oder lass dich einfach überraschen.`}</p></header>
    ${result ? profileMarkup() : ''}
    ${isSaved && bookmarks.size ? `<div class="results-actions"><button class="button button-outline" data-export="saved">${icon('download')} Merkliste herunterladen</button></div>` : ''}
    <section class="catalogue" aria-label="${isSaved ? 'Gemerkte Berufe' : 'Berufekatalog'}">${filtersMarkup(route)}</section></div>`;
}
function profileMarkup() {
  const topInterests = Object.entries(profile.interests).sort((a,b) => b[1]-a[1]).slice(0,3).map(([id]) => interests.find(i => i.id === id).title);
  const uncertain = profile.type.includes('X');
  return `<div class="profile-panel"><div class="type-badge">${profile.type}</div><div><h2>${typeNames[profile.type] || 'Du lässt dich nicht festlegen.'}</h2><p>${uncertain ? 'Bei manchen MBTI-Achsen sind deine Antworten ausgeglichen. X lässt diese Richtung bewusst offen.' : 'Dein spielerischer MBTI-Impuls aus deinen Antworten oder deiner eigenen Angabe.'} Deine Interessen geben beim Matching die Richtung vor.</p><div class="profile-tags">${topInterests.map(text => `<span>${text}</span>`).join('')}</div></div><button class="button button-outline" data-edit-quiz>Antworten ändern ${icon('pen')}</button></div>
    <p class="results-note">Die Werte von 0 bis 100 zeigen die Ähnlichkeit mit unseren redaktionellen Berufsprofilen. Sie sind keine Erfolgswahrscheinlichkeit und keine Aussage über deine Eignung. Je höher der Wert, desto mehr Anknüpfungspunkte gibt es.</p>
    <div class="results-actions"><button class="button button-outline" data-export="results">${icon('download')} Ergebnisse herunterladen</button><button class="button button-outline" data-method>${icon('info')} Wie wird gerechnet?</button><button class="text-button" data-reset-quiz>Neues Quiz starten</button></div>`;
}
function getFilteredJobs(route) {
  let list = route === 'results' && profile ? rankJobs(jobs, profile) : [...jobs];
  if (route === 'saved') list = list.filter(job => bookmarks.has(job.id));
  if (filters.category !== 'all') list = list.filter(job => job.category === filters.category);
  const normalize = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/ß/g, 'ss');
  const search = normalize(filters.search.trim());
  if (search) list = list.filter(job => normalize(`${job.title} ${job.description} ${getCategory(job).name}`).includes(search));
  if (filters.sort === 'az') list.sort((a,b) => a.title.localeCompare(b.title, 'de'));
  if (filters.sort === 'za') list.sort((a,b) => b.title.localeCompare(a.title, 'de'));
  return list;
}
function updateCatalogue() {
  const route = getRoute();
  const grid = document.querySelector('#catalogue-grid');
  if (!grid) return;
  const list = getFilteredJobs(route);
  document.querySelector('#result-count').textContent = `${list.length} ${list.length === 1 ? 'Berufsidee' : 'Berufsideen'}${filters.search ? ` für „${filters.search}“` : ''}`;
  grid.classList.toggle('job-grid', !!list.length);
  grid.innerHTML = list.length ? list.slice(0, filters.limit).map(card).join('') : `<div class="empty-state"><div class="job-icon mint">${icon(route === 'saved' && !bookmarks.size ? 'bookmark' : 'search')}</div><h2>${route === 'saved' && !bookmarks.size ? 'Hier ist noch Platz für Zukunft.' : 'Noch kein Treffer. Noch kein Problem.'}</h2><p>${route === 'saved' && !bookmarks.size ? 'Tippe bei einem Beruf auf das Lesezeichen. Dann findest du ihn genau hier wieder.' : 'Versuch einen anderen Suchbegriff oder ein anderes Berufsfeld. Manchmal liegt die beste Idee direkt neben der ersten.'}</p>${route === 'saved' && !bookmarks.size ? `<a class="button button-dark" href="#explore">Berufe entdecken ${icon('arrow')}</a>` : '<button class="button button-outline" data-clear-filters>Alle Filter zurücksetzen</button>'}</div>`;
  document.querySelector('#load-more-area').innerHTML = list.length > filters.limit ? `<button class="button button-outline" data-load-more>Weitere ${Math.min(12, list.length - filters.limit)} Berufe entdecken ${icon('arrow')}</button><p style="font-size:10px;margin-top:12px">${Math.min(filters.limit,list.length)} von ${list.length} angezeigt</p>` : '';
}

function optionMarkup(key, label, optionIcon, selected, detail = '') {
  return `<button class="option ${selected ? 'selected' : ''}" data-option="${key}" aria-pressed="${selected}"><span class="option-icon">${icon(optionIcon)}</span><span class="option-text">${label}${detail ? `<small>${detail}</small>` : ''}</span><span class="option-check">${icon('check')}</span></button>`;
}
function quizPage() {
  const question = questions[quizStep];
  let title, subtitle, label, options, extra = '', allowNext;
  if (question) {
    title = question.title; subtitle = question.subtitle; label = question.kind === 'personality' ? 'Dein erster Impuls zählt' : 'Was macht dich neugierig?';
    options = question.options.map(([key, text, optionIcon], i) => optionMarkup(i, text, optionIcon, quiz.answers[quizStep] === i)).join('');
    allowNext = quiz.answers[quizStep] !== null;
  } else if (quizStep === Q) {
    title = 'Wobei vergisst du die Zeit?'; subtitle = 'Wähle bis zu 3 Bereiche, die dich wirklich interessieren. Du musst darin noch nicht gut sein.'; label = 'Deine Interessen geben die Richtung vor';
    options = interests.map(i => optionMarkup(i.id, i.title, i.icon, quiz.interests.includes(i.id), i.text)).join('');
    extra = `<p class="selection-count">${quiz.interests.length} von maximal 3 ausgewählt · mindestens 1</p>`; allowNext = quiz.interests.length > 0;
  } else if (quizStep === Q + 1) {
    title = 'Ein guter Job sollte dir …'; subtitle = '… mehr geben als die Antwort auf „Und, was machst du so?“. Wähle bis zu 3 Dinge, die dir wichtig sind.'; label = 'Dein Job. Deine Prioritäten.';
    options = values.map(v => optionMarkup(v.id, v.label, v.icon, quiz.values.includes(v.id))).join('');
    extra = `<p class="selection-count">${quiz.values.length} von maximal 3 ausgewählt · mindestens 1</p>`; allowNext = quiz.values.length > 0;
  } else {
    title = 'Wo fühlst du dich in deinem Element?'; subtitle = 'Wähle alles, was dich anspricht. Noch unsicher? Du kannst diese Auswahl einfach offen lassen.'; label = 'Fast da. Ein letzter Feinschliff.';
    options = environments.map(e => optionMarkup(e.id, e.label, e.icon, quiz.environments.includes(e.id))).join('');
    extra = `<div class="optional-panel"><label for="known-type">Du kennst deinen MBTI-Typ bereits? <span style="color:var(--muted)">(optional)</span></label><select id="known-type"><option value="">Aus meinen Antworten ableiten</option>${mbtiTypes.map(type => `<option value="${type}" ${quiz.knownType === type ? 'selected' : ''}>${type} — ${typeNames[type]}</option>`).join('')}</select><p>Deine Angabe ersetzt nur den MBTI-Impuls. Interessen und Arbeitswünsche bleiben wichtiger.</p></div>`; allowNext = true;
  }
  const hasProgress = quiz.answers.some(answer => answer !== null);
  return `<div class="quiz-page page-enter"><div class="quiz-toolbar"><button class="text-button" data-exit-quiz>${icon('x')} Für später aufheben</button><span>Schritt ${quizStep + 1} von ${TOTAL_STEPS}</span></div><div class="progress-track" role="progressbar" aria-label="Quizfortschritt" aria-valuemin="0" aria-valuemax="${TOTAL_STEPS}" aria-valuenow="${quizStep + 1}"><div style="width:${(quizStep + 1) / TOTAL_STEPS * 100}%"></div></div>
    ${quizStep === 0 && hasProgress ? '<div class="continue-notice"><span>Deine bisherigen Antworten sind noch da.</span><button class="text-button" data-reset-quiz>Neu anfangen</button></div>' : ''}
    <section class="quiz-question"><div class="eyebrow">${label}</div><h1 tabindex="-1" id="question-heading">${title}</h1><p>${subtitle}</p><div class="options ${quizStep >= Q || options.split('data-option=').length > 5 ? 'multi-options' : ''}" role="group" aria-label="Antwortmöglichkeiten">${options}</div>${extra}<div class="quiz-validation" role="status" aria-live="polite"></div></section>
    <div class="quiz-bottom"><button class="quiz-back" data-quiz-back ${quizStep === 0 ? 'disabled' : ''}>${icon('back')} Zurück</button><p>${icon('lock').replace('class="icon ', 'style="display:inline-block;vertical-align:middle;width:11px;height:11px" class="icon ')} ${storageAvailable ? 'Deine Antworten bleiben in diesem Browser.' : 'Speichern nicht verfügbar. Antworten bleiben in dieser Sitzung.'}</p><button class="button button-dark" data-quiz-next ${allowNext ? '' : 'disabled'}>${quizStep === Q + 2 ? 'Meine Matches' : 'Weiter'} ${icon('arrow')}</button></div></div>`;
}

function render({ keepScroll = false, focus = false } = {}) {
  if (dialog.open) dialog.close();
  const route = getRoute();
  if (route === 'results' && !profile) { navigate('quiz'); return; }
  main.innerHTML = route === 'quiz' ? quizPage() : ['explore','saved','results'].includes(route) ? cataloguePage(route) : homePage();
  document.querySelectorAll('[data-nav]').forEach(el => { const active = el.dataset.nav === route; el.classList.toggle('active', active); if (active) el.setAttribute('aria-current', 'page'); else el.removeAttribute('aria-current'); });
  document.querySelector('.header-quiz').hidden = route === 'quiz';
  if (['explore','saved','results'].includes(route)) updateCatalogue();
  updateBookmarkCount();
  const titles = { home:'Dein Ding ist irgendwo da draußen.', explore:'Berufe entdecken', saved:'Deine Merkliste', quiz:'Finde dein Ding', results:'Deine Berufsideen', how:'So funktioniert’s' };
  document.title = `${titles[route]} — Jobkompass`;
  if (route === 'how') requestAnimationFrame(() => document.querySelector('#how').scrollIntoView());
  else if (!keepScroll) window.scrollTo({ top: 0, behavior: 'instant' });
  if (focus) { const heading = main.querySelector('h1'); heading?.setAttribute('tabindex','-1'); heading?.focus({ preventScroll: true }); }
}

function showDialog(content) {
  document.querySelector('#dialog-content').innerHTML = content;
  dialog.showModal();
  document.querySelector('[data-close]').focus();
}
function detail(id) {
  const job = jobs.find(job => job.id === id);
  if (!job) return;
  const cat = getCategory(job);
  const match = profile ? scoreJob(job, profile) : null;
  const strong = match ? match.strongest : Object.keys(job.interests).sort((a,b) => job.interests[b] - job.interests[a]).slice(0,2);
  const fit = strong.map(key => interests.find(interest => interest.id === key).title);
  const bar = (name, value, weight) => `<div><div class="match-bar-label"><span>${name} <span style="color:var(--muted)">(${weight})</span></span><strong>${value === null ? 'offen' : `${value} / 100`}</strong></div>${value === null ? '' : `<div class="match-track"><span style="width:${value}%"></span></div>`}</div>`;
  showDialog(`<div class="dialog-header"><div class="job-icon ${cat.color}">${icon(cat.icon)}</div><div class="eyebrow">${cat.name}</div><h2 id="dialog-title">${job.title}</h2><p>${job.description}</p></div>
    <div class="dialog-section"><h3>${match ? 'Hier gibt es Anknüpfungspunkte.' : 'Das könnte dich daran reizen.'}</h3><p>Dieses Berufsprofil verbindet besonders <strong>${fit.join('</strong> und <strong>')}</strong>. ${match ? 'Der Orientierungswert vergleicht deine Antworten mit unserem redaktionellen Profil.' : 'Ob es sich für dich richtig anfühlt, kannst du mit dem Quiz und beim weiteren Recherchieren erkunden.'}</p>
      ${match ? `<div style="margin-top:15px"><span class="match-label">${match.score} / 100 Orientierungswert</span></div><div class="match-bars">${bar('Interessen',match.interest,'60 %')}${bar('Arbeitswünsche',match.wishes,'25 %')}${bar('MBTI-Impuls',match.personality,'max. 15 %')}</div>` : ''}
    </div><div class="dialog-section"><h3>Ein Bild vom möglichen Alltag</h3><div class="profile-tags">${job.environments.map(id => `<span>${environments.find(e => e.id === id).label}</span>`).join('')}</div><p style="margin-top:13px">Mögliche Schwerpunkte: ${job.values.map(id => values.find(v => v.id === id).label).join(' · ')}. Aufgaben und Arbeitsbedingungen unterscheiden sich je nach Stelle und Arbeitgeber.</p></div>
    <div class="dialog-section"><h3>Vom „Klingt gut“ zum nächsten Schritt</h3><ol style="padding-left:18px"><li>Suche in BERUFENET nach „${job.title}“ und prüfe Tätigkeiten und Zugangswege.</li><li>Schau dir echte Stellenanzeigen oder ein Praktikum an.</li><li>Sprich mit jemandem, der den Beruf ausübt. Der Alltag sagt mehr als ein Jobtitel.</li></ol><p>Die Sammlung enthält Ausbildungsberufe, akademische Berufe und Tätigkeitsprofile. Zugangsvoraussetzungen bitte für den konkreten Beruf prüfen.</p></div>
    <div class="dialog-actions"><button class="button button-dark" data-bookmark="${job.id}" data-dialog-bookmark>${icon('bookmark')} ${bookmarks.has(job.id) ? 'Aus Merkliste entfernen' : 'Auf die Merkliste'}</button><a class="button button-outline" href="https://web.arbeitsagentur.de/berufenet/" target="_blank" rel="noopener noreferrer">In BERUFENET recherchieren ${icon('arrow-up-right')}</a></div>`);
}
function methodDialog() {
  showDialog(`<div class="dialog-header"><div class="eyebrow">Nachvollziehbar statt magisch</div><h2 id="dialog-title">Ein Kompass, kein Orakel.</h2><p>Wir vergleichen deine Antworten mit ${jobs.length} redaktionell angelegten Berufsprofilen. Es kommen keine KI-API und kein Tracking zum Einsatz.</p></div><div class="method-grid"><div><strong>60 %</strong>Interessen</div><div><strong>25 %</strong>Arbeitswünsche</div><div><strong>15 %</strong>MBTI-Impuls</div></div><div class="dialog-section"><h3>Was steckt in deinem Wert?</h3><p>Die ${questions.filter(q => q.kind === 'scenario').length} Situationsfragen ergänzen deine ausdrücklich gewählten Interessen. Verglichen werden sechs Richtungen: praktisch, forschend, kreativ, sozial, unternehmerisch und strukturierend. Deine Auswahl zählt dabei stärker als eine einzelne Situationsantwort.</p><p style="margin-top:12px">Bei den Arbeitswünschen zählen gewählte Prioritäten und bevorzugte Umgebungen. Für den MBTI-Impuls vergleichen wir die vier Buchstaben mit den hinterlegten Typ-Impulsen. Gleichstand auf einer Achse ergibt X; diese Achse wird nicht gewertet. Ohne verwertbaren MBTI-Impuls verteilen sich die Gewichte auf die übrigen Faktoren.</p></div><div class="dialog-section"><h3>Was dir das Ergebnis sagt</h3><p>Der Wert ist ein heuristischer Orientierungswert, keine Eignungsdiagnose und keine Erfolgswahrscheinlichkeit. Interessenprofile und Typ-Zuordnungen sind vereinfachte redaktionelle Annahmen. Sie sind kein wissenschaftlich validiertes Testverfahren. Fähigkeiten, Abschlüsse und individuelle Lebensumstände werden nicht bewertet. Jeder Beruf bleibt sichtbar, unabhängig vom MBTI-Typ.</p></div><div class="dialog-section"><h3>Berufsidee vertiefen</h3><p>Für verbindliche Informationen zu Tätigkeiten und Zugangswegen nutze die <a class="text-button" href="https://web.arbeitsagentur.de/berufenet/" target="_blank" rel="noopener noreferrer">Berufedatenbank der Bundesagentur für Arbeit</a>.</p></div>`);
}
function privacyDialog() {
  showDialog(`<div class="dialog-header"><div class="eyebrow">Deine Antworten gehören dir</div><h2 id="dialog-title">Lokal. Ohne Konto.</h2><p>Quizantworten und Merkliste werden ausschließlich im lokalen Speicher dieses Browsers abgelegt. Du kannst die Seite ohne Anmeldung verwenden.</p></div><div class="dialog-section"><h3>Was gespeichert wird</h3><p>Deine ausgewählten Antworten, Interessen, Arbeitswünsche, ein optional angegebener MBTI-Typ, der Quizfortschritt und die IDs deiner gemerkten Berufe. Beim Löschen der Browserdaten gehen diese Angaben verloren. Auf einem gemeinsam genutzten Gerät können andere Personen desselben Browserprofils darauf zugreifen.</p></div><div class="dialog-section"><h3>Was beim Besuch passiert</h3><p>Die Seite verwendet keine Analyse-Tools, Werbe-Cookies, externen Schriftarten oder externen KI-Dienste. Beim Laden erhält der Hostinganbieter die üblichen technischen Verbindungsdaten, etwa deine IP-Adresse. Links zu BERUFENET öffnen eine externe Website; dort gelten deren Datenschutzbedingungen.</p></div><div class="dialog-section"><h3>Alles wieder auf Anfang?</h3><p>Diese Schaltfläche entfernt deine Antworten, Ergebnisse und Merkliste aus diesem Browser.</p><div class="dialog-actions"><button class="button button-outline" data-delete-data>Alle lokalen Daten löschen</button></div></div>`);
}

function toggleBookmark(id, fromDialog) {
  if (!jobs.some(job => job.id === id)) return;
  const existed = bookmarks.has(id);
  if (existed) bookmarks.delete(id); else bookmarks.add(id);
  persist(); updateBookmarkCount();
  if (getRoute() === 'saved') {
    updateCatalogue();
    if (!bookmarks.size) document.querySelector('[data-export="saved"]')?.parentElement.remove();
    if (!fromDialog) document.querySelector('#job-search')?.focus({ preventScroll:true });
  }
  else document.querySelectorAll(`[data-bookmark="${id}"]`).forEach(el => {
    if (el.hasAttribute('data-dialog-bookmark')) return;
    const job = jobs.find(job => job.id === id);
    el.classList.toggle('saved', !existed); el.setAttribute('aria-pressed', String(!existed));
    el.setAttribute('aria-label', `${job.title} ${existed ? 'merken' : 'aus Merkliste entfernen'}`);
  });
  if (fromDialog) { const button = document.querySelector('[data-dialog-bookmark]'); if (button) button.innerHTML = `${icon('bookmark')} ${existed ? 'Auf die Merkliste' : 'Aus Merkliste entfernen'}`; }
  notify(existed ? 'Aus deiner Merkliste entfernt.' : 'Gemerkt. Eine gute Idee für später.');
}

function exportReport(kind) {
  const list = kind === 'saved' ? jobs.filter(job => bookmarks.has(job.id)) : rankJobs(jobs, profile).slice(0,20);
  const lines = ['JOBKOMPASS — Deine Berufsideen', '', kind === 'saved' ? 'Deine Merkliste' : `Dein MBTI-Impuls: ${profile.type}`, '', ...list.flatMap((job, i) => [`${i + 1}. ${job.title}${job.match ? ` — ${job.match.score}/100 Orientierungswert` : ''}`, job.description, `Berufsfeld: ${getCategory(job).name}`, '']), 'Spielerische Orientierung, kein Eignungstest. Keine Erfolgswahrscheinlichkeit.', 'Profile und Zuordnungen sind redaktionelle Annahmen.', 'Tätigkeiten und Zugangswege recherchieren: https://web.arbeitsagentur.de/berufenet/'];
  const url = URL.createObjectURL(new Blob(['\uFEFF', lines.join('\n')], { type: 'text/plain;charset=utf-8' }));
  const link = document.createElement('a'); link.href = url; link.download = `jobkompass-${kind === 'saved' ? 'merkliste' : 'ergebnisse'}.txt`; document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url),1000);
  notify('Deine Berufsideen wurden als Textdatei exportiert.');
}

document.addEventListener('click', event => {
  const target = event.target.closest('button, a');
  if (!target) return;
  if (target.classList.contains('skip-link')) { event.preventDefault(); main.focus(); main.scrollIntoView({ block:'start', behavior:'instant' }); return; }
  if (target.hasAttribute('data-start')) { navigate(profile ? 'results' : 'quiz'); return; }
  if (target.hasAttribute('data-close')) { dialog.close(); return; }
  if (target.hasAttribute('data-method')) { methodDialog(); return; }
  if (target.hasAttribute('data-privacy')) { privacyDialog(); return; }
  if (target.dataset.detail) { detail(target.dataset.detail); return; }
  if (target.dataset.bookmark) { toggleBookmark(target.dataset.bookmark, target.hasAttribute('data-dialog-bookmark')); return; }
  if (target.hasAttribute('data-home-category')) {
    homeCategory = target.dataset.homeCategory;
    document.querySelectorAll('[data-home-category]').forEach(el => { const selected = el.dataset.homeCategory === homeCategory; el.classList.toggle('active', selected); el.setAttribute('aria-pressed', String(selected)); });
    document.querySelector('#home-grid').innerHTML = homeJobs().map(card).join(''); return;
  }
  if (target.hasAttribute('data-load-more')) { const firstNewIndex = filters.limit; filters.limit += 12; updateCatalogue(); const firstNewCard = document.querySelectorAll('#catalogue-grid .card-title-button')[firstNewIndex]; firstNewCard?.focus({ preventScroll: true }); return; }
  if (target.hasAttribute('data-clear-filters')) { filters = { search:'',category:'all',sort:'default',limit:12 }; const search = document.querySelector('#job-search'); search.value = ''; document.querySelector('#category-filter').value = 'all'; document.querySelector('#sort-filter').value = 'default'; updateCatalogue(); search.focus(); return; }
  if (target.hasAttribute('data-option')) {
    if (quizStep < Q) quiz.answers[quizStep] = Number(target.dataset.option);
    else {
      const key = quizStep === Q ? 'interests' : quizStep === Q + 1 ? 'values' : 'environments';
      const value = target.dataset.option;
      if (quiz[key].includes(value)) quiz[key] = quiz[key].filter(id => id !== value);
      else if (key === 'environments' || quiz[key].length < 3) quiz[key].push(value);
      else { document.querySelector('.quiz-validation').textContent = 'Wähle bis zu 3 Favoriten. Entferne zuerst eine andere Auswahl.'; return; }
    }
    profile = isQuizComplete(quiz) ? makeProfile(quiz) : null;
    persist(); const selectedKey = target.dataset.option; const y = window.scrollY;
    main.innerHTML = quizPage(); document.querySelector(`[data-option="${selectedKey}"]`)?.focus({ preventScroll:true }); window.scrollTo({ top:y, behavior:'instant' }); return;
  }
  if (target.hasAttribute('data-quiz-next')) {
    if (quizStep < Q + 2) { quizStep++; persist(); render({ focus:true }); }
    else if (isQuizComplete(quiz)) { profile = makeProfile(quiz); persist(); filters = { search:'',category:'all',sort:'default',limit:12 }; navigate('results'); }
    return;
  }
  if (target.hasAttribute('data-quiz-back')) { if (quizStep > 0) { quizStep--; persist(); render({ focus:true }); } return; }
  if (target.hasAttribute('data-exit-quiz')) { persist(); navigate('home'); notify('Dein Fortschritt bleibt in diesem Browser gespeichert.'); return; }
  if (target.hasAttribute('data-edit-quiz')) { quizStep=0; navigate('quiz'); return; }
  if (target.hasAttribute('data-reset-quiz')) { quiz = sanitizeQuiz(null); quizStep=0; profile=null; persist(); if (getRoute() === 'quiz') render({ focus:true }); else navigate('quiz'); return; }
  if (target.hasAttribute('data-export')) { exportReport(target.dataset.export); return; }
  if (target.hasAttribute('data-delete-data')) {
    quiz=sanitizeQuiz(null); quizStep=0; profile=null; bookmarks.clear();
    try { localStorage.removeItem(storageKey); } catch { /* Session state is still cleared. */ }
    dialog.close(); if (getRoute() === 'home') render(); else navigate('home'); notify('Deine lokalen Daten wurden gelöscht.');
  }
});
document.addEventListener('input', event => { if (event.target.id === 'job-search') { filters.search = event.target.value; filters.limit=12; updateCatalogue(); } });
document.addEventListener('change', event => {
  if (event.target.id === 'category-filter') { filters.category=event.target.value; filters.limit=12; updateCatalogue(); }
  if (event.target.id === 'sort-filter') { filters.sort=event.target.value; filters.limit=12; updateCatalogue(); }
  if (event.target.id === 'known-type') { quiz.knownType=event.target.value; profile=isQuizComplete(quiz) ? makeProfile(quiz) : null; persist(); }
});
dialog.addEventListener('click', event => { if (event.target === dialog) { const box=dialog.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close(); } });
window.addEventListener('hashchange', () => { filters = { search:'', category:'all', sort:'default', limit:12 }; render({ focus:true }); });
hydrateIcons(); render();
