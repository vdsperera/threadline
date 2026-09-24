let CATS = {};
let CASES = [];
const state = { activeCats: new Set(), activePersons: new Set() };

/* ============ load config and manifest ============ */
async function loadCases() {
  const configRes = await fetch('config.json');
  if (!configRes.ok) throw new Error('Could not load config.json');
  const config = await configRes.json();
  CATS = config.cats;
  state.activeCats = new Set(Object.keys(CATS));

  const manifestRes = await fetch('cases/manifest.json');
  if (!manifestRes.ok) throw new Error('Could not load cases/manifest.json (' + manifestRes.status + ')');
  const ids = await manifestRes.json();

  const casePromises = ids.map(async (id) => {
    const res = await fetch(`cases/${id}.json`);
    if (!res.ok) throw new Error(`Could not load cases/${id}.json (${res.status})`);
    const data = await res.json();
    if (data.id !== id) {
      console.warn(`cases/${id}.json has id "${data.id}" — expected "${id}". Using the filename.`);
    }
    return data;
  });

  CASES = await Promise.all(casePromises);
}

/* ============ routing ============ */
function findCase(id) { return CASES.find(c => c.id === id); }

async function renderViewForCurrentHash() {
  const id = location.hash.replace('#', '');
  const c = id ? findCase(id) : null;
  
  if (c) {
    state.activeCats = new Set(Object.keys(CATS));
    state.activePersons = new Set(Object.keys(c.persons));
    document.getElementById('view-index').style.display = 'none';
    document.getElementById('view-case').style.display = 'block';
    document.getElementById('backBtn').style.display = 'inline-flex';
    renderCase(c);
    window.scrollTo(0, 0);
  } else {
    document.getElementById('view-index').style.display = 'block';
    document.getElementById('view-case').style.display = 'none';
    document.getElementById('backBtn').style.display = 'none';
    if (id) history.replaceState(null, null, ' '); // clear invalid hash cleanly
    renderIndex();
  }
}

function goIndex() { window.location.hash = ''; }
function goCase(id) { window.location.hash = id; }

/* ============ Safe DOM Helper (XSS Mitigation) ============ */
function h(tag, attrs, ...children) {
  const el = document.createElement(tag);
  if (attrs) {
    for (const [k, v] of Object.entries(attrs)) {
      if (k === 'style') {
        for (const [sk, sv] of Object.entries(v)) el.style[sk] = sv;
      } else if (k === 'dataset') {
        for (const [dk, dv] of Object.entries(v)) el.dataset[dk] = dv;
      } else if (k.startsWith('on') && typeof v === 'function') {
        el.addEventListener(k.substring(2).toLowerCase(), v);
      } else {
        if (k === 'className') el.className = v;
        else el.setAttribute(k, v);
      }
    }
  }
  for (const child of children) {
    if (child == null) continue;
    if (typeof child === 'string' || typeof child === 'number') {
      el.appendChild(document.createTextNode(child));
    } else {
      el.appendChild(child);
    }
  }
  return el;
}

/* ============ index rendering ============ */
function renderIndex() {
  document.getElementById('caseCount').textContent = CASES.length
    ? `${CASES.length} case${CASES.length === 1 ? '' : 's'}` : '';
  
  const grid = document.getElementById('caseGrid');
  grid.innerHTML = ''; // Safe to clear
  
  if (CASES.length === 0) {
    grid.appendChild(h('div', {className: 'empty-index'}, 'No cases yet. Drop a case JSON into /cases and add its id to manifest.json.'));
    return;
  }
  
  CASES.forEach(c => {
    const usedCats = [...new Set(c.events.map(e => e.cat))];
    
    const dots = usedCats.map(k => h('span', {style: {background: CATS[k].color}}));
    
    let badge = h('span');
    if (c.statusBadge) {
      badge = h('span', {className: 'status-badge', style: {color: c.statusBadge.color}}, c.statusBadge.label);
    }
    
    const card = h('button', {className: 'case-card', onClick: () => goCase(c.id)},
      h('div', {className: 'case-tab mono'}, h('span', null, c.location), h('span', null, c.years)),
      h('h3', null, c.title),
      h('p', null, c.cardBlurb || c.dek),
      h('div', {className: 'case-footer'},
        badge,
        h('div', {className: 'cat-dots'}, ...dots)
      )
    );
    grid.appendChild(card);
  });
}

