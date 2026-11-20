import { type Table } from './table';
export type Field = {
    name: string;
    type: 'id' | 'uuid' | 'name' | 'email' | 'integer' | 'decimal' | 'boolean' | 'date' | 'city' | 'phone' | 'enum' | 'reference';
    min?: number;
    max?: number;
    values?: string[];
    resource?: string;
};
export type Schema = {
    version: 1;
    resources: {
        name: string;
        count: number;
        fields: Field[];
    }[];
};
export const fieldTypes: Field['type'][] = ['id', 'uuid', 'name', 'email', 'integer', 'decimal', 'boolean', 'date', 'city', 'phone', 'enum', 'reference'];
export function parseSchema(raw: unknown): Schema { if (!raw || typeof raw !== 'object' || (raw as Schema).version !== 1 || !Array.isArray((raw as Schema).resources))
    throw Error('Use a version 1 schema with a resources array.'); const s = raw as Schema; if (!s.resources.length || s.resources.length > 8)
    throw Error('Use 1–8 resources.'); const names = new Set<string>(); let count = 0; for (const r of s.resources) {
    if (!r || !/^[_a-zA-Z][_a-zA-Z0-9]{0,39}$/.test(r.name) || names.has(r.name) || !Number.isInteger(r.count) || r.count < 1 || r.count > 10000 || !Array.isArray(r.fields) || !r.fields.length || r.fields.length > 30)
        throw Error('Use unique resource names, 1–10,000 rows and 1–30 fields.');
    names.add(r.name);
    count += r.count;
    const fields = new Set<string>();
    for (const f of r.fields) {
        if (!f || !/^[_a-zA-Z][_a-zA-Z0-9]{0,39}$/.test(f.name) || fields.has(f.name) || !fieldTypes.includes(f.type))
            throw Error('Each field needs a unique identifier and supported type.');
        fields.add(f.name);
        if (f.type === 'enum' && (!Array.isArray(f.values) || !f.values.length || f.values.length > 30 || f.values.some(v => typeof v !== 'string' || v.length > 100)))
            throw Error('Enums need 1–30 short string values.');
        if (['integer', 'decimal'].includes(f.type)) {
            const a = f.min ?? 0, b = f.max ?? 100;
            if (!Number.isFinite(a) || !Number.isFinite(b) || a > b || Math.abs(a) > 1e9 || Math.abs(b) > 1e9 || f.type === 'integer' && (!Number.isInteger(a) || !Number.isInteger(b)))
                throw Error('Use finite, ordered numeric bounds within ±1 billion.');
        }
    }
    if (!r.fields.some(f => f.name === 'id' && f.type === 'id'))
        throw Error(r.name + ' needs an id field of type id.');
} if (count > 20000)
    throw Error('Use at most 20,000 total records.'); for (const r of s.resources)
    for (const f of r.fields)
        if (f.type === 'reference' && (!names.has(f.resource!) || f.resource === r.name))
            throw Error('References must point to another resource in this schema.'); return structuredClone(s); }
