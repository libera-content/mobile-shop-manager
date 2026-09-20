import type { StoreLayoutConfig } from '../config/schema';
import type { GridPoint,ZoneId } from '../types';
import { gridKey } from '../types';
export interface Cell{readonly p:GridPoint;readonly walkable:boolean;readonly zoneId:ZoneId|null;readonly movementCost:number;}
export interface StoreMap{readonly width:number;readonly height:number;readonly cells:ReadonlyMap<string,Cell>;readonly version:number;}
export function buildStoreMap(layout:StoreLayoutConfig):StoreMap{
 const walls=new Set(layout.walls.map(gridKey));const cells=new Map<string,Cell>();
 for(let y=0;y<layout.height;y++)for(let x=0;x<layout.width;x++){
   const z=layout.zones.find(a=>x>=a.x&&x<a.x+a.w&&y>=a.y&&y<a.y+a.h);
   const p={x,y};cells.set(gridKey(p),{p,walkable:!walls.has(gridKey(p))&&!!z,zoneId:z?.id??null,movementCost:1});
 }
 return{width:layout.width,height:layout.height,cells,version:1};
}
export function getCell(map:StoreMap,p:GridPoint):Cell|undefined{return map.cells.get(gridKey(p));}
export function isWalkable(map:StoreMap,p:GridPoint):boolean{return !!getCell(map,p)?.walkable;}
export function zoneAt(map:StoreMap,p:GridPoint):ZoneId|null{return getCell(map,p)?.zoneId??null;}
