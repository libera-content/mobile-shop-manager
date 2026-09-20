import { closeTick,formatTick,timeToTick } from './clock';
import type { GameConfig } from './config/loadConfig';
import type { Command } from './commands';
import { applyCommand } from './commands';
import { emptyLogs } from './log';
import { buildStoreMap } from './map';
import { createRngStreams,normalizeSeed } from './rng';
import type { GameState } from './state';
import { asContractTypeId,asManagerId } from './types';

export function createSimulation(config:GameConfig,seed:number|string):GameState{
 const nseed=normalizeSeed(seed);const map=buildStoreMap(config.storeLayout);
 const managerHome=config.storeLayout.facilities.managerHome;
 const meetingTick=timeToTick(config.balance.time.morningMeetingTime,config.clock);
 const hqTargets=config.products.hqTargets.map(t=>{const c=config.products.contractTypes.find(x=>x.id===t.contractTypeId);return{contractTypeId:asContractTypeId(t.contractTypeId),label:c?.label??t.contractTypeId,count:t.count,period:t.period};});
 return{schemaVersion:1,seed:nseed,config,map,clock:{tick:meetingTick},phase:'preOpen',rngState:createRngStreams(nseed),manager:{id:asManagerId('manager'),pos:managerHome,action:'idle',actionRemainingTicks:0},staff:[],customers:[],kpi:{visits:0,served:0,contractsByType:{},salesOpportunityServed:0,salesOpportunityContracts:0,waitTicksTotal:0,waitSamples:0},hqTargets,morningInstruction:null,logs:emptyLogs(),pendingCommands:[],nextCommandSeq:1};
}
export function step(state:GameState,commands:readonly Command[]=[]):GameState{
 let s=state;let seq=s.nextCommandSeq;
 for(const command of commands){s=applyCommand(s,{seq,command});seq++;}
 s={...s,nextCommandSeq:seq};
 if(s.phase==='open'){
   const end=closeTick(s.config.clock);
   const nextTick=s.clock.tick+1;
   if(nextTick>=end){s={...s,clock:{tick:end},phase:'closed',logs:{...s.logs,system:[...s.logs.system,{kind:'StoreClosed',tick:end,gameTime:formatTick(end,s.config.clock)}]}};}
   else s={...s,clock:{tick:nextTick}};
 }
 return s;
}
export interface SimulationSnapshot{readonly tick:number;readonly time:string;readonly phase:string;readonly isClosed:boolean;readonly decisionCount:number;readonly hqTargets:readonly {contractTypeId:string;label:string;achieved:number;target:number}[];}
export function getSnapshot(state:GameState):SimulationSnapshot{return{tick:state.clock.tick,time:formatTick(state.clock.tick,state.config.clock),phase:state.phase,isClosed:state.phase==='closed',decisionCount:state.logs.decisions.length,hqTargets:state.hqTargets.map(t=>({contractTypeId:t.contractTypeId,label:t.label,achieved:state.kpi.contractsByType[t.contractTypeId]??0,target:t.count}))};}
export function runDay(initial:GameState,preOpen:readonly Command[]=[]):GameState{let s=step(initial,[...preOpen,{type:'OpenStore'}]);let guard=0;while(s.phase==='open'){s=step(s);if(++guard>20000)throw new Error('runDay guard');}return s;}
