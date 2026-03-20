import * as fs from 'fs';
import * as path from 'path';
import type { TokenMigrationItem, MigrationStatus, MigrationPriority } from './types.js';

const ROOT = path.resolve(import.meta.dirname, '..');
const RAW_DIR = path.join(ROOT, 'raw');
const DATA_DIR = path.join(ROOT, 'data');

interface ExtractedEntry {
	value?: string;
	nodeId: string;
	status: string;
	duplicateOf?: string;
	variableKey?: string;
	note?: string;
	scope?: string;
}

interface ExtractedFile {
	_note: string;
	_source: string;
	colors: Record<string, ExtractedEntry>;
	gradients: Record<string, ExtractedEntry>;
	shadows: Record<string, ExtractedEntry>;
	typography: Record<string, ExtractedEntry & { variableCounterpart?: string }>;
}

function loadExtracted(): ExtractedFile {
	const p = path.join(RAW_DIR, 'figma-brand-styles-extracted.json');
	return JSON.parse(fs.readFileSync(p, 'utf-8')) as ExtractedFile;
}

function loadExistingVariables(): Set<string> {
	const p = path.join(RAW_DIR, 'figma-variables.json');
	const raw = JSON.parse(fs.readFileSync(p, 'utf-8')) as Record<string, string>;
	return new Set(Object.keys(raw));
}

function groupFromName(styleName: string): string {
	const slash = styleName.indexOf('/');
	return slash > -1 ? styleName.slice(0, slash) : styleName;
}

function resolveStatus(entry: ExtractedEntry, existingVars: Set<string>, styleName: string): MigrationStatus {
	if (entry.status === 'variable') return 'variable';
	if (entry.duplicateOf && existingVars.has(entry.duplicateOf)) return 'duplicate';
	if (entry.variableKey && existingVars.has(entry.variableKey)) return 'variable';
	if (entry.status === 'local-style-only') return 'local-style-only';
	return 'missing';
}

function colorPriority(styleName: string, status: MigrationStatus): MigrationPriority {
	if (status === 'variable') return 'low';
	if (styleName.startsWith('Primary/')) return 'critical';
	if (styleName.startsWith('Secondary/')) return 'high';
	if (styleName.startsWith('Deep Colors/') || styleName.startsWith('Neutral/')) return 'high';
	if (styleName.startsWith('Bright Colors/') || styleName.startsWith('Core Swatches/')) return 'medium';
	if (styleName.startsWith('Logos Swatches/')) return 'medium';
	if (styleName.startsWith('Verbum/')) return 'low';
	return 'medium';
}

function shadowPriority(styleName: string, status: MigrationStatus): MigrationPriority {
	if (status === 'variable') return 'low';
	if (styleName.startsWith('Shadows/') && !styleName.includes('L9')) return 'high';
	if (styleName.startsWith('Product Shadows/')) return 'high';
	if (styleName.startsWith('Shadows - L9/')) return 'medium';
	return 'medium';
}

function buildColorItems(extracted: ExtractedFile, existingVars: Set<string>): TokenMigrationItem[] {
	const items: TokenMigrationItem[] = [];
	for (const [styleName, entry] of Object.entries(extracted.colors)) {
		const status = resolveStatus(entry, existingVars, styleName);
		const priority = colorPriority(styleName, status);
		const notes = entry.note ?? (entry.duplicateOf ? `Same value as ${entry.duplicateOf} — consolidate` : '');
		items.push({
			styleName,
			group: groupFromName(styleName),
			type: 'color',
			status,
			extractedValue: entry.value,
			existingVariableKey: entry.variableKey ?? entry.duplicateOf,
			priority,
			notes,
			...(entry.scope === 'sub-brand' ? { scope: 'sub-brand' as const } : {}),
		});
	}
	return items;
}

