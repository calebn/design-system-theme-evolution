/**
 * check-breaking.ts
 *
 * CI gate that enforces the Diagram 1 constraint set from theme_evolution.md:
 *   PERMITTED:   restyle, combine (reduce tokens), add new tokens
 *   FORBIDDEN:   split (a token that existed now maps to multiple new names)
 *                delete (a token is removed entirely)
 *
 * Also enforces: brand-contract integrity (every brand must define every token).
 *
 * Usage:
 *   tsx build/check-breaking.ts <fromVersion> <toVersion>
 *   tsx build/check-breaking.ts 1.0.0 1.1.0      # should pass
 *   tsx build/check-breaking.ts 1.1.0 2.0.0      # should fail (split + delete)
 *   tsx build/check-breaking.ts 1.0.0 current    # compare to live tokens
 *
 * Exit codes:
 *   0 — compliant (no breaking changes, no contract mismatches)
 *   1 — non-compliant (would require a major bump or has brand mismatch)
 */

import { runDiff } from './diff-tokens.js';

const args = process.argv.slice(2);
if (args.length < 2) {
  console.error('Usage: tsx build/check-breaking.ts <fromVersion> <toVersion>');
  process.exit(1);
}

const [fromVersion, toVersion] = args;
const result = runDiff(fromVersion, toVersion);

const line = '═'.repeat(60);
console.log(`\n${line}`);
console.log(`  Governance check: ${fromVersion}  →  ${toVersion}`);
console.log(`  Constraint set: Diagram 1 (restyle · combine · add only)`);
console.log(line);

let passed = true;

for (const brandDiff of result.brands) {
  const removed = brandDiff.changes.filter((c) => c.type === 'removed');
  if (removed.length > 0) {
    passed = false;
    console.log(`\n[${brandDiff.brand}]  ❌ REMOVED tokens (FORBIDDEN under Diagram 1):`);
    for (const c of removed) {
      console.log(`  ✖  ${c.path}  (was ${JSON.stringify(c.oldValue)})`);
    }
  } else {
    const added = brandDiff.changes.filter((c) => c.type === 'added');
    const restyled = brandDiff.changes.filter((c) => c.type === 'restyle');
    const parts = [];
    if (restyled.length > 0) parts.push(`${restyled.length} restyled`);
    if (added.length > 0) parts.push(`${added.length} added`);
    if (parts.length === 0) parts.push('no changes');
    console.log(`\n[${brandDiff.brand}]  ✅ ${parts.join(', ')} — compliant`);
  }
}

if (result.contractMismatches.length > 0) {
  passed = false;
  console.log(`\n❌ Brand contract violations (token must exist in ALL brands):`);
  for (const m of result.contractMismatches) {
    console.log(`  • ${m}`);
  }
}

console.log(`\n${line}`);
if (passed) {
  console.log(`  ✅ PASSED — changes are non-breaking (Diagram 1 compliant)`);
  console.log(`  Suggested bump: ${result.overallBump === 'none' ? 'none' : result.overallBump.toUpperCase()}`);
} else {
  console.log(`  ❌ FAILED — breaking changes detected`);
  console.log(`  To proceed: bump the MAJOR version and provide a migration guide.`);
  console.log(`  To enforce Diagram 1: revert the removed/split tokens.`);
}
console.log(line);

process.exit(passed ? 0 : 1);
