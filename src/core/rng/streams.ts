import { RNG_STREAMS,type RngStreamName } from '../types';
import { createRng,restoreRng,type Rng,type RngState } from './rng';
export interface RngStreamState{ readonly seed:number; readonly state:RngState; }
export type RngStreams=Readonly<Record<RngStreamName,RngStreamState>>;
export function createRngStreams(rootSeed:number|string):RngStreams{
 const root=createRng(rootSeed);const entries=RNG_STREAMS.map(name=>{const child=root.fork(name);return[name,{seed:child.seed,state:child.getState()}] as const;});
 return Object.fromEntries(entries) as Record<RngStreamName,RngStreamState>;
}
export function drawFrom<T>(streams:RngStreams,name:RngStreamName,fn:(rng:Rng)=>T):{value:T;streams:RngStreams}{
 const saved=streams[name];const rng=restoreRng(saved.seed,saved.state);const value=fn(rng);
 return{value,streams:{...streams,[name]:{seed:saved.seed,state:rng.getState()}}};
}
