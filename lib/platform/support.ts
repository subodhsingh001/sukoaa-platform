export function publicEmail(value:string|undefined){return value&&value.length<=254&&/^[^\s@<>"\r\n]+@[^\s@<>"\r\n]+\.[^\s@<>"\r\n]+$/.test(value)?value:undefined;}
export function supportContacts(){const support=publicEmail(process.env.SUPPORT_EMAIL);return {support,security:publicEmail(process.env.SECURITY_EMAIL)||support};}
