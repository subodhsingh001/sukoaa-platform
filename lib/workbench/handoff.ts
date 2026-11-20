import { validateTable, type Table } from './table';
const key = 'sukoaa-workbench-handoff-v1';
export function stageTable(table: Table) { const raw = JSON.stringify({ expires: Date.now() + 600000, table }); if (raw.length > 5000000)
    throw Error('Transfer larger tables by downloading a file.'); sessionStorage.setItem(key, raw); }
export function stagedTable() { const raw = sessionStorage.getItem(key); if (!raw)
    return null; const x = JSON.parse(raw); if (x.expires < Date.now()) {
    sessionStorage.removeItem(key);
    return null;
} return validateTable(x.table); }
