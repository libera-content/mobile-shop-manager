import type { GridPoint } from '../types';
export type SeatOccupancy=Readonly<Record<string,string|null>>;
export const createSeatOccupancy=(points:readonly GridPoint[]):SeatOccupancy=>Object.fromEntries(points.map((_,i)=>[`seat-${i+1}`,null]));
