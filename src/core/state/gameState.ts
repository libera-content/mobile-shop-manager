import type { InstructionInput } from '../config/schema';
import type { GameConfig } from '../config/loadConfig';
import type { QueuedCommand } from '../commands/commands';
import type { GameLogs } from '../log/logs';
import type { StoreMap } from '../map/storeMap';
import type { RngStreams } from '../rng/streams';
import type { ContractTypeId,CustomerId,CustomerState,GamePhase,GridPoint,ManagerAction,ManagerId,StaffId,StaffState,Tick } from '../types';
export interface ManagerAgent{readonly id:ManagerId;readonly pos:GridPoint;readonly action:ManagerAction;readonly actionRemainingTicks:number;}
export interface StaffAgent{readonly id:StaffId;readonly state:StaffState;readonly pos:GridPoint;}
export interface CustomerAgent{readonly id:CustomerId;readonly state:CustomerState;readonly pos:GridPoint;}
export interface KpiState{readonly visits:number;readonly served:number;readonly contractsByType:Readonly<Record<string,number>>;readonly salesOpportunityServed:number;readonly salesOpportunityContracts:number;readonly waitTicksTotal:number;readonly waitSamples:number;}
export interface HqTargetState{readonly contractTypeId:ContractTypeId;readonly label:string;readonly count:number;readonly period:'day'|'month';}
export interface GameState{
 readonly schemaVersion:1;readonly seed:number;readonly config:GameConfig;readonly map:StoreMap;
 readonly clock:{readonly tick:Tick};readonly phase:GamePhase;readonly rngState:RngStreams;
 readonly manager:ManagerAgent;readonly staff:readonly StaffAgent[];readonly customers:readonly CustomerAgent[];
 readonly kpi:KpiState;readonly hqTargets:readonly HqTargetState[];readonly morningInstruction:InstructionInput|null;
 readonly logs:GameLogs;readonly pendingCommands:readonly QueuedCommand[];readonly nextCommandSeq:number;
}
