'use client';
import { useEffect, useState, type ReactNode } from 'react';
import { workbenchTools, type WorkbenchSlug } from '@/lib/workbench/catalog';
import { records, toCSV, type Table } from '@/lib/workbench/table';
import { readTableFile, tableXLSX } from '@/lib/workbench/workbook';
import { downloadFile } from '@/lib/workbench/download';
import { Download, Upload, Table2, Columns2, Images, Files, Braces } from 'lucide-react';
export function Shell({ slug, children }: {
    slug: WorkbenchSlug;
    children: ReactNode;
}) { const icons = [Table2, Columns2, Images, Files, Braces]; return <div className="wb"><nav className="wb-tabs" aria-label="File and data tools">{workbenchTools.map((t, i) => { const Icon = icons[i]; return <a key={t.slug} href={'/tools/' + t.slug} aria-current={slug === t.slug ? 'page' : undefined}><Icon size={17}/>{t.name}</a>; })}</nav><nav className="wb-jump" aria-label="Workspace sections"><a href="#wb-settings">Settings</a><a href="#wb-results">Results and downloads</a></nav>{children}<p className="wb-meta">No file uploads or AI calls. Working files stay in memory. Recipes can be saved locally; a staged table stays in this tab for up to 10 minutes. Download results before closing the tab.</p></div>; }
export function Notice({ children, error = false }: {
    children: ReactNode;
    error?: boolean;
}) { return <p className={error ? 'wb-notice wb-error' : 'wb-notice'} role={error ? 'alert' : 'status'}>{children}</p>; }
export function TablePreview({ table }: {
    table: Table;
}) { const [page, setPage] = useState(0); useEffect(() => setPage(0), [table]); const at = Math.min(page, Math.max(0, Math.ceil(table.rows.length / 50) - 1)); return <><div className="wb-table" tabIndex={0} aria-label="Scrollable data preview"><table><thead><tr><th>Row</th>{table.columns.map((c, i) => <th key={i}>{c}</th>)}</tr></thead><tbody>{table.rows.slice(at * 50, at * 50 + 50).map((r, i) => <tr key={i}><th>{at * 50 + i + 1}</th>{r.map((v, j) => <td key={j} title={v.slice(0, 1000)}>{v.length > 180 ? v.slice(0, 180) + '…' : v || <em>empty</em>}</td>)}</tr>)}</tbody></table></div><div className="wb-pager"><span>{table.rows.length ? `${at * 50 + 1}–${Math.min(at * 50 + 50, table.rows.length)} of ${table.rows.length.toLocaleString()} rows` : 'No data rows'}</span><button disabled={!at} onClick={() => setPage(at - 1)}>Previous rows</button><button disabled={(at + 1) * 50 >= table.rows.length} onClick={() => setPage(at + 1)}>Next rows</button></div></>; }
export function ExportTable({ table, name = 'sukoaa-data' }: {
    table: Table;
    name?: string;
}) { const [safe, setSafe] = useState(true), [busy, setBusy] = useState(false), [status, setStatus] = useState(''); return <><div className="wb-actions"><button onClick={() => downloadFile(name + '.csv', '\uFEFF' + toCSV(table, safe), 'text/csv;charset=utf-8')}><Download size={16}/>CSV</button><button onClick={() => downloadFile(name + '.json', JSON.stringify(records(table), null, 2), 'application/json')}>JSON</button><button disabled={busy} onClick={async () => { try {
    setBusy(true);
    downloadFile(name + '.xlsx', await tableXLSX(table));
    setStatus('Workbook downloaded with value cells; formulas are not executed.');
}
catch (e) {
    setStatus((e as Error).message);
}
finally {
    setBusy(false);
} }}>{busy ? 'Preparing workbook…' : 'Excel .xlsx'}</button></div><label className="wb-check"><input type="checkbox" checked={safe} onChange={e => setSafe(e.target.checked)}/>Spreadsheet-safe CSV: prefix formula-like values with an apostrophe. JSON preserves raw values.</label>{status && <Notice>{status}</Notice>}</>; }
export function FileInput({ label, onLoad }: {
    label: string;
    onLoad: (t: Table, name: string) => void;
}) { const [file, setFile] = useState<File | null>(null), [sheet, setSheet] = useState(''), [sheets, setSheets] = useState<string[]>([]), [busy, setBusy] = useState(false), [error, setError] = useState(''), [warnings, setWarnings] = useState<string[]>([]); async function load(f: File, name?: string) { try {
    setBusy(true);
    setError('');
    const r = await readTableFile(f, name);
    setFile(f);
    setSheets(r.sheets);
    setSheet(name || r.sheets[0] || '');
    setWarnings(r.warnings);
    onLoad(r.table, f.name);
}
catch (e) {
    setError((e as Error).message);
}
finally {
    setBusy(false);
} } return <div><label className="wb-upload"><Upload size={18}/>{label}<input type="file" accept=".csv,.tsv,.json,.xlsx" disabled={busy} onChange={e => { const f = e.target.files?.[0]; e.target.value = ''; if (f)
    void load(f); }}/></label>{file && <p className="wb-meta">{file.name}</p>}{sheets.length > 1 && <label>Worksheet<select value={sheet} disabled={busy} onChange={e => void load(file!, e.target.value)}>{sheets.map(s => <option key={s}>{s}</option>)}</select></label>}{busy && <Notice>Reading file locally…</Notice>}{error && <Notice error>{error}</Notice>}{warnings.map(w => <p className="wb-meta" key={w}>{w}</p>)}</div>; }
