// Runs the embedding model off the main thread. The model library and model files are downloaded
// from public CDNs on first use and cached by the browser. No text is sent anywhere.
const LIB='https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1';
const MODEL='Xenova/all-MiniLM-L6-v2';
let extractor=null,loading=null;
async function load(){
  if(extractor)return extractor;
  if(!loading)loading=(async()=>{
    const {pipeline,env}=await import(LIB);
    env.allowLocalModels=false;
    extractor=await pipeline('feature-extraction',MODEL,{progress_callback:p=>{if(p&&p.status==='progress')postMessage({type:'progress',file:p.file,progress:p.progress})}});
    return extractor;
  })();
  return loading;
}
self.onmessage=async e=>{
  const m=e.data||{};
  try{
    if(m.type==='load'){await load();postMessage({type:'ready'});return}
    if(m.type==='embed'){
      const ex=await load();const vectors=[];
      for(let i=0;i<m.texts.length;i++){
        const out=await ex(String(m.texts[i]).slice(0,4000),{pooling:'mean',normalize:true});
        vectors.push(Array.from(out.data));
        postMessage({type:'embedProgress',id:m.id,done:i+1,total:m.texts.length});
      }
      postMessage({type:'embedded',id:m.id,vectors});
    }
  }catch(err){postMessage({type:'error',id:m.id,message:String((err&&err.message)||err)})}
};
