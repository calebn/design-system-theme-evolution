/**
 * diff-tokens.ts
 *
 * Compares two token versions and classifies every change as:
 *   - unchanged  (same name, same value)
 *   - restyle    (same name, different value) → patch
 *   - added      (only in new)               → minor
 *   - removed    (only in old)               → BREAKING / major
 *
 * Also detects brand-contract mismatches: a token added to one brand
 * but not the other (which would cause inconsistent component behaviour).
 *
 * Usage:
 *   tsx build/diff-tokens.ts 1.0.0 1.1.0
 *   tsx build/diff-tokens.ts 1.1.0 2.0.0
 *   tsx build/diff-tokens.ts 1.0.0 current   (compares to live tokens/)
 *
 * Exit codes:
 *   0 — non-breaking changes only (patch or minor)
 *   1 — breaking changes detected (major)
 */

import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = resolve(__dirname, '..');

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ChangeType = 'unchanged' | 'restyle' | 'added' | 'removed';
type SemverBump = 'none' | 'patch' | 'minor' | 'major';

interface TokenChange {
  path: string;
  type: ChangeType;
  oldValue?: unknown;
  newValue?: unknown;
}

interface BrandDiff {
  brand: string;
  changes: TokenChange[];
  semverBump: SemverBump;
}

interface DiffResult {
  fromVersion: string;
  toVersion: string;
  brands: BrandDiff[];
  contractMismatches: string[];
  overallBump: SemverBump;
  isBreaking: boolean;
}

// ---------------------------------------------------------------------------
// Helpers (shared with build-tokens.ts — intentionally inlined for standalone use)
// ---------------------------------------------------------------------------

function loadTokenDir(dir: string): Record<string, unknown> {
  if (!existsSync(dir)) return {};
  const merged: Record<string, unknown> = {};
  for (const file of readdirSync(dir).filter((f) => f.endsWith('.json'))) {
    const raw = JSON.parse(readFileSync(join(dir, file), 'utf-8')) as Record<string, unknown>;
    Object.assign(merged, raw);
  }
  return merged;
}

function flattenTokens(
  obj: Record<string, unknown>,
  prefix = '',
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  const inheritedType = obj['$type'];

  for (const [key, val] of Object.entries(obj)) {
    if (key.startsWith('$')) continue;
    const path = prefix ? `${prefix}.${key}` : key;

    if (typeof val === 'object' && val !== null && '$value' in (val as object)) {
      result[path] = (val as { $value: unknown }).$value;
    } else if (typeof val === 'object' && val !== null) {
      const nested = val as Record<string, unknown>;
      if (!('$value' in nested)) {
        const sub = flattenTokens(
          { $type: (nested['$type'] ?? inheritedType) as string, ...nested },
          path,
        );
        Object.assign(result, sub);
      }
    }
  }
  return result;
}

function loadFlatTokens(tokenSourceDir: string, brand: string): Record<string, unknown> {
  const coreDir = join(tokenSourceDir, 'core');
  const brandDir = join(tokenSourceDir, 'brand', brand);
  const coreTokens = loadTokenDir(coreDir);
  const brandTokens = loadTokenDir(brandDir);
  return {
    ...flattenTokens(coreTokens),
    ...flattenTokens(brandTokens),
  };
}

function resolveVersionDir(version: string): string {
  if (version === 'current') return join(ROOT, 'tokens');
  return join(ROOT, 'tokens-history', version);
}

// ---------------------------------------------------------------------------
// Diff logic
// ---------------------------------------------------------------------------

function diffBrand(
  brand: string,
  oldTokens: Record<string, unknown>,
  newTokens: Record<string, unknown>,
): BrandDiff {
  const changes: TokenChange[] = [];
  const allKeys = new Set([...Object.keys(oldTokens), ...Object.keys(newTokens)]);

  for (const path of Array.from(allKeys).sort()) {
    const inOld = path in oldTokens;
    const inNew = path in newTokens;

    if (inOld && inNew) {
      const oldVal = JSON.stringify(oldTokens[path]);
      const newVal = JSON.stringify(newTokens[path]);
      if (oldVal === newVal) {
        changes.push({ path, type: 'unchanged' });
      } else {
        changes.push({ path, type: 'restyle', oldValue: oldTokens[path], newValue: newTokens[path] });
      }
    } else if (inNew) {
      changes.push({ path, type: 'added', newValue: newTokens[path] });
    } else {
      changes.push({ path, type: 'removed', oldValue: oldTokens[path] });
    }
  }

  const hasRemoved = changes.some((c) => c.type === 'removed');
  const hasAdded = changes.some((c) => c.type === 'added');
  const hasRestyled = changes.some((c) => c.type === 'restyle');

  let semverBump: SemverBump = 'none';
  if (hasRemoved) semverBump = 'major';
  else if (hasAdded) semverBump = 'minor';
  else if (hasRestyled) semverBump = 'patch';

  return { brand, changes, semverBump };
}