export function seeded(seed: string) { let x = 2166136261; for (const c of seed)
    x = Math.imul(x ^ c.charCodeAt(0), 16777619); return () => { x += 0x6d2b79f5; let t = x; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
export type Dataset = {
    schema: Schema;
    seed: string;
    data: Record<string, Record<string, string | number | boolean>[]>;
};
export function generateData(input: Schema, seed: string): Dataset { const schema = parseSchema(input); if (!seed || seed.length > 100)
    throw Error('Use a seed of 1–100 characters.'); const rng = seeded(seed), pick = <T,>(a: T[]) => a[Math.floor(rng() * a.length)], data: Dataset['data'] = Object.create(null), pending = [...schema.resources]; while (pending.length) {
    const at = pending.findIndex(r => r.fields.every(f => f.type !== 'reference' || Object.hasOwn(data, f.resource!)));
    if (at < 0)
        throw Error('Reference cycle detected. Use an acyclic parent-child relationship.');
    const r = pending.splice(at, 1)[0];
    data[r.name] = Array.from({ length: r.count }, (_, i) => Object.fromEntries(r.fields.map(f => { let v: string | number | boolean = ''; switch (f.type) {
        case 'id':
            v = i + 1;
            break;
        case 'uuid':
            v = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => { const n = Math.floor(rng() * 16); return (c === 'x' ? n : (n & 3) | 8).toString(16); });
            break;
        case 'name':
            v = pick(['Asha', 'Rohan', 'Maya', 'Tara', 'Sam', 'Dev']) + ' ' + pick(['Sen', 'Das', 'Rao', 'Shah', 'Roy']);
            break;
        case 'email':
            v = `person${i + 1}@example.test`;
            break;
        case 'city':
            v = pick(['Kolkata', 'Howrah', 'Chennai', 'Pune', 'Delhi', 'Mumbai']);
            break;
        case 'phone':
            v = '+1-202-555-' + String(100 + Math.floor(rng() * 100)).padStart(4, '0');
            break;
        case 'date':
            v = new Date(Date.UTC(2024, 0, 1) + Math.floor(rng() * 1096) * 86400000).toISOString().slice(0, 10);
            break;
        case 'boolean':
            v = rng() >= .5;
            break;
        case 'integer':
            v = Math.floor(rng() * ((f.max ?? 100) - (f.min ?? 0) + 1)) + (f.min ?? 0);
            break;
        case 'decimal':
            v = Math.round(((f.min ?? 0) + rng() * ((f.max ?? 100) - (f.min ?? 0))) * 100) / 100;
            break;
        case 'enum':
            v = pick(f.values!);
            break;
        case 'reference':
            v = pick(data[f.resource!]).id;
            break;
    } return [f.name, v]; })));
} return { schema, seed, data }; }
export function resourceTable(d: Dataset, name: string): Table { const r = d.schema.resources.find(r => r.name === name); if (!r)
    throw Error('Choose a generated resource.'); return { columns: r.fields.map(f => f.name), rows: d.data[name].map(row => r.fields.map(f => String(row[f.name]))) }; }
export function sqlDataset(d: Dataset) { const q = (s: string) => '"' + s.replace(/"/g, '""') + '"', lines = ['-- Synthetic fixtures. Review before running.', 'BEGIN;']; for (const name of Object.keys(d.data)) {
    const r = d.schema.resources.find(r => r.name === name)!;
    lines.push('CREATE TABLE ' + q(name) + ' (' + r.fields.map(f => q(f.name) + ' ' + (['id', 'integer', 'reference'].includes(f.type) ? 'INTEGER' : f.type === 'decimal' ? 'NUMERIC' : f.type === 'boolean' ? 'BOOLEAN' : 'TEXT') + (f.type === 'id' ? ' PRIMARY KEY' : '') + (f.type === 'reference' ? ' REFERENCES ' + q(f.resource!) + ' ("id")' : '')).join(', ') + ');');
    for (const row of d.data[name])
        lines.push('INSERT INTO ' + q(name) + ' (' + r.fields.map(f => q(f.name)).join(', ') + ') VALUES (' + r.fields.map(f => { const v = row[f.name]; return typeof v === 'number' ? String(v) : typeof v === 'boolean' ? v ? 'TRUE' : 'FALSE' : "'" + v.replace(/'/g, "''") + "'"; }).join(', ') + ');');
} return [...lines, 'COMMIT;'].join('\n'); }
export const customerPreset: Schema = { version: 1, resources: [{ name: 'customers', count: 30, fields: [{ name: 'id', type: 'id' }, { name: 'name', type: 'name' }, { name: 'email', type: 'email' }, { name: 'city', type: 'city' }, { name: 'joined', type: 'date' }] }] };
export const commercePreset: Schema = { version: 1, resources: [{ ...customerPreset.resources[0], count: 20 }, { name: 'products', count: 12, fields: [{ name: 'id', type: 'id' }, { name: 'sku', type: 'uuid' }, { name: 'price', type: 'decimal', min: 50, max: 2000 }, { name: 'category', type: 'enum', values: ['books', 'home', 'clothing'] }] }, { name: 'orders', count: 100, fields: [{ name: 'id', type: 'id' }, { name: 'customer_id', type: 'reference', resource: 'customers' }, { name: 'product_id', type: 'reference', resource: 'products' }, { name: 'quantity', type: 'integer', min: 1, max: 5 }, { name: 'status', type: 'enum', values: ['pending', 'paid', 'shipped'] }, { name: 'ordered', type: 'date' }] }] };
