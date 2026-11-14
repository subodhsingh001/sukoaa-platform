// This schedules when installation may start, not its CPU/network priority once started.
export type PreparationHints={onLine?:boolean;connection?:{saveData?:boolean;effectiveType?:string;addEventListener?:(type:string,listener:()=>void)=>void;removeEventListener?:(type:string,listener:()=>void)=>void};deviceMemory?:number;hardwareConcurrency?:number};
export function preparationHold(hints:PreparationHints){
 if(hints.onLine===false)return 'Offline · use Run when connected';
 if(hints.connection?.saveData)return 'Data saver enabled · use Run to prepare';
 if(['slow-2g','2g','3g'].includes(hints.connection?.effectiveType||''))return 'Slower connection · use Run to prepare';
 if((hints.deviceMemory!==undefined&&hints.deviceMemory<=4)||(hints.hardwareConcurrency!==undefined&&hints.hardwareConcurrency<=2))return 'Automatic setup paused for this device · use Run';
 return '';
}
export type PreparationHost={
 document:{readyState:string;visibilityState:string;addEventListener:(type:string,listener:()=>void)=>void;removeEventListener:(type:string,listener:()=>void)=>void};
 navigator:PreparationHints;
 setTimeout:(callback:()=>void,ms:number)=>number;clearTimeout:(id:number)=>void;
 requestIdleCallback?:(callback:()=>void)=>number;cancelIdleCallback?:(id:number)=>void;
 addEventListener:(type:string,listener:()=>void)=>void;removeEventListener:(type:string,listener:()=>void)=>void;
};
export function scheduleBackgroundPreparation(task:()=>void,onHold:(reason:string)=>void,host:PreparationHost=window as unknown as PreparationHost){
 let cancelled=false,started=false,timer:number|undefined,idle:number|undefined;
 const clear=()=>{if(timer!==undefined)host.clearTimeout(timer);if(idle!==undefined)host.cancelIdleCallback?.(idle);timer=undefined;idle=undefined;};
 const allowed=()=>!cancelled&&!started&&host.document.readyState==='complete'&&host.document.visibilityState==='visible'&&!preparationHold(host.navigator);
 const cleanup=()=>{clear();for(const event of events)host.removeEventListener(event,schedule);host.document.removeEventListener('visibilitychange',schedule);host.navigator.connection?.removeEventListener?.('change',schedule);};
 const start=()=>{idle=undefined;if(!allowed()){schedule();return;}started=true;cleanup();task();};
 function schedule(){clear();if(cancelled||started)return;const reason=preparationHold(host.navigator);onHold(reason);if(!allowed())return;
  timer=host.setTimeout(()=>{timer=undefined;if(!allowed()){schedule();return;}if(host.requestIdleCallback)idle=host.requestIdleCallback(start);else start();},2000);
 }
 const events=['load','keydown','pointerdown','online','offline'];
 for(const event of events)host.addEventListener(event,schedule);
 host.document.addEventListener('visibilitychange',schedule);host.navigator.connection?.addEventListener?.('change',schedule);
 schedule();return()=>{cancelled=true;cleanup();};
}