function detectContractMismatches(brandDiffs: BrandDiff[]): string[] {
  const mismatches: string[] = [];
  if (brandDiffs.length < 2) return mismatches;

  const addedPerBrand = brandDiffs.map((d) =>
    new Set(d.changes.filter((c) => c.type === 'added').map((c) => c.path)),
  );
  const removedPerBrand = brandDiffs.map((d) =>
    new Set(d.changes.filter((c) => c.type === 'removed').map((c) => c.path)),
  );

  const allAdded = new Set(brandDiffs.flatMap((d) =>
    d.changes.filter((c) => c.type === 'added').map((c) => c.path),
  ));
  const allRemoved = new Set(brandDiffs.flatMap((d) =>
    d.changes.filter((c) => c.type === 'removed').map((c) => c.path),
  ));

  for (const path of allAdded) {
    const brandsWithToken = addedPerBrand
      .map((set, i) => (set.has(path) ? brandDiffs[i].brand : null))
      .filter(Boolean);
    if (brandsWithToken.length < brandDiffs.length) {
      const missing = brandDiffs.map((d) => d.brand).filter((b) => !brandsWithToken.includes(b));
      mismatches.push(`Token "${path}" added in [${brandsWithToken.join(', ')}] but missing from [${missing.join(', ')}]`);
    }
  }

  for (const path of allRemoved) {
    const brandsRemoved = removedPerBrand
      .map((set, i) => (set.has(path) ? brandDiffs[i].brand : null))
      .filter(Boolean);
    if (brandsRemoved.length < brandDiffs.length) {
      const kept = brandDiffs.map((d) => d.brand).filter((b) => !brandsRemoved.includes(b));
      mismatches.push(`Token "${path}" removed from [${brandsRemoved.join(', ')}] but still present in [${kept.join(', ')}]`);
    }
  }

  return mismatches;
}

function bumpPriority(a: SemverBump, b: SemverBump): SemverBump {
  const order: SemverBump[] = ['none', 'patch', 'minor', 'major'];
  return order[Math.max(order.indexOf(a), order.indexOf(b))];
}

// ---------------------------------------------------------------------------
// Output formatting
// ---------------------------------------------------------------------------

const ICONS: Record<ChangeType, string> = {
  unchanged: '·',
  restyle: '~',
  added: '+',
  removed: '✖',
};

const BUMP_LABEL: Record<SemverBump, string> = {
  none: 'no change',
  patch: 'PATCH (1.x.x → 1.x.x+1)',
  minor: 'MINOR (1.x.x → 1.x+1.0)',
  major: '⚠️  MAJOR / BREAKING (1.x.x → 2.0.0)',
};

export function printDiff(result: DiffResult): void {
  const line = '─'.repeat(60);
  console.log(`\n${line}`);
  console.log(`  Token diff: ${result.fromVersion}  →  ${result.toVersion}`);
  console.log(line);

  for (const brandDiff of result.brands) {
    const nonTrivial = brandDiff.changes.filter((c) => c.type !== 'unchanged');
    if (nonTrivial.length === 0) {
      console.log(`\n[${brandDiff.brand}]  no changes`);
      continue;
    }

    console.log(`\n[${brandDiff.brand}]  suggested bump: ${BUMP_LABEL[brandDiff.semverBump]}`);

    for (const change of nonTrivial) {
      const icon = ICONS[change.type];
      if (change.type === 'restyle') {
        console.log(`  ${icon}  ${change.path}`);
        console.log(`        was: ${JSON.stringify(change.oldValue)}`);
        console.log(`        now: ${JSON.stringify(change.newValue)}`);
      } else if (change.type === 'added') {
        console.log(`  ${icon}  ${change.path}  =  ${JSON.stringify(change.newValue)}`);
      } else if (change.type === 'removed') {
        console.log(`  ${icon}  ${change.path}  (was ${JSON.stringify(change.oldValue)})`);
      }
    }
  }

  if (result.contractMismatches.length > 0) {
    console.log(`\n⚠️  Brand contract mismatches (tokens must be defined in ALL brands):`);
    for (const m of result.contractMismatches) {
      console.log(`  • ${m}`);
    }
  }

  console.log(`\n${line}`);
  console.log(`  Overall suggested bump: ${BUMP_LABEL[result.overallBump]}`);
  if (result.isBreaking) {
    console.log(`  ❌ BREAKING CHANGES DETECTED`);
  } else {
    console.log(`  ✅ No breaking changes`);
  }
  console.log(line);
}

// ---------------------------------------------------------------------------
// Export for use by check-breaking.ts and the React app
// ---------------------------------------------------------------------------

export function runDiff(fromVersion: string, toVersion: string): DiffResult {
  const brands = ['logos', 'verbum'];
  const oldDir = resolveVersionDir(fromVersion);
  const newDir = resolveVersionDir(toVersion);

  const brandDiffs: BrandDiff[] = brands.map((brand) => {
    const oldTokens = loadFlatTokens(oldDir, brand);
    const newTokens = loadFlatTokens(newDir, brand);
    return diffBrand(brand, oldTokens, newTokens);
  });

  const contractMismatches = detectContractMismatches(brandDiffs);
  const overallBump = brandDiffs.reduce(
    (acc, d) => bumpPriority(acc, d.semverBump),
    'none' as SemverBump,
  );
  const hasMismatches = contractMismatches.length > 0;
  const isBreaking = overallBump === 'major' || hasMismatches;

  return {
    fromVersion,
    toVersion,
    brands: brandDiffs,
    contractMismatches,
    overallBump,
    isBreaking,
  };
}

// ---------------------------------------------------------------------------
// CLI entry point — only runs when called directly, not when imported
// ---------------------------------------------------------------------------

const isMain =
  process.argv[1] != null &&
  (process.argv[1].endsWith('diff-tokens.ts') || process.argv[1].endsWith('diff-tokens.js'));

if (isMain) {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error('Usage: tsx build/diff-tokens.ts <fromVersion> <toVersion>');
    console.error('  e.g. tsx build/diff-tokens.ts 1.0.0 1.1.0');
    console.error('  e.g. tsx build/diff-tokens.ts 1.1.0 current');
    process.exit(1);
  }

  const result = runDiff(args[0], args[1]);
  printDiff(result);
  process.exit(result.isBreaking ? 1 : 0);
}
