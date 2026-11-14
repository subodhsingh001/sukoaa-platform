export async function dependencyKey(files:Record<string,string>){
 const pkg=JSON.parse(files['package.json']||'{}');
 const spec=JSON.stringify([pkg.dependencies||{},pkg.devDependencies||{},pkg.optionalDependencies||{},pkg.overrides||{},pkg.resolutions||{},files['package-lock.json']||'',files['.npmrc']||'']);
 const hash=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(spec));
 return 'webcontainer-1.6.4-'+Array.from(new Uint8Array(hash),v=>v.toString(16).padStart(2,'0')).join('');
}
