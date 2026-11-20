'use client';
import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, Copy } from 'lucide-react';
import { inspectPDF, renderPDF, thumbnailPDF, exportPDF, parsePageRange, type PdfPagePlan } from '@/lib/workbench/pdf';
import { downloadFile, sizeLabel } from '@/lib/workbench/download';
import { Shell, Notice } from './Common';
type Source = {
    name: string;
    bytes: Uint8Array;
    thumbs: string[];
};
export default function PdfOrganizer() {
    const [sources, setSources] = useState<Record<string, Source>>({}), [plan, setPlan] = useState<PdfPagePlan[]>([]), [history, setHistory] = useState<PdfPagePlan[][]>([]), [future, setFuture] = useState<PdfPagePlan[][]>([]), [selected, setSelected] = useState<string[]>([]), [range, setRange] = useState('1-3'), [numbers, setNumbers] = useState(false), [watermark, setWatermark] = useState(''), [busy, setBusy] = useState(false), [error, setError] = useState(''), [status, setStatus] = useState('Choose PDFs or load a sample.');
    const alive = useRef(true);
    useEffect(() => { alive.current = true; return () => { alive.current = false; }; }, []);
    function change(next: PdfPagePlan[]) { if (next.length > 100) {
        setError('Use at most 100 pages.');
        return;
    } setHistory(h => [...h.slice(-11), plan]); setFuture([]); setPlan(next); setSelected(s => s.filter(id => next.some(p => p.id === id))); setError(''); }
    async function add(files: File[]) { setBusy(true); setError(''); try {
        if (files.length > 5 || Object.keys(sources).length + files.length > 8)
            throw Error('Use up to 5 files per selection, 8 source files total.');
        if (files.reduce((n, f) => n + f.size, 0) + Object.values(sources).reduce((n, s) => n + s.bytes.length, 0) > 30000000)
            throw Error('Keep source PDFs under 30 MB total.');
        const added: Record<string, Source> = {}, pages: PdfPagePlan[] = [];
        for (const f of files) {
            if (!/\.pdf$/i.test(f.name))
                throw Error('Choose PDF files.');
            setStatus('Reading ' + f.name + '…');
            const bytes = new Uint8Array(await f.arrayBuffer()), count = await inspectPDF(bytes);
            if (plan.length + pages.length + count > 100)
                throw Error('Use at most 100 workspace pages.');
            const source = crypto.randomUUID(), thumbs: string[] = [], doc = await renderPDF(bytes);
            try {
                for (let i = 0; i < count; i++) {
                    if (!alive.current)
                        return;
                    setStatus(`Rendering ${f.name}: ${i + 1} / ${count}`);
                    thumbs.push(await thumbnailPDF(doc, i));
                    pages.push({ id: crypto.randomUUID(), source, index: i, rotation: 0 });
                }
            }
            finally {
                await doc.loadingTask.destroy();
            }
            added[source] = { name: f.name, bytes, thumbs };
        }
        if (alive.current) {
            setSources({ ...sources, ...added });
            change([...plan, ...pages]);
            setStatus(`Added ${pages.length} pages. Choose pages or arrange their order.`);
        }
    }
    catch (e) {
        setError((e as Error).message);
        setStatus('Files were not added. Existing pages are unchanged.');
    }
    finally {
        if (alive.current)
            setBusy(false);
    } }
    async function sample() { try {
        const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib'), d = await PDFDocument.create(), font = await d.embedFont(StandardFonts.Helvetica);
        for (let i = 1; i <= 3; i++) {
            const p = d.addPage([595, 842]);
            p.drawRectangle({ x: 0, y: 642, width: 595, height: 200, color: rgb(.075, .28, .255) });
            p.drawText('Sukoaa sample document', { x: 42, y: 730, font, size: 26, color: rgb(1, 1, 1) });
            p.drawText('Page ' + i, { x: 42, y: 680, font, size: 18, color: rgb(.5, .95, .82) });
            p.drawText(['Start with a document.', 'Arrange pages in the order you need.', 'Export a separate result and keep the original.'][i - 1], { x: 42, y: 575, font, size: 15 });
        }
        await add([new File([new Uint8Array(await d.save())], 'sample-3-pages.pdf', { type: 'application/pdf' })]);
    }
    catch (e) {
        setError((e as Error).message);
    } }
    async function exportFile(split = false) { setBusy(true); setError(''); try {
        const bytes = Object.fromEntries(Object.entries(sources).map(([id, s]) => [id, s.bytes])), chosen = selected.length ? plan.filter(p => selected.includes(p.id)) : plan;
        if (!chosen.length)
            throw Error('Add pages first.');
        if (split) {
            const { zipSync } = await import('fflate'), entries: Record<string, Uint8Array> = Object.create(null);
            for (let i = 0; i < chosen.length; i++) {
                setStatus(`Exporting ${i + 1} / ${chosen.length}`);
                const b = await exportPDF(bytes, [chosen[i]], numbers, watermark);
                entries[`page-${String(i + 1).padStart(3, '0')}.pdf`] = new Uint8Array(await b.arrayBuffer());
            }
            downloadFile('sukoaa-split-pages.zip', new Uint8Array(zipSync(entries, { level: 0 })), 'application/zip');
        }
        else
            downloadFile('sukoaa-organized.pdf', await exportPDF(bytes, chosen, numbers, watermark));
        setStatus('Export ready. Source files are unchanged.');
    }
    catch (e) {
        setError((e as Error).message);
    }
    finally {
        setBusy(false);
    } }
    function move(i: number, delta: number) { const next = [...plan], j = i + delta; if (j < 0 || j >= plan.length)
        return; [next[i], next[j]] = [next[j], next[i]]; change(next); }
    return <Shell slug="pdf-organizer"><div className="wb-toolbar"><span>{plan.length} pages · {Object.keys(sources).length} source files · {sizeLabel(Object.values(sources).reduce((n, s) => n + s.bytes.length, 0))}</span><div className="wb-actions"><label className="wb-file-button">Add PDFs<input type="file" multiple accept=".pdf,application/pdf" disabled={busy} onChange={e => { const f = Array.from(e.target.files || []); e.target.value = ''; if (f.length)
        void add(f); }}/></label><button disabled={busy || plan.length > 97} onClick={sample}>Load 3-page sample</button><button disabled={busy || !history.length} onClick={() => { setFuture(f => [plan, ...f]); setPlan(history.at(-1)!); setHistory(h => h.slice(0, -1)); setSelected([]); }}>Undo</button><button disabled={busy || !future.length} onClick={() => { setHistory(h => [...h, plan]); setPlan(future[0]); setFuture(f => f.slice(1)); setSelected([]); }}>Redo</button><button disabled={busy || !Object.keys(sources).length} onClick={() => { setSources({}); setPlan([]); setHistory([]); setFuture([]); setSelected([]); setError(''); setStatus('Workspace cleared. Originals on disk are unchanged.'); }}>Clear workspace</button></div></div><div className="wb-workspace"><aside className="wb-panel" id="wb-settings"><h2>Select and export</h2><fieldset disabled={busy}><label>Page positions<input placeholder="1-3, 5" value={range} onChange={e => setRange(e.target.value)}/></label><button disabled={!plan.length} onClick={() => { try {
        setSelected(parsePageRange(range, plan.length).map(i => plan[i].id));
        setError('');
    }
    catch (e) {
        setError((e as Error).message);
    } }}>Select range</button><div className="wb-actions"><button disabled={!plan.length} onClick={() => setSelected(plan.map(p => p.id))}>Select all</button><button onClick={() => setSelected([])}>Clear selection</button></div><p>{selected.length} selected. With no selection, exports include all pages.</p><button disabled={!selected.length} onClick={() => change(plan.filter(p => !selected.includes(p.id)))}>Remove selected pages</button><label className="wb-check"><input type="checkbox" checked={numbers} onChange={e => setNumbers(e.target.checked)}/>Add page numbers to output</label><label>Text watermark<input maxLength={60} placeholder="Optional · basic Latin text" value={watermark} onChange={e => setWatermark(e.target.value)}/></label><button className="wb-primary" disabled={!plan.length} onClick={() => exportFile()}>{selected.length ? 'Export selected pages' : 'Export organized PDF'}</button><button disabled={!plan.length} onClick={() => exportFile(true)}>Split chosen pages into ZIP</button></fieldset><p className="wb-meta">15 MB per file; 30 MB total; 100 pages. Encrypted files and interactive forms are unsupported. This is not a PDF text editor or redaction tool. Editing can invalidate digital signatures; keep signed originals.</p><details><summary>Original sources</summary>{Object.entries(sources).map(([id, s]) => <p key={id}><button onClick={() => downloadFile(s.name, new Uint8Array(s.bytes), 'application/pdf')}>Download {s.name}</button></p>)}</details></aside><section className="wb-panel wb-result" id="wb-results"><div className="wb-result-head"><h2>Arrange pages</h2><span className="wb-chip">Undo retains 12 actions</span></div><Notice>{status}</Notice>{error && <Notice error>{error}</Notice>}{!plan.length && <div className="wb-blank"><h3>Your document workspace</h3><p>Add PDFs or use the sample. Thumbnails and arrangement controls appear here.</p></div>}<div className="wb-pages">{plan.map((p, i) => <article key={p.id} className={selected.includes(p.id) ? 'wb-page selected' : 'wb-page'}><label className="wb-check"><input type="checkbox" disabled={busy} checked={selected.includes(p.id)} onChange={e => setSelected(s => e.target.checked ? [...s, p.id] : s.filter(x => x !== p.id))}/>Position {i + 1}</label><div className="wb-page-art"><img src={sources[p.source].thumbs[p.index]} style={{ transform: `rotate(${p.rotation}deg)` }} alt={`${sources[p.source].name}, source page ${p.index + 1}`}/></div><p className="wb-meta">{sources[p.source].name} · page {p.index + 1}</p><div className="wb-page-actions"><button disabled={busy || !i} aria-label={`Move page ${i + 1} earlier`} onClick={() => move(i, -1)}><ArrowLeft size={16}/></button><button disabled={busy || i === plan.length - 1} aria-label={`Move page ${i + 1} later`} onClick={() => move(i, 1)}><ArrowRight size={16}/></button><button disabled={busy} aria-label={`Rotate page ${i + 1}`} onClick={() => change(plan.map(x => x.id === p.id ? { ...x, rotation: (x.rotation + 90) % 360 } : x))}><RotateCw size={16}/></button><button disabled={busy || plan.length === 100} aria-label={`Duplicate page ${i + 1}`} onClick={() => change([...plan.slice(0, i + 1), { ...p, id: crypto.randomUUID() }, ...plan.slice(i + 1)])}><Copy size={16}/></button></div></article>)}</div></section></div></Shell>;
}