function buildGradientItems(extracted: ExtractedFile, existingVars: Set<string>): TokenMigrationItem[] {
	return Object.entries(extracted.gradients).map(([styleName, entry]) => ({
		styleName,
		group: groupFromName(styleName),
		type: 'gradient' as const,
		status: resolveStatus(entry, existingVars, styleName),
		extractedValue: entry.value,
		priority: (entry.scope === 'sub-brand' ? 'low' : 'medium') as MigrationPriority,
		notes: entry.scope === 'sub-brand' ? 'Sub-brand gradient (Verbum)' : 'Page-level gradient — no variable today',
		...(entry.scope === 'sub-brand' ? { scope: 'sub-brand' as const } : {}),
	}));
}

function buildShadowItems(extracted: ExtractedFile, existingVars: Set<string>): TokenMigrationItem[] {
	return Object.entries(extracted.shadows).map(([styleName, entry]) => {
		const status = resolveStatus(entry, existingVars, styleName);
		return {
			styleName,
			group: groupFromName(styleName),
			type: 'shadow' as const,
			status,
			extractedValue: entry.value,
			existingVariableKey: entry.variableKey,
			priority: shadowPriority(styleName, status),
			notes: entry.note ?? '',
		};
	});
}

function buildTypographyItems(extracted: ExtractedFile, existingVars: Set<string>): TokenMigrationItem[] {
	return Object.entries(extracted.typography).map(([styleName, entry]) => {
		if (styleName === '_note') return null;
		const hasVariableCounterpart = entry.variableCounterpart && existingVars.has(entry.variableCounterpart);
		const status: MigrationStatus = hasVariableCounterpart ? 'duplicate' : 'local-style-only';
		let priority: MigrationPriority = 'medium';
		if (styleName.startsWith('2023/')) priority = 'high';
		else if (styleName.includes('/Desktop') || styleName.includes('/Mobile') || styleName.includes('/Tablet')) priority = 'medium';
		else if (hasVariableCounterpart) priority = 'low';
		return {
			styleName,
			group: groupFromName(styleName),
			type: 'typography' as const,
			status,
			existingVariableKey: entry.variableCounterpart,
			priority,
			notes: hasVariableCounterpart
				? `Variable ${entry.variableCounterpart} exists — this local style should reference it`
				: (entry.note ?? 'No variable counterpart — needs variable definition'),
		};
	}).filter((x): x is TokenMigrationItem => x !== null);
}

function summarize(items: TokenMigrationItem[]) {
	const counts = { variable: 0, 'local-style-only': 0, duplicate: 0, missing: 0 };
	const byPriority = { critical: 0, high: 0, medium: 0, low: 0 };
	for (const item of items) {
		counts[item.status]++;
		byPriority[item.priority]++;
	}
	return { counts, byPriority, total: items.length };
}

export function runAudit(): void {
	const extracted = loadExtracted();
	const existingVars = loadExistingVariables();

	const colorItems = buildColorItems(extracted, existingVars);
	const gradientItems = buildGradientItems(extracted, existingVars);
	const shadowItems = buildShadowItems(extracted, existingVars);
	const typographyItems = buildTypographyItems(extracted, existingVars);

	const allItems = [...colorItems, ...gradientItems, ...shadowItems, ...typographyItems];

	const output = {
		_generated: new Date().toISOString(),
		summary: summarize(allItems),
		bySummaryType: {
			colors: summarize(colorItems),
			gradients: summarize(gradientItems),
			shadows: summarize(shadowItems),
			typography: summarize(typographyItems),
		},
		items: allItems,
	};

	fs.mkdirSync(DATA_DIR, { recursive: true });
	fs.writeFileSync(path.join(DATA_DIR, 'brand-styles-audit.json'), JSON.stringify(output, null, 2));

	const needsMigration = allItems.filter(i => i.status === 'local-style-only').length;
	const duplicates = allItems.filter(i => i.status === 'duplicate').length;
	const critical = allItems.filter(i => i.priority === 'critical').length;
	console.log(`Brand styles audit: ${allItems.length} total items`);
	console.log(`  ${needsMigration} need migration, ${duplicates} are duplicates, ${critical} critical`);
}

const isMain = process.argv[1]?.endsWith('audit-brand-styles.ts') || process.argv[1]?.endsWith('audit-brand-styles.js');
if (isMain) runAudit();
