/* Read-only regression check for the original 2025 assessment display. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const source = JSON.parse(read('data/assessment-baseline-2025.json'));
const ledger = JSON.parse(read('data/hoa-ledger-20261117.json'));
const assessment = read('assessment.html');
const financialJs = read('assets/financial-overview.js');
const index = read('index.html');

const periodTotals = new Map(source.periods.map(period => {
  const lineTotal = period.items.reduce((sum, item) => sum + item.amount, 0);
  assert.equal(lineTotal, period.projectSubtotal, `${period.year} line item total`);
  return [period.year, lineTotal];
}));
assert.deepEqual([...periodTotals.keys()], [2026, 2028, 2030]);
assert.equal(periodTotals.get(2026), 5310398);
assert.equal(periodTotals.get(2028), 1057563);
assert.equal(periodTotals.get(2030), 92744);
const originalProjects = [...periodTotals.values()].reduce((sum, n) => sum + n, 0);
assert.equal(originalProjects, 6460705);
assert.equal(source.originalContingency, 1039295);
assert.equal(originalProjects + source.originalContingency, source.assessmentTotal);
assert.equal(source.assessmentTotal, 7500000);
const evelynLines = source.periods[0].items.filter(item => item.reviewedByEvelyn);
assert.equal(evelynLines.length, 4);
assert.equal(evelynLines.reduce((sum, item) => sum + item.amount, 0), 472673);
assert.deepEqual(source.trackerComparisons.map(item => item.mtdPlanningEstimate-item.originalBudget), [327673,237020]);
assert.equal(Math.round((source.originalContingency-source.proposedRemediationScope)*100),38072875);
assert.equal(source.originalContingency+periodTotals.get(2030),1132039);

const validatorCode = financialJs.match(/  function validateOriginalBudget\(source\) \{([\s\S]*?)\n  \}\n\n  function markPlanningComparisons/);
assert.ok(validatorCode, 'Client-side budget verification is present');
const validateOriginalBudget = vm.runInNewContext('(function validateOriginalBudget(source) {' + validatorCode[1] + '\n})');
assert.equal(validateOriginalBudget(source), originalProjects);
const invalidSource = JSON.parse(JSON.stringify(source));
invalidSource.periods[0].items[0].amount += 1;
assert.throws(() => validateOriginalBudget(invalidSource), /do not match period total/);

const projectsCode = assessment.match(/const projects=\[([\s\S]*?)\];\s*const trades=/);
assert.ok(projectsCode, 'Existing allocation chart model');
const projectModels = vm.runInNewContext('[' + projectsCode[1] + ']');
assert.equal(projectModels.reduce((sum, item) => sum + item.budget, 0), 7500000);
assert.equal(projectModels.find(item => item.id === 'contingency').budget, 1039295);
assert.equal(projectModels.find(item => item.id === 'planned2030').budget, 92744);
assert.equal(projectModels.find(item => item.id === 'dewater').budget, 372000);
assert.equal(projectModels.find(item => item.id === 'exterior2028').budget, 1057563);
assert.match(index, /assessment-baseline-20261123-v1/);
assert.match(financialJs, /This is a dated HOA Books export, not a live accounting connection/);

const accountingCategoryTotal = ledger.categories.reduce((sum, item) => sum + item.amount, 0);
const accountingRowTotal = ledger.rows.reduce((sum, row) => sum + row.amount, 0);
assert.ok(Math.abs(accountingCategoryTotal-ledger.total) < .01);
assert.ok(Math.abs(accountingRowTotal-ledger.total) < .01);
assert.ok(Math.abs(ledger.paid + ledger.outstanding - ledger.total) < .01);
console.log('PASS: original assessment, 2026 flagged lines, 2030 reserve distinction, chart and HOA snapshot reconcile');
