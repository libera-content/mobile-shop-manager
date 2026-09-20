export interface Point { readonly x: number; readonly y: number; }
export interface GridPoint { readonly x: number; readonly y: number; }
export const gridKey = (p: GridPoint): string => `${p.x},${p.y}`;
export const sameGridPoint = (a: GridPoint,b: GridPoint): boolean => a.x===b.x && a.y===b.y;
