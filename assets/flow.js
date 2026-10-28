/* 5660 Collins · Progress v13 — sequence-first layout + Permits tab. Original 3D scripts untouched. */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };

  /* 1 · Progress: the model leads, notes move below the sequence */
  function relocateDisclosures() {
    const stage = $('.stage');
    if (!stage || $('#flowDisclosures')) return;
    const head = $('#modelMount')?.closest('.panel')?.querySelector('.panel-head');
    if (head) {
      const h2 = head.querySelector('h2'); if (h2) h2.textContent = 'Progress';
      const p = head.querySelector('p'); if (p) p.textContent = 'Watch the planned sequence floor by floor';
      const chip = el('span', 'flow-scenario-chip', 'Planning scenario');
      head.firstElementChild?.prepend(chip);
    }
    const box = el('section', 'flow-disclosures'); box.id = 'flowDisclosures'; box.setAttribute('aria-label', 'Details and disclosures');
    box.append(el('h2', null, 'Details and disclosures'));
    const group = (title, nodes, open) => {
      const list = nodes.filter(Boolean); if (!list.length) return;
      const d = el('details'); if (open) d.open = true;
      d.append(el('summary', null, title));
      const body = el('div', 'disc-body'); list.forEach(n => body.append(n)); d.append(body); box.append(d);
    };
    const kb = $('#kb3d-strip');
    const kbNote = kb?.querySelector('.kb-note');
    if (kbNote) kbNote.textContent = 'The weekly 3D sequence is a planning simulation, not confirmed floor-by-floor field progress. Status notes come only from the published resident notices feed.';
    const brand = $('.head-center b'); if (brand) brand.textContent = '5660 Collins';
    group('This is a planning scenario', [kbNote, $('.caution')], true);
    group('Current documented status', [kb, $('.readiness-strip')]);
    group('Illustrative weekly metrics', [$('.hero'), $('.metrics')]);
    group('About the 3D model', [$('#modelMount .canvas-hud'), $('#hallSourceNote'), $('.legend-note')]);
    stage.after(box);
  }


  /* 3 · v13: calmer model area, stage title under the model, view options tucked away */
  function modernize() {
    const head = $('#modelMount')?.closest('.panel')?.querySelector('.panel-head');
    const cam = $('#cameraSelect'), balc = $('#balc');
    if (head && cam && !$('#flowOptions')) {
      const holder = cam.parentElement;
      const wrap = el('div', 'flow-options'); wrap.id = 'flowOptions';
      const btn = el('button', 'flow-options-btn'); btn.type = 'button'; btn.setAttribute('aria-expanded', 'false'); btn.setAttribute('aria-controls', 'flowOptionsMenu'); btn.setAttribute('aria-label', 'View options');
      btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/></svg>';
      const menu = el('div', 'flow-options-menu'); menu.id = 'flowOptionsMenu'; menu.hidden = true;
      const l1 = el('label', null, 'Camera'); l1.append(cam);
      menu.append(l1); if (balc) menu.append(balc);
      wrap.append(btn, menu); holder.replaceWith(wrap);
      btn.addEventListener('click', () => { const o = menu.hidden; menu.hidden = !o; btn.setAttribute('aria-expanded', String(o)); });
      document.addEventListener('click', e => { if (!wrap.contains(e.target) && !menu.hidden) { menu.hidden = true; btn.setAttribute('aria-expanded', 'false'); } });
      document.addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) { menu.hidden = true; btn.setAttribute('aria-expanded', 'false'); btn.focus(); } });
    }
    const pb = $('#modelPlayback');
    if (pb && !$('#flowNow')) {
      const now = el('div', 'flow-now'); now.id = 'flowNow'; now.setAttribute('aria-live', 'polite');
      const title = el('h3', 'flow-now-title', 'Preconstruction');
      const sub = el('p', 'flow-now-sub', '');
      now.append(title, sub); pb.prepend(now);
      const range = $('#weekRange');
      const sync = () => {
        const wt = $('#weekTitle')?.textContent?.trim(); if (wt) title.textContent = wt;
        const v = range ? +range.value : 0, max = range ? +range.max : 34;
        const floor = $('#quickFloor')?.selectedOptions?.[0]?.textContent?.trim();
        sub.textContent = (v === 0 ? 'Before work starts' : `Week ${v} of ${max}`) + (floor ? `, ${floor}` : '') + ', planning scenario';
      };
      ['#weekTitle', '#weekNum'].forEach(s => { const n = $(s); if (n) new MutationObserver(sync).observe(n, { childList: true, characterData: true, subtree: true }); });
      range?.addEventListener('input', sync); range?.addEventListener('change', sync);
      $('#quickFloor')?.addEventListener('change', sync);
      sync();
    }
    const tour = $('#intTour'), dock = $('#interiorDock');
    if (tour && dock && tour.parentElement !== dock) dock.prepend(tour);
  }

  /* 2 · Permits */
  const LABEL = { issued: 'Issued', review: 'In review', notfiled: 'Not filed', verify: 'To verify', case: 'Code cases' };
  const COLOR = { issued: '#1F4D47', review: '#B08A4F', notfiled: '#C9D0CD', verify: '#E6EAE8' };
  let data = null, filter = 'review';

  function fmtDay(iso) { const d = new Date(iso + 'T12:00:00'); return { m: d.toLocaleDateString('en-US', { month: 'short' }), d: d.getDate() }; }

  function render() {
    const pane = $('#permitsPane'); if (!pane || !data) return;
    pane.replaceChildren();
    const showCases = data.display?.showCodeCases !== false;
    const items = data.items.filter(i => showCases || i.group !== 'case');
    const permits = items.filter(i => i.group !== 'case');
    const count = g => items.filter(i => i.group === g).length;

    const head = el('div', 'pm-head');
    const left = el('div'); left.append(el('h1', null, 'Permits'));
    head.append(left, el('small', null, 'Updated ' + new Date(data.updatedAt + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })));
    pane.append(head);
    if (data.approvalStatus !== 'approved') pane.append(el('span', 'pm-draft', 'Draft, pending Management approval'));

    const card = el('section', 'pm-card'); card.setAttribute('aria-label', 'Permit status overview');
    const big = el('div', 'pm-big'); big.append(el('b', null, String(count('issued'))), el('span', null, `of ${permits.length} permits issued or approved`));
    const bar = el('div', 'pm-bar'); bar.setAttribute('aria-hidden', 'true');
    ['issued', 'review', 'notfiled', 'verify'].forEach(g => { const n = count(g); if (!n) return; const i = el('i'); i.style.flex = String(n); i.style.background = COLOR[g]; bar.append(i); });
    const legend = el('div', 'pm-legend');
    ['issued', 'review', 'notfiled', 'verify'].forEach(g => { const s = el('span'); s.append(el('i', 'pm-mark ' + g), document.createTextNode(`${count(g)} ${LABEL[g].toLowerCase()}`)); legend.append(s); });
    card.append(big, bar, legend); pane.append(card);

    const dates = (data.keyDates || []).filter(k => showCases || !k.board);
    if (dates.length) {
      const sec = el('section', 'pm-dates'); sec.append(el('h2', 'pm-section-title', 'Key dates'));
      const today = new Date(); today.setHours(0, 0, 0, 0);
      let marked = false;
      dates.forEach(k => {
        const row = el('div', 'pm-date'); const f = fmtDay(k.date);
        if (!marked && new Date(k.date + 'T12:00:00') >= today) { row.classList.add('is-next'); marked = true; }
        const cal = el('span', 'pm-cal'); cal.append(el('small', null, f.m), el('b', null, String(f.d)));
        const txt = el('span'); txt.append(el('strong', null, k.title), el('em', null, `${k.ref}, ${k.qualifier}`));
        row.append(cal, txt); sec.append(row);
      });
      pane.append(sec);
    }

    const filters = el('div', 'pm-filters'); filters.setAttribute('role', 'group'); filters.setAttribute('aria-label', 'Filter permits');
    const keys = ['all', 'review', 'issued', 'notfiled', 'verify'].concat(showCases ? ['case'] : []);
    keys.forEach(k => {
      const n = k === 'all' ? items.length : count(k); if (!n && k !== 'all') return;
      const b = el('button', null, `${k === 'all' ? 'All' : LABEL[k]} ${n}`); b.type = 'button';
      b.setAttribute('aria-pressed', String(filter === k));
      b.addEventListener('click', () => { filter = k; render(); $('.pm-filters button[aria-pressed=true]')?.focus(); });
      filters.append(b);
    });
    pane.append(filters);

    const list = el('div', 'pm-list');
    const rows = items.filter(i => filter === 'all' || i.group === filter);
    if (!rows.length) list.append(el('p', 'pm-empty', 'Nothing in this group right now.'));
    rows.forEach(i => {
      const d = el('details'); d.id = 'permit-' + i.id;
      const s = el('summary');
      const mark = el('span', 'pm-mark ' + i.group); mark.setAttribute('role', 'img'); mark.setAttribute('aria-label', LABEL[i.group]);
      const main = el('span', 'pm-main'); main.append(el('b', null, i.scope), el('span', null, i.number), el('small', null, i.status));
      s.append(mark, main, el('span', 'pm-next', i.next || ''));
      d.append(s);
      const det = el('div', 'pm-detail');
      const facts = el('div', 'pm-facts');
      [['Bond', i.bond], ['Duration', i.duration], ['Completion', i.completion]].forEach(([a, b]) => { const c = el('div'); c.append(el('small', null, a), el('b', null, b || '—')); facts.append(c); });
      det.append(facts);
      if (Array.isArray(i.reviewPath)) {
        const ol = el('ol', 'pm-path'); ol.setAttribute('aria-label', 'Review path');
        i.reviewPath.forEach(st => { const li = el('li', st.state); li.append(el('b', null, st.label), el('small', null, st.detail)); ol.append(li); });
        det.append(ol);
      }
      if (i.note) det.append(el('p', null, i.note));
      d.append(det); list.append(d);
    });
    pane.append(list);
    pane.append(el('p', 'pm-foot', data.disclaimer || ''));
  }

  async function loadPermits() {
    const KEY = '5660-permits-v1';
    try {
      const res = await fetch('./data/permits.json?rev=' + Date.now(), { cache: 'no-store' });
      if (!res.ok) throw Error('HTTP ' + res.status);
      const j = await res.json(); if (j?.schemaVersion !== 1 || !Array.isArray(j.items)) throw Error('Invalid permits data');
      data = j; try { localStorage.setItem(KEY, JSON.stringify(j)); } catch {}
    } catch (e) {
      try { const s = JSON.parse(localStorage.getItem(KEY) || 'null'); if (s?.items) data = s; } catch {}
      if (!data) { const p = $('#permitsPane'); if (p) { p.replaceChildren(el('p', 'pm-empty', 'Permits could not load. Check your connection and open this tab again.')); } return; }
    }
    render();
  }

  function init() {
    relocateDisclosures();
    modernize(); setTimeout(modernize, 1200);
    if ($('#permitsPane')) loadPermits();
    if (location.hash === '#permits') setTimeout(() => $('#unifiedNav button[data-target="permits"]')?.click(), 0);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
