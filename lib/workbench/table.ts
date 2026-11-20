export type Table = {
    columns: string[];
    rows: string[][];
};
export type Step = {
    kind: 'trim' | 'empty' | 'dedupe' | 'headers' | 'lower' | 'upper' | 'replace' | 'filter' | 'split' | 'merge' | 'sort' | 'date';
    column?: string;
    value?: string;
    replacement?: string;
    other?: string;
};
export function uniqueHeaders(values: string[]) { const used = new Set<string>(); return values.map((s, i) => { const base = s.trim() || 'column_' + (i + 1); let key = base, n = 2; while (used.has(key))
    key = base + '_' + n++; used.add(key); return key; }); }
export function validateTable(t: Table): Table { if (!t || !Array.isArray(t.columns) || !Array.isArray(t.rows) || !t.columns.length || t.columns.length > 80 || t.rows.length > 50000 || t.columns.some(c => typeof c !== 'string'))
    throw Error('Use 1–80 columns and at most 50,000 data rows.'); let size = 0; for (const row of t.rows) {
    if (!Array.isArray(row) || row.length !== t.columns.length || row.some(v => typeof v !== 'string'))
        throw Error('Table cells must be text in rectangular rows.');
    for (const v of row)
        size += v.length;
} if (size > 20000000)
    throw Error('Result exceeds the 20 million character limit.'); return t; }
export function detectDelimiter(text: string) { const n: Record<string, number> = { ',': 0, ';': 0, '\t': 0 }; let quote = false; for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') {
        if (quote && text[i + 1] === '"')
            i++;
        else
            quote = !quote;
    }
    else if (!quote) {
        if (c === '\n' || c === '\r')
            break;
        if (Object.hasOwn(n, c))
            n[c]++;
    }
} return Object.keys(n).sort((a, b) => n[b] - n[a])[0]; }
export function parseCSV(input: string, delimiter = detectDelimiter(input)): Table { if (input.length > 5000000)
    throw Error('Keep pasted data under 5 million characters.'); if (![',', ';', '\t'].includes(delimiter))
    throw Error('Choose comma, semicolon or tab.'); const text = input.replace(/^\uFEFF/, ''); let field = '', row: string[] = [], all: string[][] = [], quote = false, closed = false, line = 1; const cell = () => { row.push(field); field = ''; closed = false; if (row.length > 80)
    throw Error('Use at most 80 columns.'); }; const record = () => { cell(); all.push(row); row = []; if (all.length > 50001)
    throw Error('Use at most 50,000 rows.'); }; for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quote) {
        if (c === '"') {
            if (text[i + 1] === '"') {
                field += '"';
                i++;
            }
            else {
                quote = false;
                closed = true;
            }
        }
        else {
            field += c;
            if (c === '\n')
                line++;
        }
        continue;
    }
    if (c === '"') {
        if (field || closed)
            throw Error('Unexpected quote near line ' + line);
        quote = true;
    }
    else if (c === delimiter)
        cell();
    else if (c === '\n' || c === '\r') {
        if (c === '\r' && text[i + 1] === '\n')
            i++;
        record();
        line++;
    }
    else {
        if (closed)
            throw Error('Unexpected text after quote near line ' + line);
        field += c;
    }
} if (quote)
    throw Error('Unclosed quote near line ' + line); if (field || row.length || closed)
    record(); if (!all.length)
    throw Error('Add a header row.'); const columns = uniqueHeaders(all.shift()!); return validateTable({ columns, rows: all.map((r, i) => { if (r.length > columns.length)
        throw Error('Data row ' + (i + 1) + ' has more cells than the header. Check the separator.'); return [...r, ...Array(columns.length - r.length).fill('')]; }) }); }
export function parseJSONTable(text: string): Table { if (text.length > 5000000)
    throw Error('Keep JSON under 5 million characters.'); const data: unknown = JSON.parse(text); if (!Array.isArray(data) || !data.length || data.length > 50000 || data.some(x => !x || typeof x !== 'object' || Array.isArray(x)))
    throw Error('Use a non-empty JSON array of records, up to 50,000 rows.'); const columns = [...new Set(data.flatMap(x => Object.keys(x)))]; return validateTable({ columns, rows: data.map(x => columns.map(c => x[c] === undefined ? '' : typeof x[c] === 'string' ? x[c] : JSON.stringify(x[c]))) }); }
