'use client';
import { useMemo, useState } from 'react';
import { commercePreset, customerPreset, generateData, parseSchema, resourceTable, sqlDataset, fieldTypes, type Schema, type Field } from '@/lib/workbench/fake';
import { toCSV } from '@/lib/workbench/table';
import { downloadFile } from '@/lib/workbench/download';
import { stageTable } from '@/lib/workbench/handoff';
import { Shell, Notice, TablePreview } from './Common';
export default function Generator() {
    const [schema, setSchema] = useState<Schema>(commercePreset), [seed, setSeed] = useState('sukoaa-demo-2026'), [data, setData] = useState(() => generateData(commercePreset, 'sukoaa-demo-2026')), [active, setActive] = useState('orders'), [edit, setEdit] = useState(0), [raw, setRaw] = useState(JSON.stringify(commercePreset, null, 2)), [error, setError] = useState(''), [status, setStatus] = useState('Sample records include linked customers, products and orders.');
    const r = schema.resources[Math.min(edit, schema.resources.length - 1)], table = useMemo(() => resourceTable(data, active), [data, active]), stale = JSON.stringify(schema) !== JSON.stringify(data.schema) || seed !== data.seed;
    function patchResource(p: Partial<typeof r>) { setSchema(s => ({ ...s, resources: s.resources.map((x, i) => i === edit ? { ...x, ...p } : x) })); }
    function field(i: number, p: Partial<Field>) { patchResource({ fields: r.fields.map((f, n) => n === i ? { ...f, ...p } : f) }); }
    function preset(s: Schema) { setSchema(s); setRaw(JSON.stringify(s, null, 2)); setEdit(0); setStatus('Preset loaded. Generate to update the preview.'); }
    function generate() { try {
        const d = generateData(schema, seed);
        setData(d);
        if (!d.data[active])
            setActive(d.schema.resources[0].name);
        setError('');
        setStatus(`Generated ${Object.values(d.data).reduce((n, r) => n + r.length, 0)} records. Same seed and schema reproduce this dataset.`);
    }
    catch (e) {
        setError((e as Error).message);
    } }
    async function bundle() { try {
        const { zipSync } = await import('fflate'), files: Record<string, Uint8Array> = Object.create(null), bytes = (s: string) => new TextEncoder().encode(s);
        files['dataset.json'] = bytes(JSON.stringify(data.data, null, 2));
        files['schema.json'] = bytes(JSON.stringify(data.schema, null, 2));
        files['seed.txt'] = bytes(data.seed);
        files['dataset.sql'] = bytes(sqlDataset(data));
        for (const r of data.schema.resources)
            files[r.name + '.csv'] = bytes('\uFEFF' + toCSV(resourceTable(data, r.name)));
        downloadFile('sukoaa-test-fixtures.zip', new Uint8Array(zipSync(files)), 'application/zip');
        setStatus('Fixture ZIP downloaded with seed, schema, JSON, CSV and SQL.');
    }
    catch (e) {
        setError((e as Error).message);
    } }
    return <Shell slug="test-data-generator"><div className="wb-toolbar"><strong>Reproducible fixtures with linked records</strong><div className="wb-actions"><button onClick={() => preset(customerPreset)}>Customer preset</button><button onClick={() => preset(commercePreset)}>Customers + products + orders</button><button className="wb-primary" onClick={generate}>Generate data</button></div></div><div className="wb-workspace"><aside className="wb-panel" id="wb-settings"><h2>Dataset schema</h2><label>Seed<input maxLength={100} value={seed} onChange={e => setSeed(e.target.value)}/></label><label>Resource to edit<select value={edit} onChange={e => setEdit(+e.target.value)}>{schema.resources.map((r, i) => <option key={i} value={i}>{r.name}</option>)}</select></label><div className="wb-two-inputs"><label>Resource name<input maxLength={40} value={r.name} onChange={e => { const name = e.target.value, old = r.name; setSchema(s => ({ ...s, resources: s.resources.map((x, i) => ({ ...x, ...(i === edit ? { name } : {}), fields: x.fields.map(f => f.type === 'reference' && f.resource === old ? { ...f, resource: name } : f) })) })); }}/></label><label>Rows<input type="number" min={1} max={10000} value={r.count} onChange={e => patchResource({ count: +e.target.value })}/></label></div><div className="wb-actions"><button disabled={schema.resources.length >= 8} onClick={() => { const i = schema.resources.length; setSchema(s => ({ ...s, resources: [...s.resources, { name: 'resource_' + (i + 1), count: 20, fields: [{ name: 'id', type: 'id' }] }] })); setEdit(i); }}>Add resource</button><button disabled={schema.resources.length === 1} onClick={() => { setSchema(s => ({ ...s, resources: s.resources.filter((_, i) => i !== edit) })); setEdit(0); }}>Remove resource</button></div><h3>Fields</h3><div className="wb-fields">{r.fields.map((f, i) => <div className="wb-field" key={i}><div className="wb-two-inputs"><label>Field {i + 1} name<input maxLength={40} value={f.name} onChange={e => field(i, { name: e.target.value })}/></label><label>Type<select value={f.type} onChange={e => field(i, { type: e.target.value as Field['type'] })}>{fieldTypes.map(t => <option key={t}>{t}</option>)}</select></label></div>{['integer', 'decimal'].includes(f.type) && <div className="wb-two-inputs"><label>Minimum<input type="number" value={f.min ?? 0} onChange={e => field(i, { min: +e.target.value })}/></label><label>Maximum<input type="number" value={f.max ?? 100} onChange={e => field(i, { max: +e.target.value })}/></label></div>}{f.type === 'enum' && <label>Allowed values, comma separated<input maxLength={2000} value={f.values?.join(',') || ''} onChange={e => field(i, { values: e.target.value.split(',').map(v => v.trim()) })}/></label>}{f.type === 'reference' && <label>References resource ID<select value={f.resource || ''} onChange={e => field(i, { resource: e.target.value })}><option value="">Choose resource</option>{schema.resources.filter((_, n) => n !== edit).map(r => <option key={r.name}>{r.name}</option>)}</select></label>}<button disabled={r.fields.length === 1} aria-label={'Remove field ' + (i + 1)} onClick={() => patchResource({ fields: r.fields.filter((_, n) => i !== n) })}>Remove field</button></div>)}</div><button disabled={r.fields.length >= 30} onClick={() => patchResource({ fields: [...r.fields, { name: 'field_' + (r.fields.length + 1), type: 'name' }] })}>Add field</button><p className="wb-meta">8 resources maximum; 10,000 rows per resource; 20,000 records total. Every resource needs an id field. Missing references and cycles are rejected.</p><details><summary>Advanced JSON schema</summary><button onClick={() => setRaw(JSON.stringify(schema, null, 2))}>Copy current schema into editor</button><textarea aria-label="Dataset JSON schema" rows={12} value={raw} maxLength={100000} onChange={e => setRaw(e.target.value)}/><button onClick={() => { try {
        preset(parseSchema(JSON.parse(raw)));
        setError('');
    }
    catch (e) {
        setError((e as Error).message);
    } }}>Apply schema</button><button onClick={() => downloadFile('sukoaa-test-schema.json', JSON.stringify(schema, null, 2), 'application/json')}>Download schema</button><label>Import schema<input type="file" accept=".json" onChange={async (e) => { const f = e.target.files?.[0]; e.target.value = ''; if (!f)
        return; try {
        if (f.size > 100000)
            throw Error('Use a schema under 100 KB.');
        preset(parseSchema(JSON.parse(await f.text())));
        setError('');
    }
    catch (e) {
        setError((e as Error).message);
    } }}/></label></details></aside><section className="wb-panel wb-result" id="wb-results"><div className="wb-result-head"><h2>Generated records</h2><span className="wb-chip">Seed: {data.seed}</span></div>{stale && <Notice>Settings changed. Generate again to update the preview and exports.</Notice>}{error && <Notice error>{error}</Notice>}<Notice>{status}</Notice><label>Preview resource<select value={active} onChange={e => setActive(e.target.value)}>{data.schema.resources.map(r => <option key={r.name}>{r.name}</option>)}</select></label><TablePreview table={table}/><div className="wb-actions"><button className="wb-primary" onClick={bundle}>Download complete fixture ZIP</button><button onClick={() => downloadFile(active + '.json', JSON.stringify(data.data[active], null, 2), 'application/json')}>Resource JSON</button><button onClick={() => downloadFile('sukoaa-dataset.sql', sqlDataset(data), 'application/sql')}>SQL script</button><button onClick={() => { try {
        stageTable(table);
        location.href = '/tools/csv-cleaner';
    }
    catch (e) {
        setError((e as Error).message);
    } }}>Open resource in cleaner</button></div><details><summary>Relationships and export notes</summary><ul>{data.schema.resources.flatMap(r => r.fields.filter(f => f.type === 'reference').map(f => <li key={r.name + f.name}>{r.name}.{f.name} references {f.resource}.id</li>))}</ul><p>All records are synthetic. Names may coincide with real people. Emails use example.test; date samples use a fixed 2024–2026 range. SQL is a downloadable script and is not executed here. Review table names and permissions before running it.</p><a href="/demo-api">Use the existing demo API for HTTP requests</a></details></section></div></Shell>;
}
