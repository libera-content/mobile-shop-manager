import type { Command } from '@core/commands';
import { getSnapshot,step,type SimulationSnapshot } from '@core/simulation';
import type { GameState } from '@core/state';
export type Speed=0|1|2|4;
export interface RunnerOptions{readonly ticksPerSecondAt1x:number;readonly maxTicksPerFrame:number;readonly initialSpeed?:Speed;}
export function createSimulationRunner(initial:GameState,options:RunnerOptions){
 let state=initial,speed:Speed=options.initialSpeed??1,acc=0;let queue:Command[]=[];const listeners=new Set<(s:SimulationSnapshot)=>void>();
 const notify=()=>{const snap=getSnapshot(state);for(const l of listeners)l(snap);};
 const one=()=>{const q=queue;queue=[];state=step(state,q);};
 return{
  enqueue:(c:Command)=>queue.push(c),
  setSpeed:(s:Speed)=>{speed=s;},
  getSpeed:()=>speed,
  getState:()=>state,
  getSnapshot:()=>getSnapshot(state),
  subscribe:(l:(s:SimulationSnapshot)=>void)=>{listeners.add(l);return()=>listeners.delete(l);},
  advance:(ms:number)=>{if(state.phase!=='open'){if(queue.length){one();notify();}return;}if(speed===0)return;acc+=(Math.max(0,ms)/1000)*options.ticksPerSecondAt1x*speed;let due=Math.floor(acc);acc-=due;due=Math.min(due,options.maxTicksPerFrame);for(let i=0;i<due&&state.phase==='open';i++)one();if(due)notify();},
  runToEnd:()=>{while(state.phase==='open')one();notify();return state;}
 };
}
