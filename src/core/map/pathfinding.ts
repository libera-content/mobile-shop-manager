import type { GridPoint } from '../types';
import { gridKey } from '../types';
import { isWalkable,type StoreMap } from './storeMap';
export type Path=readonly GridPoint[];
export interface PathCache{get(k:string):Path|undefined;set(k:string,p:Path):void;}
export const createPathCache=():PathCache=>{const m=new Map<string,Path>();return{get:k=>m.get(k),set:(k,p)=>{m.set(k,p)}}};
const dirs=[[-1,-1],[0,-1],[1,-1],[-1,0],[1,0],[-1,1],[0,1],[1,1]] as const;
const h=(a:GridPoint,b:GridPoint)=>Math.max(Math.abs(a.x-b.x),Math.abs(a.y-b.y));
export function canStep(map:StoreMap,a:GridPoint,b:GridPoint):boolean{
 if(!isWalkable(map,b))return false;const dx=b.x-a.x,dy=b.y-a.y;
 if(Math.abs(dx)===1&&Math.abs(dy)===1)return isWalkable(map,{x:a.x+dx,y:a.y})&&isWalkable(map,{x:a.x,y:a.y+dy});
 return true;
}
export function findPath(map:StoreMap,start:GridPoint,goal:GridPoint,cache?:PathCache):Path|null{
 const ck=`${map.version}:${gridKey(start)}>${gridKey(goal)}`;const hit=cache?.get(ck);if(hit)return hit;
 if(!isWalkable(map,start)||!isWalkable(map,goal))return null;
 const open=[start],came=new Map<string,GridPoint>(),g=new Map([[gridKey(start),0]]);
 while(open.length){
   open.sort((a,b)=>(g.get(gridKey(a))??Infinity)+h(a,goal)-((g.get(gridKey(b))??Infinity)+h(b,goal)));
   const cur=open.shift()!;if(cur.x===goal.x&&cur.y===goal.y){const out:GridPoint[]=[cur];let k=gridKey(cur);while(came.has(k)){const p=came.get(k)!;out.push(p);k=gridKey(p);}out.reverse();cache?.set(ck,out);return out;}
   for(const[dX,dY]of dirs){const n={x:cur.x+dX,y:cur.y+dY};if(!canStep(map,cur,n))continue;const nk=gridKey(n),ng=(g.get(gridKey(cur))??0)+(dX&&dY?Math.SQRT2:1);if(ng<(g.get(nk)??Infinity)){came.set(nk,cur);g.set(nk,ng);if(!open.some(p=>p.x===n.x&&p.y===n.y))open.push(n);}}
 }
 return null;
}
