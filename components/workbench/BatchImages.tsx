'use client';
import { useEffect, useRef, useState } from 'react';
import { processImage, type ImageOptions } from '@/lib/workbench/images';
import { downloadFile, sizeLabel } from '@/lib/workbench/download';
import { Shell, Notice } from './Common';
type Result = Awaited<ReturnType<typeof processImage>> & {
    url: string;
    original: string;
};
const initial: ImageOptions = { width: 1200, height: 1200, fit: 'inside', upscale: false, format: 'image/webp', quality: .82, watermark: '', prefix: 'sukoaa-' };
export default function Images() {
    const [files, setFiles] = useState<File[]>([]), [options, setOptions] = useState(initial), [results, setResults] = useState<Result[]>([]), [busy, setBusy] = useState(false), [errors, setErrors] = useState<string[]>([]), [status, setStatus] = useState('Select images or load the sample.'), [selected, setSelected] = useState(0), [original, setOriginal] = useState('');
    const stopped = useRef(false), urls = useRef<string[]>([]);
    useEffect(() => () => urls.current.forEach(URL.revokeObjectURL), []);
    useEffect(() => { const index = results[selected]?.sourceIndex ?? selected; if (!files[index]) {
        setOriginal('');
        return;
    } const u = URL.createObjectURL(files[index]); setOriginal(u); return () => URL.revokeObjectURL(u); }, [files, results, selected]);
    function clear() { urls.current.forEach(URL.revokeObjectURL); urls.current = []; setResults([]); setSelected(0); setErrors([]); }
    function pick(f: File[]) { if (f.length > 30 || f.reduce((n, x) => n + x.size, 0) > 100000000) {
        setErrors(['Use up to 30 images and 100 MB total.']);
        return;
    } clear(); setFiles(f); setStatus('Files selected. Choose settings and process the batch.'); }
    async function sample() { const c = document.createElement('canvas'); c.width = 1400; c.height = 900; const x = c.getContext('2d')!; x.fillStyle = '#e7f0ed'; x.fillRect(0, 0, 1400, 900); x.fillStyle = '#134741'; x.fillRect(80, 80, 1240, 740); x.fillStyle = 'white'; x.font = 'bold 74px sans-serif'; x.fillText('Sukoaa image sample', 145, 260); x.font = '38px sans-serif'; x.fillText('Resize. Convert. Compare the result.', 145, 350); x.fillStyle = '#43d9b8'; for (let i = 0; i < 6; i++)
        x.fillRect(145 + i * 175, 490, 110, 170 - i * 15); const b = await new Promise<Blob>(r => c.toBlob(b => r(b!), 'image/png')); pick([new File([b], 'sample-landscape.png', { type: 'image/png' })]); }
    async function run() { clear(); stopped.current = false; setBusy(true); const built: Result[] = [], failed: string[] = [], settings = { ...options }; for (let i = 0; i < files.length; i++) {
        if (stopped.current)
            break;
        setStatus(`Processing ${i + 1} / ${files.length}: ${files[i].name}`);
        await new Promise(r => setTimeout(r, 0));
        try {
            const r = await processImage(files[i], settings, i), url = URL.createObjectURL(r.blob);
            urls.current.push(url);
            built.push({ ...r, url, original: files[i].name });
            setResults([...built]);
        }
        catch (e) {
            failed.push(files[i].name + ': ' + (e as Error).message);
            setErrors([...failed]);
        }
    } setBusy(false); setStatus(`${stopped.current ? 'Stopped.' : 'Finished.'} ${built.length} ready; ${failed.length} failed. Re-run after changing settings.`); }
    async function zip() { try {
        const { zipSync } = await import('fflate'), entries: Record<string, Uint8Array> = Object.create(null);
        for (const r of results)
            entries[r.name] = new Uint8Array(await r.blob.arrayBuffer());
        entries['processing-report.json'] = new TextEncoder().encode(JSON.stringify(results.map(r => ({ file: r.name, original: r.original, width: r.width, height: r.height, originalBytes: r.sourceBytes, outputBytes: r.blob.size })), null, 2));
        downloadFile('sukoaa-image-batch.zip', new Uint8Array(zipSync(entries, { level: 0 })), 'application/zip');
    }
    catch (e) {
        setErrors([(e as Error).message]);
    } }
    const current = results[selected] || results[0], sourceTotal = results.reduce((n, r) => n + r.sourceBytes, 0), outputTotal = results.reduce((n, r) => n + r.blob.size, 0);
    return <Shell slug="batch-images"><div className="wb-toolbar"><span>JPG · PNG · WebP · sequential processing</span><div className="wb-actions"><label className="wb-file-button">Choose images<input type="file" multiple disabled={busy} accept="image/jpeg,image/png,image/webp" onChange={e => { pick(Array.from(e.target.files || [])); e.target.value = ''; }}/></label><button disabled={busy} onClick={sample}>Load sample image</button><button className="wb-primary" disabled={!files.length || busy} onClick={run}>Process {files.length || ''} {files.length === 1 ? 'image' : 'images'}</button>{busy && <button onClick={() => { stopped.current = true; setStatus('Stopping after the current image…'); }}>Stop</button>}</div></div><div className="wb-workspace"><aside className="wb-panel" id="wb-settings"><h2>Batch settings</h2><fieldset disabled={busy}><label>Size preset<select defaultValue="custom" onChange={e => { if (e.target.value === 'custom')
        return; const n = e.target.value === 'square' ? 1080 : e.target.value === 'thumbnail' ? 400 : 1600; setOptions({ ...options, width: n, height: e.target.value === 'web' ? 900 : n, fit: e.target.value === 'square' ? 'cover' : 'inside' }); }}><option value="custom">Custom dimensions</option><option value="web">Web landscape · 1600 × 900</option><option value="square">Square · 1080 × 1080</option><option value="thumbnail">Thumbnail · 400 × 400</option></select></label><div className="wb-two-inputs"><label>Width, px<input type="number" min={1} max={4096} value={options.width} onChange={e => setOptions({ ...options, width: +e.target.value })}/></label><label>Height, px<input type="number" min={1} max={4096} value={options.height} onChange={e => setOptions({ ...options, height: +e.target.value })}/></label></div><label>Fit<select value={options.fit} onChange={e => setOptions({ ...options, fit: e.target.value as ImageOptions['fit'] })}><option value="inside">Fit inside · preserve whole image</option><option value="cover">Fill dimensions · crop center</option></select></label><label className="wb-check"><input type="checkbox" checked={options.upscale} onChange={e => setOptions({ ...options, upscale: e.target.checked })}/>Allow enlargement</label><label>Output format<select value={options.format} onChange={e => setOptions({ ...options, format: e.target.value as ImageOptions['format'] })}><option value="image/webp">WebP</option><option value="image/jpeg">JPG · white behind transparency</option><option value="image/png">PNG · preserves transparency</option></select></label><label>Quality · {Math.round(options.quality * 100)}%<input type="range" min={10} max={100} disabled={options.format === 'image/png'} value={Math.round(options.quality * 100)} onChange={e => setOptions({ ...options, quality: +e.target.value / 100 })}/></label><label>Text watermark<input maxLength={80} value={options.watermark} onChange={e => setOptions({ ...options, watermark: e.target.value })}/></label><label>Output filename prefix<input maxLength={30} value={options.prefix} onChange={e => setOptions({ ...options, prefix: e.target.value })}/></label></fieldset><p className="wb-meta">30 files, 15 MB each, 100 MB total. Source images up to 24 megapixels; output up to 4096 px and 16 megapixels. Animated files, SVG and HEIC are unsupported. No AI upscaling or background removal.</p><p className="wb-meta">Re-encoding creates new files without copying source metadata. PNG is lossless: its size is not controlled by the quality slider.</p></aside><section className="wb-panel wb-result" id="wb-results"><h2>Preview and outputs</h2><Notice>{status}</Notice><p>{files.length} source files · {sizeLabel(files.reduce((n, f) => n + f.size, 0))}</p>{current && <><div className="wb-stats"><div><strong>{results.length}</strong><span>ready</span></div><div><strong>{sizeLabel(outputTotal)}</strong><span>output total</span></div><div><strong>{Math.abs(Math.round((1 - outputTotal / sourceTotal) * 100))}%</strong><span>{outputTotal <= sourceTotal ? 'smaller' : 'larger'}</span></div></div><label>Result to inspect<select value={Math.min(selected, results.length - 1)} onChange={e => setSelected(+e.target.value)}>{results.map((r, i) => <option key={r.name} value={i}>{r.original}</option>)}</select></label><div className="wb-image-pair"><figure><figcaption>Original</figcaption><img src={original} alt="Selected original image"/></figure><figure><figcaption>Processed · {current.width} × {current.height}</figcaption><img src={current.url} alt="Processed output image"/></figure></div><div className="wb-actions"><button className="wb-primary" onClick={zip}>Download ZIP + size report</button><button onClick={() => downloadFile(current.name, current.blob)}>Download selected image</button></div><p className="wb-meta">{current.name} · {sizeLabel(current.sourceBytes)} to {sizeLabel(current.blob.size)}. Outputs reflect the last processed settings.</p></>}{errors.map((e, i) => <Notice key={i} error>{e}</Notice>)}{!results.length && <ul className="wb-file-list">{files.map((f, i) => <li key={i}>{f.name}<span>{sizeLabel(f.size)}</span></li>)}</ul>}</section></div></Shell>;
}
