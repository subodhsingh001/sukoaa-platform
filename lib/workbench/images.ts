export type ImageOptions = {
    width: number;
    height: number;
    fit: 'inside' | 'cover';
    upscale: boolean;
    format: 'image/jpeg' | 'image/png' | 'image/webp';
    quality: number;
    watermark: string;
    prefix: string;
};
export function imageHeader(b: Uint8Array) { const d = new DataView(b.buffer, b.byteOffset, b.byteLength), ascii = (i: number, n: number) => String.fromCharCode(...b.slice(i, i + n)); let width = 0, height = 0, animated = false; if (b.length >= 24 && d.getUint32(0) === 0x89504e47) {
    width = d.getUint32(16);
    height = d.getUint32(20);
    let at = 8;
    while (at + 8 <= b.length) {
        const size = d.getUint32(at), type = ascii(at + 4, 4);
        if (type === 'acTL')
            animated = true;
        if (type === 'IDAT' || type === 'IEND')
            break;
        at += size + 12;
    }
}
else if (b.length >= 30 && ascii(0, 4) === 'RIFF' && ascii(8, 4) === 'WEBP') {
    const type = ascii(12, 4);
    if (type === 'VP8X') {
        width = 1 + b[24] + (b[25] << 8) + (b[26] << 16);
        height = 1 + b[27] + (b[28] << 8) + (b[29] << 16);
        animated = !!(b[20] & 2);
    }
    else if (type === 'VP8 ' && b[23] === 0x9d && b[24] === 1 && b[25] === 0x2a) {
        width = d.getUint16(26, true) & 16383;
        height = d.getUint16(28, true) & 16383;
    }
    else if (type === 'VP8L' && b[20] === 47) {
        const n = d.getUint32(21, true);
        width = (n & 16383) + 1;
        height = ((n >>> 14) & 16383) + 1;
    }
}
else if (b[0] === 255 && b[1] === 216) {
    let at = 2;
    while (at + 4 <= b.length) {
        if (b[at] !== 255)
            break;
        const marker = b[at + 1];
        if (marker === 255) {
            at++;
            continue;
        }
        if (marker === 0xda || marker === 0xd9)
            break;
        const size = d.getUint16(at + 2);
        if (size < 2 || at + 2 + size > b.length)
            break;
        if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker) && size >= 8) {
            height = d.getUint16(at + 5);
            width = d.getUint16(at + 7);
            break;
        }
        at += size + 2;
    }
} if (!width || !height)
    throw Error('Could not read supported image dimensions. Use JPG, PNG or WebP.'); if (animated)
    throw Error('Animated images are unsupported.'); if (width * height > 24000000)
    throw Error('Source images must be at most 24 megapixels.'); return { width, height }; }
export function imageGeometry(w: number, h: number, o: ImageOptions) { if (!Number.isInteger(o.width) || !Number.isInteger(o.height) || o.width < 1 || o.height < 1 || o.width > 4096 || o.height > 4096 || o.width * o.height > 16000000 || !Number.isFinite(o.quality) || o.quality < .1 || o.quality > 1)
    throw Error('Use dimensions of 1–4096 px, at most 16 megapixels, and quality of 10–100%.'); const scale = Math.min(o.width / w, o.height / h, o.upscale ? Infinity : 1); return o.fit === 'cover' ? { width: o.width, height: o.height, scale: Math.max(o.width / w, o.height / h) } : { width: Math.max(1, Math.round(w * scale)), height: Math.max(1, Math.round(h * scale)), scale }; }
export async function processImage(file: File, o: ImageOptions, index: number) { if (file.size > 15000000 || !/^image\/(jpeg|png|webp)$/.test(file.type))
    throw Error('Use JPG, PNG or WebP, under 15 MB each.'); imageHeader(new Uint8Array(await file.slice(0, 262144).arrayBuffer())); const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' }); try {
    const g = imageGeometry(bitmap.width, bitmap.height, o);
    if (o.fit === 'cover' && !o.upscale && g.scale > 1)
        throw Error('Cover would enlarge this image. Enable enlargement or reduce dimensions.');
    const canvas = document.createElement('canvas');
    canvas.width = g.width;
    canvas.height = g.height;
    const ctx = canvas.getContext('2d');
    if (!ctx)
        throw Error('Canvas is unavailable.');
    if (o.format === 'image/jpeg') {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, g.width, g.height);
    }
    ctx.drawImage(bitmap, (g.width - bitmap.width * g.scale) / 2, (g.height - bitmap.height * g.scale) / 2, bitmap.width * g.scale, bitmap.height * g.scale);
    if (o.watermark.trim()) {
        const size = Math.max(12, Math.round(g.width / 30)), text = o.watermark.trim().slice(0, 80);
        ctx.font = `600 ${size}px sans-serif`;
        const x = Math.max(8, g.width - ctx.measureText(text).width - 12);
        ctx.fillStyle = '#000b';
        ctx.fillRect(x - 7, g.height - size - 22, g.width - x + 7, size + 22);
        ctx.fillStyle = 'white';
        ctx.fillText(text, x, g.height - 10);
    }
    const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob(b => b ? resolve(b) : reject(Error('Image encoding failed.')), o.format, o.quality));
    if (blob.type !== o.format)
        throw Error('This browser cannot encode the selected format. Choose JPG or PNG.');
    canvas.width = 1;
    canvas.height = 1;
    const base = file.name.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 70) || 'image';
    return { blob, name: o.prefix.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 30) + String(index + 1).padStart(3, '0') + '-' + base + '.' + (o.format === 'image/jpeg' ? 'jpg' : o.format.split('/')[1]), width: g.width, height: g.height, sourceBytes: file.size, sourceIndex: index };
}
finally {
    bitmap.close();
} }
