export type PdfPagePlan = {
    id: string;
    source: string;
    index: number;
    rotation: number;
};
export function parsePageRange(text: string, total: number) { const out: number[] = []; for (const s of text.split(',')) {
    const m = s.trim().match(/^(\d+)(?:\s*-\s*(\d+))?$/);
    if (!m)
        throw Error('Use page positions such as 1-3, 5.');
    const a = +m[1], b = +(m[2] || m[1]);
    if (a < 1 || b < a || b > total)
        throw Error('Choose ascending ranges within 1–' + total);
    for (let n = a; n <= b; n++)
        if (!out.includes(n - 1))
            out.push(n - 1);
} return out; }
export async function inspectPDF(bytes: Uint8Array) { if (bytes.length > 15000000)
    throw Error('Each PDF must be under 15 MB.'); const { PDFDocument } = await import('pdf-lib'), d = await PDFDocument.load(bytes); if (d.getPageCount() > 100)
    throw Error('Use at most 100 pages.'); if (d.getForm().getFields().length)
    throw Error('Interactive forms are unsupported. Export a flattened copy first.'); return d.getPageCount(); }
export async function exportPDF(sources: Record<string, Uint8Array>, plan: PdfPagePlan[], numbers = false, watermark = '') { if (!plan.length || plan.length > 100)
    throw Error('Keep 1–100 output pages.'); if (watermark.length > 60 || /[^\x20-\x7e]/.test(watermark))
    throw Error('Use up to 60 basic Latin characters for the watermark.'); const { PDFDocument, degrees, StandardFonts, rgb } = await import('pdf-lib'), out = await PDFDocument.create(), font = numbers || watermark ? await out.embedFont(StandardFonts.Helvetica) : null, docs = new Map<string, Awaited<ReturnType<typeof PDFDocument.load>>>(); for (let i = 0; i < plan.length; i++) {
    const p = plan[i];
    if (!sources[p.source])
        throw Error('A source PDF is missing.');
    if (!docs.has(p.source))
        docs.set(p.source, await PDFDocument.load(sources[p.source]));
    const doc = docs.get(p.source)!;
    if (!Number.isInteger(p.index) || p.index < 0 || p.index >= doc.getPageCount() || ![0, 90, 180, 270].includes(p.rotation))
        throw Error('Invalid page selection.');
    const [page] = await out.copyPages(doc, [p.index]);
    const angle = (page.getRotation().angle + p.rotation) % 360;
    page.setRotation(degrees(angle));
    out.addPage(page);
    const { width, height } = page.getSize(), origin = (x: number, y: number) => angle === 90 ? { x: width - y, y: x } : angle === 180 ? { x: width - x, y: height - y } : angle === 270 ? { x: y, y: height - x } : { x, y };
    if (numbers && font)
        page.drawText(`${i + 1} / ${plan.length}`, { ...origin(18, 14), rotate: degrees(angle), size: 9, font, color: rgb(.2, .3, .25) });
    if (watermark && font)
        page.drawText(watermark, { ...origin(20, (angle % 180 ? width : height) / 2), rotate: degrees(angle), size: Math.max(8, Math.min(28, ((angle % 180 ? height : width) - 40) / (watermark.length * .7))), font, color: rgb(.3, .35, .3), opacity: .25 });
} out.setCreator('Sukoaa PDF organizer'); return new Blob([new Uint8Array(await out.save())], { type: 'application/pdf' }); }
export async function renderPDF(bytes: Uint8Array) { const pdf = await import('pdfjs-dist'); pdf.GlobalWorkerOptions.workerSrc = '/workbench/pdfjs/pdf.worker.min.mjs'; const task = pdf.getDocument({ data: bytes.slice(), enableXfa: false, standardFontDataUrl: '/workbench/pdfjs/standard_fonts/', cMapUrl: '/workbench/pdfjs/cmaps/', cMapPacked: true, wasmUrl: '/workbench/pdfjs/wasm/' }); try {
    return await task.promise;
}
catch (e) {
    await task.destroy();
    throw e;
} }
export async function thumbnailPDF(doc: import('pdfjs-dist').PDFDocumentProxy, n: number) { const page = await doc.getPage(n + 1), base = page.getViewport({ scale: 1 }), viewport = page.getViewport({ scale: Math.min(220 / base.width, 260 / base.height) }), canvas = document.createElement('canvas'); canvas.width = Math.ceil(viewport.width); canvas.height = Math.ceil(viewport.height); await page.render({ canvas, viewport, annotationMode: 0 }).promise; const url = canvas.toDataURL('image/jpeg', .75); page.cleanup(); canvas.width = 1; canvas.height = 1; return url; }