/* ============ case detail rendering ============ */
function renderCase(c) {
  const tag = document.getElementById('caseTag');
  tag.innerHTML = '';
  tag.appendChild(h('span', null, (c.location || '').toUpperCase()));
  tag.appendChild(h('span', null, c.years));
  
  document.getElementById('caseTitle').textContent = c.title;
  document.getElementById('caseDek').textContent = c.dek;
  document.getElementById('caseFooter').textContent = c.source || '';

  const catBox = document.getElementById('catFilters');
  catBox.innerHTML = '';
  const usedCats = [...new Set(c.events.map(e => e.cat))];
  
  usedCats.forEach(key => {
    const cat = CATS[key];
    const btn = h('button', {className: 'filter-btn', dataset: {active: 'true'}},
      h('span', {className: 'dot', style: {background: cat.color}}),
      h('span', null, cat.label)
    );
    btn.onclick = () => {
      if (state.activeCats.has(key)) state.activeCats.delete(key); else state.activeCats.add(key);
      btn.dataset.active = state.activeCats.has(key) ? 'true' : 'false';
      renderTimeline(c);
    };
    catBox.appendChild(btn);
  });

  const personBox = document.getElementById('personFilters');
  personBox.innerHTML = '';
  Object.entries(c.persons).forEach(([key, p]) => {
    const btn = h('button', {className: 'person-card', dataset: {active: 'true'}},
      h('div', {className: 'person-name'}, p.name),
      h('div', {className: 'person-role'}, p.role),
      h('span', {className: 'status-chip', style: {border: `1px solid ${p.statusColor}`, color: p.statusColor}}, p.status)
    );
    btn.onclick = () => {
      if (state.activePersons.has(key)) state.activePersons.delete(key); else state.activePersons.add(key);
      btn.dataset.active = state.activePersons.has(key) ? 'true' : 'false';
      renderTimeline(c);
    };
    personBox.appendChild(btn);
  });

  document.getElementById('resetBtn').onclick = () => {
    state.activeCats = new Set(Object.keys(CATS));
    state.activePersons = new Set(Object.keys(c.persons));
    document.querySelectorAll('.filter-btn, .person-card').forEach(el => el.dataset.active = 'true');
    renderTimeline(c);
  };

  renderTimeline(c);
}

function eventMatches(ev) {
  const catOk = state.activeCats.has(ev.cat);
  const personOk = ev.persons.length === 0 || ev.persons.some(p => state.activePersons.has(p));
  return catOk && personOk;
}

function renderTimeline(c) {
  const spine = document.getElementById('spine');
  spine.innerHTML = '';
  let lastYear = null;
  let visibleCount = 0;

  c.events.forEach(ev => {
    const visible = eventMatches(ev);
    if (visible) {
      visibleCount++;
      if (ev.year !== lastYear) {
        spine.appendChild(h('div', {className: 'year-marker'}, ev.year));
        lastYear = ev.year;
      }
    }

    const cat = CATS[ev.cat];
    const personNames = ev.persons.map(p => c.persons[p].name.split(' ').pop()).join(' · ');
    const dateStr = personNames ? `${ev.date} · ${personNames}` : ev.date;

    const btn = h('button', {className: 'event-btn', 'aria-expanded': 'false'},
      h('div', {className: 'event-top'},
        h('span', {className: 'event-date mono'}, dateStr),
        h('span', {className: 'cat-label'}, cat.label)
      ),
      h('h3', {className: 'event-title'}, ev.title),
      h('p', {className: 'event-summary'}, ev.summary)
    );

    let quoteEl = null;
    if (ev.quote) {
      quoteEl = h('div', {className: 'quote'}, 
        `\u201C${ev.quote.text}\u201D`,
        h('cite', null, `\u2014 ${ev.quote.cite}`)
      );
    }

    const detail = h('div', {className: 'event-detail'},
      h('p', null, ev.detail),
      quoteEl
    );

    const el = h('div', {className: 'event', dataset: {hidden: visible ? 'false' : 'true'}}, btn, detail);
    el.style.setProperty('--cat-color', cat.color);

    btn.onclick = () => {
      const isOpen = el.classList.contains('open');
      el.classList.toggle('open', !isOpen);
      if (isOpen) {
        btn.setAttribute('aria-expanded', 'false');
      } else {
        btn.setAttribute('aria-expanded', 'true');
      }
    };

    spine.appendChild(el);
  });

  document.getElementById('emptyState').style.display = visibleCount === 0 ? 'block' : 'none';
}

/* ============ nav wiring ============ */
document.getElementById('brandBtn').addEventListener('click', goIndex);
document.getElementById('backBtn').addEventListener('click', goIndex);
window.addEventListener('hashchange', renderViewForCurrentHash);

/* ============ boot ============ */
loadCases().then(() => {
  document.getElementById('view-loading').style.display = 'none';
  renderViewForCurrentHash();
}).catch(err => {
  document.getElementById('view-loading').style.display = 'none';
  const errBox = document.getElementById('view-error');
  errBox.style.display = 'block';
  errBox.textContent = 'Failed to boot app: ' + err.message;
  console.error(err);
});