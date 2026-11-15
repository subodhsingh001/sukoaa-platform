import {createServer} from 'node:http';
import {pathToFileURL} from 'node:url';
export const products = [{id:1,title:'Notebook',price:12,stock:5},{id:2,title:'Lamp',price:35,stock:2},{id:3,title:'Bag',price:24,stock:0}];
export function createApp(){return createServer(async(req,res)=>{
 const send=(status,body)=>{res.writeHead(status,{'Content-Type':'application/json','Access-Control-Allow-Origin':'*','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(body));};
 try {const url=new URL(req.url,'http://localhost');
 if(req.method==='GET'&&url.pathname==='/health')return send(200,{ok:true});
 if(req.method==='GET'&&url.pathname==='/api/products'){const filter=url.searchParams.get('inStock');if(filter!==null&&!['true','false'].includes(filter))return send(400,{error:'inStock must be true or false'});return send(200,{data:filter===null?products:products.filter(p=>(p.stock>0)===(filter==='true'))});}
 if(req.method==='POST'&&url.pathname==='/api/echo'){let n=0;const chunks=[];for await(const chunk of req){n+=chunk.length;if(n>8000)return send(413,{error:'Body too large'});chunks.push(chunk);}if(!req.headers['content-type']?.startsWith('application/json'))return send(415,{error:'Use application/json'});let value;try{value=JSON.parse(Buffer.concat(chunks).toString());}catch{return send(400,{error:'Invalid JSON'});}return send(200,{data:value,persisted:false});}
 return send(404,{error:'Not found'});
 } catch {if(!res.headersSent)send(500,{error:'Unexpected request failure'});else res.end();}
});}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){const port=Number(process.env.PORT||3000);createApp().listen(port,'0.0.0.0',()=>console.log('Sukoaa Node API listening on '+port));}
