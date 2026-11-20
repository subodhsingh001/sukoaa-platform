import { parseCSV, parseJSONTable, uniqueHeaders, validateTable, type Table } from './table';
export function checkWorkbookZip(bytes: Uint8Array) { const d = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength); let end = -1; for (let i = bytes.length - 22; i >= Math.max(0, bytes.length - 65557); i--)
    if (d.getUint32(i, true) === 0x06054b50) {
        end = i;
        break;
    } if (end < 0)
    throw Error('Unsupported XLSX archive.'); const count = d.getUint16(end + 10, true), offset = d.getUint32(end + 16, true); if (count > 2500 || offset >= bytes.length)
    throw Error('Workbook archive too complex.'); let at = offset, total = 0; for (let n = 0; n < count; n++) {
    if (at + 46 > bytes.length || d.getUint32(at, true) !== 0x02014b50)
        throw Error('Invalid archive directory.');
    if (d.getUint16(at + 8, true) & 1)
        throw Error('Encrypted workbooks are unsupported.');
    total += d.getUint32(at + 24, true);
    if (total > 60000000)
        throw Error('Workbook expands beyond 60 MB.');
    at += 46 + d.getUint16(at + 28, true) + d.getUint16(at + 30, true) + d.getUint16(at + 32, true);
} }
export async function readTableFile(file: File, sheetName?: string): Promise<{
    table: Table;
    sheets: string[];
    warnings: string[];
}> { if (file.size > 5000000)
    throw Error('Choose a file under 5 MB.'); if (!/\.xlsx$/i.test(file.name)) {
    const text = await file.text();
    return { table: /\.json$/i.test(file.name) ? parseJSONTable(text) : parseCSV(text), sheets: [], warnings: [] };
} const bytes = new Uint8Array(await file.arrayBuffer()); checkWorkbookZip(bytes); const Excel = await import('exceljs'), book = new Excel.Workbook(); await book.xlsx.load(bytes.buffer as ArrayBuffer); if (!book.worksheets.length || book.worksheets.length > 20)
    throw Error('Use 1–20 worksheets.'); const sheet = sheetName ? book.getWorksheet(sheetName) : book.worksheets[0]; if (!sheet)
    throw Error('Worksheet not found.'); if (sheet.rowCount > 50001 || sheet.columnCount > 80)
    throw Error('Use at most 50,000 rows and 80 columns.'); const warnings = new Set(['Only worksheet values are imported. Formatting, formulas, macros and merged-cell layout are not retained.']); function text(v: import('exceljs').CellValue): string { if (v == null)
    return ''; if (['string', 'number', 'boolean'].includes(typeof v))
    return String(v); if (v instanceof Date)
    return v.toISOString(); if (typeof v === 'object') {
    if ('formula' in v || 'sharedFormula' in v) {
        warnings.add('Formula cells use stored results; formulas are never recalculated.');
        return 'result' in v ? text(v.result as import('exceljs').CellValue) : '';
    }
    if ('richText' in v)
        return v.richText.map(p => p.text).join('');
    if ('text' in v)
        return v.text;
    if ('error' in v)
        return v.error;
} return ''; } const width = sheet.columnCount; if (!width)
    throw Error('Worksheet is empty.'); const row = (n: number) => Array.from({ length: width }, (_, i) => text(sheet.getRow(n).getCell(i + 1).value)); return { table: validateTable({ columns: uniqueHeaders(row(1)), rows: Array.from({ length: sheet.rowCount - 1 }, (_, i) => row(i + 2)) }), sheets: book.worksheets.map(s => s.name), warnings: [...warnings] }; }
export async function tableXLSX(t: Table) { const Excel = await import('exceljs'), book = new Excel.Workbook(), sheet = book.addWorksheet('Data'); sheet.addRow(t.columns); for (const r of t.rows)
    sheet.addRow(r); sheet.getRow(1).font = { bold: true }; sheet.views = [{ state: 'frozen', ySplit: 1 }]; sheet.columns.forEach(c => { c.width = 22; }); return new Blob([new Uint8Array(await book.xlsx.writeBuffer())], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }); }
