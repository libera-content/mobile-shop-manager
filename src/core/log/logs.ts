import type { Command,CommandType } from '../commands/commands';
import type { Tick } from '../types';
export interface CommandAppliedEntry{readonly kind:'CommandApplied';readonly seq:number;readonly tick:Tick;readonly gameTime:string;readonly commandType:CommandType;readonly payload:Command;}
export interface CommandRejectedEntry{readonly kind:'CommandRejected';readonly seq:number;readonly tick:Tick;readonly gameTime:string;readonly commandType:CommandType;readonly payload:Command;readonly reason:string;}
export type DecisionLogEntry=CommandAppliedEntry|CommandRejectedEntry;
export interface SystemEventEntry{readonly kind:'StoreOpened'|'StoreClosed';readonly tick:Tick;readonly gameTime:string;}
export interface GameLogs{readonly decisions:readonly DecisionLogEntry[];readonly system:readonly SystemEventEntry[];}
export const emptyLogs=():GameLogs=>({decisions:[],system:[]});