export function csvCell(value: string, safe = true) { const s = safe && /^[\s\u0000-\u001f]*[=+@-]/.test(value) ? "'" + value : value; return /[",\r\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; }
export function toCSV(t: Table, safe = true) { return [t.columns, ...t.rows].map(r => r.map(v => csvCell(v, safe)).join(',')).join('\r\n'); }
export function records(t: Table) { return t.rows.map(r => Object.fromEntries(t.columns.map((c, i) => [c, r[i]]))); }
export const actions = [['trim', 'Trim whitespace'], ['empty', 'Remove empty rows'], ['dedupe', 'Remove duplicates'], ['headers', 'Normalize headers'], ['lower', 'Lowercase column'], ['upper', 'Uppercase column'], ['replace', 'Find and replace'], ['filter', 'Keep rows containing text'], ['split', 'Split column'], ['merge', 'Combine columns'], ['sort', 'Sort as text'], ['date', 'Convert dates to ISO']] as const;
export function applyStep(t: Table, s: Step): Table { let columns = [...t.columns], rows = t.rows.map(r => [...r]); const at = columns.indexOf(s.column || ''); if (!['trim', 'empty', 'headers', 'dedupe'].includes(s.kind) && at < 0)
    throw Error('Choose an existing column.'); switch (s.kind) {
    case 'trim':
        rows = rows.map(r => r.map(v => v.trim()));
        break;
    case 'empty':
        rows = rows.filter(r => r.some(v => v.trim()));
        break;
    case 'dedupe': {
        if (s.column && at < 0)
            throw Error('Duplicate key column is missing.');
        const seen = new Set<string>();
        rows = rows.filter(r => { const k = JSON.stringify(at < 0 ? r : r[at]); if (seen.has(k))
            return false; seen.add(k); return true; });
        break;
    }
    case 'headers':
        columns = uniqueHeaders(columns.map(c => c.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '_').replace(/^_|_$/g, '')));
        break;
    case 'lower':
    case 'upper':
        rows = rows.map(r => r.map((v, i) => i !== at ? v : s.kind === 'lower' ? v.toLowerCase() : v.toUpperCase()));
        break;
    case 'replace':
        if (!s.value)
            throw Error('Enter text to find.');
        rows = rows.map(r => r.map((v, i) => i === at ? v.split(s.value!).join(s.replacement || '') : v));
        break;
    case 'filter':
        rows = rows.filter(r => r[at].includes(s.value || ''));
        break;
    case 'split': {
        if (!s.value)
            throw Error('Enter a separator.');
        const count = rows.reduce((n, r) => Math.max(n, Math.min(8, r[at].split(s.value!).length)), 2);
        columns = uniqueHeaders([...columns, ...Array.from({ length: count }, (_, i) => columns[at] + '_' + (i + 1))]);
        rows = rows.map(r => { const p = r[at].split(s.value!); return [...r, ...Array.from({ length: count }, (_, i) => i === count - 1 ? p.slice(i).join(s.value!) : p[i] || '')]; });
        break;
    }
    case 'merge': {
        const b = columns.indexOf(s.other || '');
        if (b < 0)
            throw Error('Choose a second column.');
        columns = uniqueHeaders([...columns, 'combined']);
        rows = rows.map(r => [...r, r[at] + (s.value ?? ' ') + r[b]]);
        break;
    }
    case 'sort':
        rows.sort((a, b) => a[at] < b[at] ? -1 : a[at] > b[at] ? 1 : 0);
        break;
    case 'date':
        rows = rows.map((r, n) => r.map((v, i) => { if (i !== at || !v.trim())
            return v; const p = v.trim().split(/[\/.-]/); if (p.length !== 3 || p.some(x => !/^\d+$/.test(x)))
            throw Error('Row ' + (n + 1) + ': use a numeric date with an explicit input order.'); let y, m, d; if (s.value === 'YMD')
            [y, m, d] = p;
        else if (s.value === 'MDY')
            [m, d, y] = p;
        else
            [d, m, y] = p; const dt = new Date(Date.UTC(+y, +m - 1, +d)); if (y.length !== 4 || dt.getUTCFullYear() !== +y || dt.getUTCMonth() !== +m - 1 || dt.getUTCDate() !== +d)
            throw Error('Invalid calendar date at row ' + (n + 1)); return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`; }));
        break;
    default: throw Error('Unsupported action.');
} return validateTable({ columns, rows }); }
export function runRecipe(t: Table, steps: Step[]) { if (steps.length > 20)
    throw Error('Use at most 20 steps.'); return steps.reduce(applyStep, t); }
export function parseRecipe(raw: unknown): Step[] { if (!raw || typeof raw !== 'object' || (raw as {
    version?: number;
}).version !== 1 || !Array.isArray((raw as {
    steps?: unknown;
}).steps))
    throw Error('Choose a version 1 Sukoaa recipe.'); const list = (raw as {
    steps: unknown[];
}).steps; if (list.length > 20)
    throw Error('Use at most 20 steps.'); return list.map(s => { if (!s || typeof s !== 'object' || !actions.some(a => a[0] === (s as Step).kind))
    throw Error('Invalid recipe action.'); for (const [k, v] of Object.entries(s))
    if (!['kind', 'column', 'value', 'replacement', 'other'].includes(k) || typeof v !== 'string' || v.length > 200)
        throw Error('Invalid recipe setting.'); return { ...s } as Step; }); }
export const sampleCSV = 'sku,name,price,stock,updated\r\n000123,  Canvas bag  ,499,12,14/11/2026\r\n000124,Steel bottle,799,0,15/11/2026\r\n000123,  Canvas bag  ,499,12,14/11/2026\r\n000125,"Notebook, ruled",99,40,16/11/2026\r\n,,,,\r\n';
