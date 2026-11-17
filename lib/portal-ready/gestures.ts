import type {EditOptions} from './canvas';

const clamp=(value:number,min:number,max:number)=>Math.max(min,Math.min(max,value));

/** Convert CSS-pixel movement into the same percentages used by the sliders. */
export function panImage(edit:EditOptions,dx:number,dy:number,width:number,height:number):EditOptions {
 if(width<=0||height<=0)return edit;
 return {...edit,x:clamp(edit.x+dx/width*100,-100,100),y:clamp(edit.y+dy/(height*(edit.stamp?.84:1))*100,-100,100)};
}

/** Keep the image point under the cursor stationary while changing magnification. */
export function zoomImage(edit:EditOptions,zoom:number,anchorX=.5,anchorY=.5):EditOptions {
 const next=clamp(zoom,.25,4),ratio=next/edit.zoom;
 const ax=clamp(anchorX,0,1),ay=clamp(anchorY,0,1)/(edit.stamp?.84:1);
 return {...edit,zoom:next,x:clamp((ax-(ax-(.5+edit.x/100))*ratio-.5)*100,-100,100),y:clamp((ay-(ay-(.5+edit.y/100))*ratio-.5)*100,-100,100)};
}

export function wheelZoom(zoom:number,delta:number,mode:number,pageHeight:number) {
 const pixels=delta*(mode===1?16:mode===2?pageHeight:1);
 return clamp(zoom*Math.exp(-clamp(pixels,-200,200)*.0015),.25,4);
}
