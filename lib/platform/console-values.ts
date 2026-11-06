export type ConsoleValue=null|string|number|boolean|ConsoleValue[]|{[key:string]:ConsoleValue};
/** Parse only complete JSON containers. Never evaluate console text as code. */
export function consoleValue(line:string):ConsoleValue[]|{[key:string]:ConsoleValue}|undefined{
 const trimmed=line.trim();if(trimmed.length>20000||!['[','{'].includes(trimmed[0]))return;
 try{const value=JSON.parse(trimmed);if(value&&typeof value==='object')return value}catch{}
}
export function valueSummary(value:ConsoleValue){if(Array.isArray(value))return `Array(${value.length})`;if(value&&typeof value==='object')return `Object · ${Object.keys(value).length} properties`;return typeof value==='string'?JSON.stringify(value):String(value)}
