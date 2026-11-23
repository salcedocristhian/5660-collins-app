/* Staging-only financial presentation. Source rows remain a byte-for-byte
   read-only mirror of HOA Books. The construction tracker is NOT cash paid. */
(() => {
  'use strict';
  const dataUrl = './data/hoa-ledger-20261117.json';
  const originalBudgetUrl = './data/assessment-baseline-2025.json';
  const money = amount => new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', minimumFractionDigits: 2
  }).format(Number(amount) || 0);
  const date = value => value ? new Intl.DateTimeFormat('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC'
  }).format(new Date(value + 'T12:00:00Z')) : '—';
  const safe = input => String(input == null ? '' : input).replace(/[&<>"']/g,
    c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));
  const whole = amount => new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', maximumFractionDigits: 0
  }).format(amount);
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
      This is a dated HOA Books export, not a live accounting connection.
      Amounts include project expenses paid from the Operating Account; those
      payments are already included in the totals and are not added again.
    </p>
    <section class="hoa-motion-card" aria-labelledby="hoa-distribution-title">
      <h2 class="hoa-motion-title" id="hoa-distribution-title">Expense Distribution</h2>
      <p class="hoa-motion-helper">How the recorded expenses are distributed across eight HOA accounting categories. Select any category to see its payment details and related transactions.</p>
      <div class="hoa-distribution-wrap">
        <div class="hoa-chart-visual">
          <svg class="hoa-distribution-chart" id="hoa-distribution-chart" viewBox="0 0 240 240" aria-label="Interactive expense distribution by accounting category"></svg>
          <p class="hoa-chart-caption">Recorded HOA expenses · by account</p>
        </div>
        <div class="hoa-category-list" id="hoa-category-list" aria-label="HOA expense categories"></div>
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

  function validateOriginalBudget(source) {
    const sum = items => items.reduce((total, item) => total + item.amount, 0);
    if (!source || !Array.isArray(source.periods) || source.periods.length !== 3 ||
        !Number.isFinite(source.originalContingency) ||
        !Number.isFinite(source.assessmentTotal) ||
        !Number.isFinite(source.proposedRemediationScope) ||
        !Number.isFinite(source.mtdRemediationTrackerEntries))
      throw new Error('Missing original assessment budget fields');
    for (const period of source.periods) {
      if (!Number.isInteger(period.year) || !Array.isArray(period.items) ||
          !period.items.every(item => item.id && item.name && Number.isFinite(item.amount) && item.amount >= 0) ||
          Math.abs(sum(period.items) - period.projectSubtotal) > .01)
        throw new Error('Assessment line items do not match period total: ' + period.year);
    }
    const projectTotal = source.periods.reduce((total, period) => total + period.projectSubtotal, 0);
    if (Math.abs(projectTotal + source.originalContingency - source.assessmentTotal) > .01)
      throw new Error('Original assessment total does not reconcile');
    if (source.periods.map(period => period.year).join(',') !== '2026,2028,2030')
      throw new Error('Unexpected original assessment periods');
    if (!Array.isArray(source.trackerComparisons) || source.trackerComparisons.length !== 2 ||
        !source.trackerComparisons.every(item => Number.isFinite(item.originalBudget) &&
          Number.isFinite(item.mtdPlanningEstimate) && Number.isFinite(item.mtdTrackedEntries)))
      throw new Error('Tracker comparison data is incomplete');
    return projectTotal;
  }

  function markPlanningComparisons(source) {
    for (const item of source.trackerComparisons) {
      const section = document.querySelector('.p-group[data-group="' + item.id + '"]');
      if (!section) continue;
      const caption = section.querySelector('.p-group-name small');
      if (caption) caption.textContent = '2025 assessment budget · MTD scope review';
      const summary = section.querySelector('.p-group-values');
      if (summary) summary.innerHTML = '<strong>' + safe(whole(item.originalBudget))
        + '</strong><small>Original budget · MTD estimate ' + safe(whole(item.mtdPlanningEstimate))
        + ' under review</small>';
      const body = section.querySelector('.p-group-body');
      const existingForecast = body && body.querySelector('.pt-forecast');
      if (existingForecast) existingForecast.textContent =
        'Original assessment budget: ' + whole(item.originalBudget)
        + ' · MTD planning estimate: ' + whole(item.mtdPlanningEstimate)
        + ' · MTD tracker entries: ' + money(item.mtdTrackedEntries);
      const budgetBar = section.querySelector(':scope > .p-bars .p-barrow:first-child b');
      if (budgetBar) budgetBar.textContent = money(item.originalBudget);
      const comparisonBars = section.querySelector(':scope > .p-bars');
      if (comparisonBars) comparisonBars.hidden = false;
      const trackingBar = section.querySelector(':scope > .p-bars .p-barrow:nth-child(2)');
      if (trackingBar) {
        const pct = item.mtdTrackedEntries / item.originalBudget * 100;
        const fill = trackingBar.querySelector('i');
        if (fill) fill.style.width = Math.min(100, pct).toFixed(1) + '%';
        const label = trackingBar.querySelector('span');
        if (label) label.textContent = 'MTD entries';
      }
      const detail = element('p', 'hoa-budget-variance-note',
        '<strong>Budget reconciliation:</strong> Original ' + safe(whole(item.originalBudget))
        + ' · MTD planning ' + safe(whole(item.mtdPlanningEstimate))
        + ' · Difference +' + safe(whole(item.mtdPlanningEstimate-item.originalBudget))
        + '. ' + safe(item.status));
      if (body) body.prepend(detail);
    }
  }

  function renderOriginalBudget(source, projectTotal) {
    const panel = document.getElementById('hoa-original-budget');
    if (!panel) return;
    const flagged = source.periods[0].items.filter(item => item.reviewedByEvelyn);
    const flaggedTotal = flagged.reduce((total, item) => total + item.amount, 0);
    const proposed = source.proposedRemediationScope;
    const illustrativeRemaining = source.originalContingency - proposed;
    const pct = Math.max(0, Math.min(100, proposed / source.originalContingency * 100));
    panel.innerHTML = '<div class="hoa-original-head"><div><span class="hoa-original-kicker">Original 2025 Special Assessment</span>'
      + '<h2>Approved budget baseline</h2><p>Original project allocations from the SPA schedule, separate from later MTD estimates and HOA recorded expenses.</p>'
      + '</div><span class="hoa-original-status">Baseline snapshot</span></div>'
      + '<div class="hoa-original-metrics">'
      + '<div class="hoa-original-primary"><small>Total assessment</small><strong>' + safe(whole(source.assessmentTotal)) + '</strong></div>'
      + '<div><small>Original project allocations</small><strong>' + safe(whole(projectTotal)) + '</strong></div>'
      + '<div><small>Original contingency</small><strong>' + safe(whole(source.originalContingency)) + '</strong></div></div>'
      + '<div class="hoa-original-periods">' + source.periods.map(period =>
        '<div><small>' + period.year + ' planned projects</small><strong>' + safe(whole(period.projectSubtotal)) + '</strong></div>'
      ).join('') + '</div>'
      + '<section class="hoa-original-reserve" aria-labelledby="hoa-reserve-title"><div class="hoa-original-section-head">'
      + '<h3 id="hoa-reserve-title">Contingency reserve</h3><span>Proposed allocation · review needed</span></div>'
      + '<div class="hoa-original-reserve-row"><span>Original SPA contingency</span><strong>' + safe(whole(source.originalContingency)) + '</strong></div>'
      + '<div class="hoa-original-reserve-row"><span>MTD remediation scopes proposed</span><strong>−' + safe(money(proposed)) + '</strong></div>'
      + '<div class="hoa-original-reserve-balance"><span>Potential unallocated balance</span><strong>' + safe(money(illustrativeRemaining)) + '</strong></div>'
      + '<div class="hoa-original-progress" aria-label="' + pct.toFixed(1) + '% provisionally allocated"><span style="width:' + pct.toFixed(1) + '%"></span></div>'
      + '<p class="hoa-original-disclosure">Illustration only if the proposed remediation scopes are authorized against contingency. '
      + 'These amounts are not confirmed cash expenditures or an approved transfer. The MTD tracker lists '
      + safe(money(source.mtdRemediationTrackerEntries)) + ' in scope entries; HOA recorded payments are reported separately. '
      + 'The 2030 projects remain separately budgeted and are not assumed to be available contingency.</p></section>'
      + '<section class="hoa-original-review" aria-labelledby="hoa-review-title"><div class="hoa-original-section-head">'
      + '<h3 id="hoa-review-title">Original 2026 line items</h3><span>' + safe(whole(flaggedTotal)) + ' highlighted for review</span></div>'
      + '<p>These four approved budget lines are included in the 2026 total; they are not additional funding.</p>'
      + flagged.map(item => '<div class="hoa-original-line" data-original-budget="' + safe(item.id) + '"><span>'
        + safe(item.name) + '</span><strong>' + safe(whole(item.amount)) + '</strong></div>').join('') + '</section>'
      + '<details class="hoa-original-details"><summary>View all original budget line items <span aria-hidden="true">⌄</span></summary>'
      + source.periods.map(period => '<div class="hoa-original-year"><h4>' + period.year + ' planned projects</h4>'
        + period.items.map(item => '<div class="hoa-original-line"><span>' + safe(item.name)
          + '</span><strong>' + safe(whole(item.amount)) + '</strong></div>').join('')
        + '<div class="hoa-original-line total"><span>Subtotal</span><strong>'
        + safe(whole(period.projectSubtotal)) + '</strong></div></div>').join('')
      + '</details><p class="hoa-original-source">Source: ' + safe(source.source)
      + ' · snapshot reviewed ' + safe(date(source.sourceAsOf))
      + '. This is a static assessment schedule; the HOA Books expense report has a separate reporting date.</p>';
    markPlanningComparisons(source);
    window.__collinsOriginalBudgetQA = Object.freeze({
      assessedTotal: source.assessmentTotal, projectTotal,
      originalContingency: source.originalContingency,
      highlighted2026: flaggedTotal, provisionalRemaining: illustrativeRemaining,
      reconciled: true
    });
  }

  async function loadOriginalBudget() {
    const panel = document.getElementById('hoa-original-budget');
    if (!panel) return;
    try {
      const response = await fetch(originalBudgetUrl, {cache:'no-store'});
      if (!response.ok) throw new Error('HTTP ' + response.status);
      const source = await response.json();
      const projectTotal = validateOriginalBudget(source);
      renderOriginalBudget(source, projectTotal);
    } catch (error) {
      panel.innerHTML = '<h2>Original assessment budget unavailable</h2>'
        + '<p>The budget source could not be verified. No provisional figures are shown.</p>';
      console.error('Original assessment validation:', error);
    }
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
      '<strong>Construction budget cross-check.</strong> The original 2025 assessment schedule is listed below. '
      + 'The MTD project tracker may include expanded scopes, which are not automatically approved budget increases. '
      + 'The prior tracked-expense figures are not verified HOA cash-paid totals. '
      + 'Project-level Paid to Date comparisons remain under reconciliation; they are not represented as confirmed payments here.'));
    const originalPanel = element('section', 'hoa-original-budget',
      '<p>Loading the original 2025 assessment schedule…</p>');
    originalPanel.id = 'hoa-original-budget';
    originalPanel.setAttribute('aria-label', 'Original 2025 assessment budget and contingency reconciliation');
    constructionPanel.appendChild(originalPanel);
    constructionPanel.appendChild(chart);
    constructionPanel.appendChild(construction);
    operationalPanel.appendChild(operational);
    // Do not present MTD planning estimates as approved budget figures while
    // the original SPA schedule is still loading or cannot be verified.
    for (const id of ['dewater', 'exterior']) {
      const group = construction.querySelector('.p-group[data-group="' + id + '"]');
      if (!group) continue;
      const caption = group.querySelector('.p-group-name small');
      if (caption) caption.textContent = 'Original 2025 budget verification pending';
      const summary = group.querySelector('.p-group-values');
      if (summary) summary.innerHTML =
        '<strong>Verifying budget</strong><small>MTD estimate is not an approved budget</small>';
      const bars = group.querySelector(':scope > .p-bars');
      if (bars) bars.hidden = true;
    }
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
    if (allocationCaption) allocationCaption.textContent = 'Original 2025 assessment';
    const allocationBasis = chart.querySelector('.ac-small');
    if (allocationBasis) allocationBasis.textContent = 'Original assessment total';
    const chartEyebrow = chart.querySelector('.ac-eyebrow');
    if (chartEyebrow) chartEyebrow.textContent = 'Original 2025 Special Assessment';
    const constructionKicker = construction.querySelector('.p-header .p-kicker');
    if (constructionKicker) constructionKicker.textContent = 'MTD CONSTRUCTION TRACKER · SCOPE ESTIMATES';
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
    let categoryArcs = '';
    ledger.categories.forEach((category, index) => {
      const distance = category.amount / total * circumference;
      const pressed = category.account === focusedAccount;
      categoryArcs += '<circle class="hoa-chart-segment" data-account="' + safe(category.account)
        + '" tabindex="0" role="button" aria-label="' + safe(category.name) + ', ' + safe(money(category.amount))
        + '" aria-pressed="' + pressed + '" cx="120" cy="120" r="88" fill="none" stroke="' + palette[index]
        + '" stroke-dasharray="' + distance + ' ' + (circumference - distance)
        + '" stroke-dashoffset="' + (-offset) + '"/>';
      offset += distance;
    });
    // Only the non-interactive parent group is rotated; arcs keep native SVG geometry.
    segments += '<g transform="rotate(-90 120 120)">' + categoryArcs + '</g>';
    const selection = selectedCategory();
    segments += '<text class="hoa-chart-label" x="120" y="111" font-size="11" font-weight="700">'
      + (selection ? 'ACCOUNT ' + safe(selection.account) : 'HOA BOOKS') + '</text>'
      + '<text class="hoa-chart-label" x="120" y="136" font-size="20" font-weight="780">'
      + safe(money(selection ? selection.amount : ledger.total).replace(/\.\d\d$/, '')) + '</text>'
      + '<text class="hoa-chart-label" x="120" y="153" font-size="11">'
      + (selection ? ((selection.amount / ledger.total)*100).toFixed(1) + '% of recorded' : 'RECORDED EXPENSES') + '</text>';
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
        + 'ms"></i></span><span class="hoa-category-code">Account ' + safe(item.account) + '</span></span><span class="hoa-category-numbers"><strong>'
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
    loadOriginalBudget();
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
