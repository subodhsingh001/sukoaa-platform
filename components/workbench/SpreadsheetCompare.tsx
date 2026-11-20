'use client';
import { useMemo, useState } from 'react';
import { compareTables } from '@/lib/workbench/compare';
import { parseCSV, type Table } from '@/lib/workbench/table';
import { stageTable, stagedTable } from '@/lib/workbench/handoff';
import { Shell, FileInput, Notice, ExportTable } from './Common';
const before = 'sku,name,price,stock\n000123,Canvas bag,499,12\n000124,Steel bottle,799,0\n000125,Notebook,99,40', after = 'sku,name,price,stock\n000125,Notebook,99,35\n000123,Canvas bag,449,12\n000126,Desk lamp,1299,8';
export default function Compare() { const [left, setLeft] = useState<Table>(() => parseCSV(before)), [right, setRight] = useState<Table>(() => parseCSV(after)), [ak, setAk] = useState('sku'), [bk, setBk] = useState('sku'), [trim, setTrim] = useState(false), [filter, setFilter] = useState('all'), [query, setQuery] = useState(''), [error, setError] = useState(''); const result = useMemo(() => { try {
    return { data: compareTables(left, right, ak, bk, trim), error: '' };
}
catch (e) {
    return { data: null, error: (e as Error).message };
} }, [left, right, ak, bk, trim]), shown = result.data?.changes.filter(c => (filter === 'all' || c.status === filter) && c.key.toLowerCase().includes(query.toLowerCase())) || []; return <Shell slug="spreadsheet-compare"><div className="wb-toolbar"><strong>Match records, not line positions</strong><button onClick={() => { setLeft(parseCSV(before)); setRight(parseCSV(after)); setAk('sku'); setBk('sku'); setError(''); }}>Load sample comparison</button></div><div className="wb-two" id="wb-settings"><section className="wb-panel"><h2>Before</h2><FileInput label="Choose before file" onLoad={t => { setLeft(t); setAk(t.columns[0]); }}/><label>Unique key in before<select value={ak} onChange={e => setAk(e.target.value)}>{left.columns.map(c => <option key={c}>{c}</option>)}</select></label><p>{left.rows.length} records · {left.columns.length} columns</p><button onClick={() => { try {
    const t = stagedTable();
    if (!t)
        throw Error('No staged table. Choose Compare this result in the cleaner first.');
    setLeft(t);
    setAk(t.columns[0]);
    setError('');
}
catch (e) {
    setError((e as Error).message);
} }}>Use cleaned table as Before</button></section><section className="wb-panel"><h2>After</h2><FileInput label="Choose after file" onLoad={t => { setRight(t); setBk(t.columns[0]); }}/><label>Unique key in after<select value={bk} onChange={e => setBk(e.target.value)}>{right.columns.map(c => <option key={c}>{c}</option>)}</select></label><p>{right.rows.length} records · {right.columns.length} columns</p><button onClick={() => { try {
    stageTable(right);
    location.href = '/tools/csv-cleaner';
}
catch (e) {
    setError((e as Error).message);
} }}>Clean the After table</button></section></div><label className="wb-check"><input type="checkbox" checked={trim} onChange={e => setTrim(e.target.checked)}/>Ignore surrounding whitespace in keys and values</label><p className="wb-meta">Matching is case-sensitive. Values compare as text. Empty and duplicate keys stop the comparison. Header names are compared too.</p>{(error || result.error) && <Notice error>{error || result.error}</Notice>}{result.data && <><div className="wb-stats">{Object.entries(result.data.counts).map(([k, n]) => <div key={k}><strong>{n}</strong><span>{k}</span></div>)}</div><section className="wb-panel wb-result" id="wb-results"><div className="wb-result-head"><h2>Changes by record</h2><div className="wb-actions"><label className="wb-inline">Show<select value={filter} onChange={e => setFilter(e.target.value)}>{['all', 'added', 'removed', 'changed', 'same'].map(s => <option key={s}>{s}</option>)}</select></label><input aria-label="Find record key" placeholder="Find record key" value={query} onChange={e => setQuery(e.target.value)}/></div></div><p className="wb-meta">{shown.length} matching records. First 200 shown; exports include the full report.</p>{shown.slice(0, 200).map(c => <details key={c.key}><summary><span className={'wb-change wb-' + c.status}>{c.status}</span> {c.key} · {c.fields.length} fields</summary><div className="wb-table"><table><thead><tr><th>Field</th><th>Before</th><th>After</th></tr></thead><tbody>{(c.status === 'same' ? left.columns : c.fields).map(n => <tr key={n}><th>{n}</th><td>{c.before?.[left.columns.indexOf(n)] ?? 'Not present'}</td><td>{c.after?.[right.columns.indexOf(n)] ?? 'Not present'}</td></tr>)}</tbody></table></div></details>)}<h3>Download the complete difference report</h3><ExportTable table={result.data.report} name="sukoaa-record-differences"/></section></>}</Shell>; }
