export type Row=Record<string,string|number|boolean|unknown[]> & {id:number};
const names=['Asha','Ben','Cora','Dev','Emi','Farah','Gio','Hana','Ira','Jules','Kai','Lina'];
export const datasets:Record<string,Row[]>={
 users:Array.from({length:24},(_,i)=>({id:i+1,name:names[i%12]+' Example '+(Math.floor(i/12)+1),username:'learner'+(i+1),email:`learner${i+1}@example.com`,city:['Maple Bay','Cedar Town','Willow Park'][i%3],company:'Example Studio '+(i%4+1)})),
 products:Array.from({length:40},(_,i)=>({id:i+1,title:['Notebook','Desk lamp','Backpack','Keyboard','Water bottle'][i%5]+' '+(Math.floor(i/5)+1),category:['stationery','lighting','bags','electronics','home'][i%5],price:Math.round((12.5+i*3.25)*100)/100,currency:'USD',inStock:i%4!==0,stock:i%4===0?0:10+i})),
 posts:Array.from({length:60},(_,i)=>({id:i+1,userId:i%24+1,title:`A small experiment ${i+1}`,body:`Fictional post ${i+1} for a tutorial, prototype or coding exercise.`,published:i%5!==0})),
 comments:Array.from({length:120},(_,i)=>({id:i+1,postId:i%60+1,name:`Example comment ${i+1}`,email:`reader${i+1}@example.com`,body:'A fictional comment for practising nested API responses.'})),
 todos:Array.from({length:40},(_,i)=>({id:i+1,userId:i%24+1,title:['Read a chapter','Try a loop','Test a function','Write a note'][i%4],completed:i%3===0})),
 albums:Array.from({length:30},(_,i)=>({id:i+1,userId:i%24+1,title:`Example album ${i+1}`})),
 photos:Array.from({length:120},(_,i)=>({id:i+1,albumId:i%30+1,title:`Example photo ${i+1}`,url:`/api/demo/images/${i+1}`,thumbnailUrl:`/api/demo/images/${i+1}?size=small`})),
 carts:Array.from({length:12},(_,i)=>({id:i+1,userId:i+1,items:[{productId:i+1,quantity:2},{productId:i+2,quantity:1}]})),
 orders:Array.from({length:18},(_,i)=>({id:i+1,userId:i%12+1,total:25+i*12.5,currency:'USD',status:['pending','shipped','delivered'][i%3],createdAt:`2026-01-${String(i+1).padStart(2,'0')}T12:00:00Z`}))
};
export const resources=Object.keys(datasets);
