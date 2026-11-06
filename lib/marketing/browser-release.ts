/** Optional public GitHub release page. Installers with checksums use /admin. */
export function browserReleaseUrl(raw=process.env.BROWSER_RELEASE_URL):string|undefined {
 if(!raw)return;
 try{const url=new URL(raw.trim());if(url.protocol!=='https:'||url.hostname!=='github.com'||url.port||url.username||url.password||url.search||url.hash)return;
 if(!/^\/[a-z\d_-]+\/[a-z\d_.-]+\/releases\/(latest|tag\/[^/]+)\/?$/i.test(url.pathname))return;
 return url.href;
 }catch{return}
}
