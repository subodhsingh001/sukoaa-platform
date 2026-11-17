import presets from '@/data/portalPresets.json';
export type PortalRule={id:string;name:string;kind:'photo'|'signature'|'document';width:number;height:number;minKB:number;maxKB:number;format:'jpg'|'pdf';verified:boolean;note:string;exam?:string;source?:string;checked?:string};
export const portalPresets=presets as PortalRule[];
export function portalPreset(id:string){return portalPresets.find(p=>p.id===id);}
export function validateRule(rule:PortalRule){if(!Number.isInteger(rule.width)||!Number.isInteger(rule.height)||rule.width<32||rule.height<32||rule.width>4000||rule.height>4000||rule.width*rule.height>8000000)throw Error('Use whole-number dimensions from 32 to 4,000 pixels, up to 8 megapixels total.');if(!Number.isFinite(rule.minKB)||!Number.isFinite(rule.maxKB)||rule.minKB<0||rule.maxKB<1||rule.minKB>=rule.maxKB||rule.maxKB>10000)throw Error('Use 0 ≤ Min KB < Max KB, with Max KB between 1 and 10,000.');if(!['jpg','pdf'].includes(rule.format))throw Error('Choose JPG or PDF.');return rule;}
// Conservative mixed-unit bounds: at least min×1024 bytes, at most max×1000.
// This avoids a file that passes only because a portal interprets KB differently.
export function sizeBounds(rule:Pick<PortalRule,'minKB'|'maxKB'>){const min=Math.ceil(rule.minKB*1024),max=Math.floor(rule.maxKB*1000);if(min>max)throw Error('This KB range is too narrow for conservative byte validation. Widen the range.');return {min,max};}
export function checkOutput(rule:PortalRule,output:{width:number;height:number;bytes:number;format:string}){const limits=sizeBounds(rule);return {dimensions:output.width===rule.width&&output.height===rule.height,size:output.bytes>=limits.min&&output.bytes<=limits.max,format:output.format===(rule.format==='jpg'?'image/jpeg':'application/pdf')};}
export function dateLabel(value:string){if(!/^\d{4}-\d{2}-\d{2}$/.test(value))return '';return value.slice(8,10)+'-'+value.slice(5,7)+'-'+value.slice(0,4);}
