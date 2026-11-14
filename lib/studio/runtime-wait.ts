// Bound every provider operation, including imports, streams and process exit.
export function runtimeWait<T>(work:PromiseLike<T>,milliseconds:number,message:string,signal?:AbortSignal):Promise<T>{
 return new Promise((resolve,reject)=>{
  let finished=false;
  const finish=(settle:()=>void)=>{if(finished)return;finished=true;clearTimeout(timer);signal?.removeEventListener('abort',cancel);settle();};
  const cancel=()=>finish(()=>reject(signal?.reason instanceof Error?signal.reason:new DOMException('Runtime stopped','AbortError')));
  const timer=setTimeout(()=>finish(()=>reject(new Error(message))),milliseconds);
  if(signal?.aborted){cancel();return;}
  signal?.addEventListener('abort',cancel,{once:true});
  Promise.resolve(work).then(value=>finish(()=>resolve(value)),error=>finish(()=>reject(error)));
 });
}
