/* Staging-only financial presentation. Source rows remain a byte-for-byte
   read-only mirror of HOA Books. The construction tracker is NOT cash paid. */
(() => {
  'use strict';
  const dataUrl = './data/hoa-ledger-20261117.json';
  const money = amount => new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', minimumFractionDigits: 2
  }).format(Number(amount) || 0);
  const date = value => value ? new Intl.DateTimeFormat('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC'
  }).format(new Date(value + 'T12:00:00Z')) : '—';
  const safe = input => String(input == null ? '' : input).replace(/[&<>"']/g,
    c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));
  const palette = ['#1f6456','#57948a','#789c70','#9fb7a4',
    '#b28d5d','#416f8c','#a77c74','#839096'];
  let ledger = null;
  let focusedAccount = null;
  let paymentFilter = 'all';
  let focusedInvoice = -1;
  let searchQuery = '';
  let visibleRowLimit = 12;

  function element(tag, className, html = '') {
    const node = document.createElement(tag);
    if (className) node.className = className;
    node.innerHTML = html;
    return node;
  }
  function overviewTemplate() {
    return `<div class="hoa-motion-total">
      <span class="hoa-motion-kicker">Total Recorded Expenses</span>
      <strong class="hoa-motion-primary" id="hoa-recorded-total">$2,532,174.13</strong>
      <div class="hoa-motion-subtotals">
        <div><small>Paid to Date</small><strong id="hoa-paid-total">$2,522,174.13</strong></div>
        <div><small>Outstanding Bills</small><strong id="hoa-outstanding-total">$10,000.00</strong></div>
      </div>
    </div>
    <p class="hoa-motion-meta">
      Source: HOA Books · Special Assessment 2025 II, Project Expenses.<br>
      Reporting period: January 1, 2025 – November 17, 2026.
      Amounts include project expenses paid from the Operating Account; those
      payments are already included in the totals and are not added again.
    </p>
    <section class="hoa-motion-card" aria-labelledby="hoa-distribution-title">
      <h2 class="hoa-motion-title" id="hoa-distribution-title">Expense Distribution</h2>
      <p class="hoa-motion-helper">Eight HOA accounting categories. Select a bar to expand its payment summary and filter the transactions below.</p>
      <div class="hoa-distribution-wrap">
        <svg class="hoa-distribution-chart" id="hoa-distribution-chart" viewBox="0 0 240 240" aria-label="Interactive expense distribution by accounting category"></svg>
        <div class="hoa-category-list" id="hoa-category-list"></div>
      </div>
    </section>
    <section class="hoa-motion-card" aria-labelledby="hoa-invoices-title">
      <h2 class="hoa-motion-title" id="hoa-invoices-title">Recorded Transactions</h2>
      <p class="hoa-motion-helper">Vendor, date, amount and payment status from the HOA ledger. Open a record for its reference, accounting category and funding source.</p>
      <label class="hoa-ledger-search"><span aria-hidden="true">⌕</span>
        <input id="hoa-ledger-search" type="search" autocomplete="off" placeholder="Search vendors, references or categories" aria-label="Search recorded transactions">
      </label>
      <div class="hoa-ledger-filter" role="group" aria-label="Payment status">
        <button type="button" data-hoa-filter="all" aria-pressed="true">All entries</button>
        <button type="button" data-hoa-filter="paid" aria-pressed="false">Paid</button>
        <button type="button" data-hoa-filter="open" aria-pressed="false">Outstanding</button>
      </div>
      <div id="hoa-record-count" class="hoa-motion-helper" role="status"></div>
      <div id="hoa-ledger-list" class="hoa-ledger-list"></div>
      <button type="button" id="hoa-ledger-more" class="hoa-ledger-more" data-hoa-more="true" hidden>Show more transactions</button>
    </section>`;
  }

  function buildTabStructure() {
    const chart = document.querySelector('section.ac-chart');
    const construction = document.getElementById('construction-budget-report');
    const operational = document.querySelector('section.p-operational');
    if (!chart || !construction || !operational) return false;
    const mount = chart.parentNode;
    const tabs = element('div', 'hoa-motion-nav', `
      <button class="hoa-tab" type="button" role="tab" aria-controls="hoa-financial-view" aria-selected="true" data-hoa-tab="financial">Financial Overview</button>
      <button class="hoa-tab" type="button" role="tab" aria-controls="hoa-construction-view" aria-selected="false" data-hoa-tab="construction">Construction Budget</button>
      <button class="hoa-tab" type="button" role="tab" aria-controls="hoa-operational-view" aria-selected="false" data-hoa-tab="operational">Operational Projects</button>`);
    tabs.setAttribute('role', 'tablist');
    tabs.setAttribute('aria-label', 'Budget views');
    tabs.id = 'hoa-budget-navigation';
    const financialPanel = element('div', 'hoa-motion-view', overviewTemplate());
    financialPanel.id = 'hoa-financial-view'; financialPanel.setAttribute('role', 'tabpanel');
    const constructionPanel = element('div', 'hoa-motion-view');
    constructionPanel.id = 'hoa-construction-view'; constructionPanel.setAttribute('role', 'tabpanel'); constructionPanel.hidden = true;
    const operationalPanel = element('div', 'hoa-motion-view');
    operationalPanel.id = 'hoa-operational-view'; operationalPanel.setAttribute('role', 'tabpanel'); operationalPanel.hidden = true;
    mount.insertBefore(tabs, chart);
    mount.insertBefore(financialPanel, chart);
    mount.insertBefore(constructionPanel, chart);
    mount.insertBefore(operationalPanel, chart);
    constructionPanel.appendChild(element('p', 'hoa-construction-notice',
      '<strong>Construction budget estimate.</strong> Budgeted values are from the existing project construction tracker. '
      + 'The prior tracked-expense figures are not verified HOA cash-paid totals. '
      + 'Project-level Paid to Date comparisons remain under reconciliation; they are not represented as confirmed payments here.'));
    constructionPanel.appendChild(chart);
    constructionPanel.appendChild(construction);
    operationalPanel.appendChild(operational);
    const staleSummary = construction.querySelector('.pt-summary');
    if (staleSummary) staleSummary.hidden = true;
    const intro = document.querySelector('body > .wrap > .sub');
    if (intro) intro.textContent = 'HOA financial reporting and construction budget tracking.';
    const trackedKey = construction.querySelector('.p-key-help');
    if (trackedKey) trackedKey.textContent = 'MTD construction tracking · reconciliation to HOA Books in progress';
    const allSources = construction.querySelectorAll('.p-source');
    allSources.forEach(node => {
      node.textContent = 'Construction budget estimates: existing project tracker. '
        + 'Recorded expenses and actual payments: HOA Books, reporting period through November 17, 2026. '
        + 'Matching construction scopes to HOA accounting categories is pending review.';
    });
    const constructionHeader = construction.querySelector('.p-header p');
    if (constructionHeader) constructionHeader.textContent =
      'Construction budget allocations and recorded tracker entries by scope. '
      + 'Use Financial Overview for verified HOA accounting and payments.';
    const oldOpsSource = operational.querySelector('.p-source');
    if (oldOpsSource) oldOpsSource.textContent =
      'Operational projects are tracked separately from the Special Assessment. '
      + 'Any budget or expense values require documented funding and accounting sources.';

    // Presentation-only cleanup: legacy source notes refer to a prior snapshot,
    // and must not be mistaken for the current HOA Books accounting ledger.
    const allocationCaption = chart.querySelector('.ac-asof');
    if (allocationCaption) allocationCaption.textContent = 'Construction estimate · 2026';
    const allocationBasis = chart.querySelector('.ac-small');
    if (allocationBasis) allocationBasis.textContent = 'Construction planning total';
    const chartEyebrow = chart.querySelector('.ac-eyebrow');
    if (chartEyebrow) chartEyebrow.textContent = 'Construction budget · Special Assessment';
    const constructionKicker = construction.querySelector('.p-header .p-kicker');
    if (constructionKicker) constructionKicker.textContent = 'CONSTRUCTION BUDGET · SCOPE TRACKING';
    const trackerKey = construction.querySelector('.p-key > span:nth-child(2)');
    if (trackerKey) trackerKey.lastChild.textContent = 'Tracker entries · not confirmed paid';
    construction.querySelectorAll('.pt-note').forEach(node => {
      node.hidden = true;
    });
    const miscSource = construction.querySelector('.p-important small');
    if (miscSource) miscSource.textContent = 'Construction scope tracker';
    const remediation = construction.querySelector('.p-group[data-group="remediation"]');
    const groupList = construction.querySelector('.p-group-list');
    if (remediation && groupList) {
      const fundedSection = element('section', 'hoa-funded-section',
        '<h3>Contingency-Funded Projects</h3>'
        + '<p>Separate planning group; budget allocations are not additional HOA expenses. '
        + 'Actual posted and paid expenses remain in Financial Overview.</p>');
      groupList.parentNode.insertBefore(fundedSection, groupList.nextSibling);
      fundedSection.appendChild(remediation);
      const remediationLabel = remediation.querySelector('.p-group-name small');
      if (remediationLabel) remediationLabel.textContent = 'Funded from contingency · construction tracking';
    }
    const walker = document.createTreeWalker(constructionPanel, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      node.nodeValue = node.nodeValue
        .replace(/MTD test/gi, 'Construction tracker')
        .replace(/Pancho\s*\/\s*2027 tracker/gi, 'Construction scope tracker')
        .replace(/\bMTD budget\b/gi, 'Scope budget');
    }

    function select(name) {
      const panels = {financial:financialPanel,construction:constructionPanel,operational:operationalPanel};
      for (const [key, node] of Object.entries(panels)) node.hidden = key !== name;
      tabs.querySelectorAll('[data-hoa-tab]').forEach(button =>
        button.setAttribute('aria-selected', String(button.dataset.hoaTab === name)));
      if (name === 'financial') requestAnimationFrame(() => renderDistribution(true));
    }
    tabs.querySelectorAll('[data-hoa-tab]').forEach(button =>
      button.addEventListener('click', () => select(button.dataset.hoaTab)));
    tabs.addEventListener('keydown', event => {
      if (!['ArrowLeft','ArrowRight'].includes(event.key)) return;
      const buttons = [...tabs.querySelectorAll('[data-hoa-tab]')];
      const current = buttons.findIndex(button => button.getAttribute('aria-selected') === 'true');
      const next = (current + (event.key === 'ArrowRight' ? 1 : -1) + buttons.length) % buttons.length;
      event.preventDefault(); buttons[next].focus(); select(buttons[next].dataset.hoaTab);
    });
    // Leave all legacy DOM intact for rollback; move it under the approved tabs.
    return true;
  }

  function animateNumber(node, value) {
    if (!node) return;
    // Financial figures remain stable, precise and immediately readable.
    // Presentation transitions are handled by CSS opacity, not counting.
    node.textContent = money(value);
  }
  function selectedCategory() {
    return ledger && ledger.categories.find(c => c.account === focusedAccount);
  }
  function renderDistribution(animateBars = false) {
    if (!ledger) return;
    const svg = document.getElementById('hoa-distribution-chart');
    const legend = document.getElementById('hoa-category-list');
    if (!svg || !legend) return;
    const total = ledger.categories.reduce((sum, item) => sum + item.amount, 0);
    const circumference = 2 * Math.PI * 88;
    let offset = 0;
    let segments = '<circle cx="120" cy="120" r="88" stroke="#e9eeea" stroke-width="21" fill="none"/>';
    ledger.categories.forEach((category, index) => {
      const distance = category.amount / total * circumference;
      const pressed = category.account === focusedAccount;
      segments += '<circle class="hoa-chart-segment" data-account="' + safe(category.account)
        + '" tabindex="0" role="button" aria-label="' + safe(category.name) + ', ' + safe(money(category.amount))
        + '" aria-pressed="' + pressed + '" cx="120" cy="120" r="88" fill="none" stroke="' + palette[index]
        + '" stroke-dasharray="' + distance + ' ' + (circumference - distance)
        + '" stroke-dashoffset="' + (-offset) + '" transform="rotate(-90 120 120)"/>';
      offset += distance;
    });
    const selection = selectedCategory();
    segments += '<text class="hoa-chart-label" x="120" y="111" font-size="11" font-weight="700">'
      + (selection ? safe(selection.account) : 'ALL EXPENSES') + '</text>'
      + '<text class="hoa-chart-label" x="120" y="136" font-size="20" font-weight="780">'
      + safe(money(selection ? selection.amount : ledger.total).replace(/\.\d\d$/, '')) + '</text>'
      + '<text class="hoa-chart-label" x="120" y="153" font-size="11">'
      + (selection ? ((selection.amount / ledger.total)*100).toFixed(1) + '% of recorded' : 'HOA BOOKS') + '</text>';
    svg.innerHTML = segments;
    legend.classList.toggle('hoa-bars-animate', animateBars);
    legend.innerHTML = ledger.categories.map((item,index) => {
      const chosen = item.account === focusedAccount;
      const matching = ledger.rows.filter(row => row.account === item.account);
      const paid = matching.filter(row => !!row.paidOn)
        .reduce((sum,row) => sum + row.amount, 0);
      const outstanding = matching.filter(row => !row.paidOn)
        .reduce((sum,row) => sum + row.amount, 0);
      const pct = item.amount / total * 100;
      return '<div class="hoa-category-item' + (chosen ? ' is-open' : '') + '">'
        + '<button type="button" class="hoa-category-choice" data-account="' + safe(item.account)
        + '" aria-expanded="' + chosen + '" aria-controls="hoa-category-inline-' + index
        + '"><span class="hoa-category-swatch" style="background:' + palette[index]
        + '"></span><span class="hoa-category-main"><span class="hoa-category-name">'
        + safe(item.name) + '</span><span class="hoa-category-bar" aria-hidden="true"><i style="--bar-width:'
        + pct.toFixed(2) + '%;--bar-color:' + palette[index] + ';--bar-delay:' + (index*45)
        + 'ms"></i></span></span><span class="hoa-category-numbers"><strong>'
        + safe(money(item.amount)) + '</strong><small>' + pct.toFixed(1)
        + '% <span class="hoa-chevron" aria-hidden="true">⌄</span></small></span></button>'
        + '<div class="hoa-category-inline" id="hoa-category-inline-' + index + '"'
        + (chosen ? '' : ' hidden') + '><div><small>Paid to Date</small><strong>'
        + safe(money(paid)) + '</strong></div><div><small>Outstanding</small><strong>'
        + safe(money(outstanding)) + '</strong></div><p>' + matching.length
        + ' HOA transaction' + (matching.length === 1 ? '' : 's')
        + ' · Matching records are filtered below.</p></div></div>';
    }).join('');
  }
  function renderLedger() {
    if (!ledger) return;
    const list = document.getElementById('hoa-ledger-list');
    const records = ledger.rows.map((row,index) => ({...row,index}))
      .filter(row => (!focusedAccount || row.account === focusedAccount))
      .filter(row => paymentFilter === 'all' || (paymentFilter === 'paid' ? !!row.paidOn : !row.paidOn))
      .filter(row => !searchQuery || [row.vendor,row.category,row.reference,row.date,row.account]
        .some(item => String(item ?? '').toLowerCase().includes(searchQuery)))
      .sort((a,b) => b.date.localeCompare(a.date));
    const visible = records.slice(0,visibleRowLimit);
    list.innerHTML = visible.map(row => {
      const expanded = row.index === focusedInvoice;
      return '<div class="hoa-ledger-entry' + (expanded ? ' is-open' : '') + '">'
      + '<button type="button" class="hoa-ledger-row" data-hoa-invoice="' + row.index
      + '" aria-expanded="' + expanded + '" aria-controls="hoa-ledger-detail-' + row.index
      + '"><div><strong>' + safe(row.vendor) + '</strong><small>'
      + safe(date(row.date)) + ' · ' + safe(row.category) + '</small><span class="hoa-pill'
      + (!row.paidOn ? ' open' : '') + '">' + (row.paidOn ? 'Paid' : 'Outstanding')
      + '</span></div><span class="hoa-value">' + safe(money(row.amount))
      + '</span><span class="hoa-invoice-chevron" aria-hidden="true">⌄</span></button>'
      + '<div class="hoa-ledger-inline-detail" id="hoa-ledger-detail-' + row.index + '"'
      + (expanded ? '' : ' hidden') + '><dl>'
      + '<div><dt>Reference</dt><dd>' + safe(row.reference || 'Not provided') + '</dd></div>'
      + '<div><dt>Recorded</dt><dd>' + safe(date(row.date)) + '</dd></div>'
      + '<div><dt>Paid on</dt><dd>' + (row.paidOn ? safe(date(row.paidOn)) : 'Not paid') + '</dd></div>'
      + '<div><dt>Account</dt><dd>' + safe(row.account) + '</dd></div>'
      + '<div><dt>Transaction type</dt><dd>' + safe(row.type) + '</dd></div>'
      + '<div><dt>Paid from</dt><dd>' + safe(row.paidFrom) + '</dd></div>'
      + '</dl></div></div>';
    }).join('');
    document.getElementById('hoa-record-count').textContent =
      'Showing ' + visible.length + ' of ' + records.length + ' matching transactions · '
      + ledger.rows.length + ' in HOA Books';
    const more = document.getElementById('hoa-ledger-more');
    more.hidden = visible.length >= records.length;
    more.textContent = 'Show ' + Math.min(12, records.length-visible.length) + ' more transactions';
  }
  function selectAccount(account) {
    focusedAccount = focusedAccount === account ? null : account;
    focusedInvoice = -1;
    visibleRowLimit = 12;
    renderDistribution();
    renderLedger();
  }
  function bindControls() {
    const financial = document.getElementById('hoa-financial-view');
    financial.addEventListener('click', event => {
      const category = event.target.closest('[data-account]');
      if (category) { selectAccount(category.dataset.account); return; }
      const filter = event.target.closest('[data-hoa-filter]');
      if (filter) {
        paymentFilter = filter.dataset.hoaFilter; focusedInvoice = -1; visibleRowLimit = 12;
        financial.querySelectorAll('[data-hoa-filter]').forEach(b =>
          b.setAttribute('aria-pressed', String(b === filter)));
        renderLedger(); return;
      }
      if (event.target.closest('[data-hoa-more]')) { visibleRowLimit += 12; renderLedger(); return; }
      const invoice = event.target.closest('[data-hoa-invoice]');
      if (invoice) {
        const selected = Number(invoice.dataset.hoaInvoice);
        focusedInvoice = focusedInvoice === selected ? -1 : selected;
        renderLedger(); return;
      }
    });
    financial.addEventListener('input', event => {
      if (event.target.id !== 'hoa-ledger-search') return;
      searchQuery = event.target.value.trim().toLowerCase();
      visibleRowLimit = 12; focusedInvoice = -1;
      renderLedger();
    });
    financial.addEventListener('keydown', event => {
      const category = event.target.closest('.hoa-chart-segment');
      if (category && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault(); selectAccount(category.dataset.account);
      }
    });
  }
  async function init() {
    if (!document.getElementById('construction-budget-report')) return;
    if (!buildTabStructure()) return;
    bindControls();
    const status = document.getElementById('hoa-record-count');
    status.textContent = 'Loading the HOA accounting report…';
    try {
      const response = await fetch(dataUrl, { cache:'no-store' });
      if (!response.ok) throw new Error('HTTP ' + response.status);
      const next = await response.json();
      const total = next.categories.reduce((sum, category) => sum + category.amount, 0);
      const invoices = next.rows.reduce((sum, row) => sum + row.amount, 0);
      const unpaid = next.rows.filter(row => !row.paidOn).reduce((sum,row) => sum + row.amount, 0);
      if (Math.abs(total-next.total)>.01 || Math.abs(invoices-next.total)>.01 ||
          Math.abs(unpaid-next.outstanding)>.01 ||
          Math.abs((next.paid+next.outstanding)-next.total)>.01)
        throw new Error('HOA totals do not reconcile');
      ledger = next;
      animateNumber(document.getElementById('hoa-recorded-total'), ledger.total);
      animateNumber(document.getElementById('hoa-paid-total'), ledger.paid);
      animateNumber(document.getElementById('hoa-outstanding-total'), ledger.outstanding);
      renderDistribution(true); renderLedger();
      window.__collinsFinancialQA = Object.freeze({
        source: ledger.source, periodEnd: ledger.end,
        categoryCount: ledger.categories.length,
        invoiceCount: ledger.rows.length,
        reconciled: true
      });
    } catch (error) {
      status.textContent = 'The HOA detail ledger could not be loaded. No estimated or replacement amounts are shown.';
      document.getElementById('hoa-recorded-total').textContent = 'Unavailable';
      document.getElementById('hoa-paid-total').textContent = 'Unavailable';
      document.getElementById('hoa-outstanding-total').textContent = 'Unavailable';
      console.error('HOA financial source validation:', error);
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
})();
