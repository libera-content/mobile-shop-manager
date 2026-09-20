import { formatTick } from '../clock';
import type { GameState } from '../state/gameState';
import type { Command,QueuedCommand } from './commands';
const allowed:Record<Command['type'],readonly string[]>={OpenStore:['preOpen'],IssueInstruction:['preOpen'],TalkToStaff:['open'],ReissueInstruction:['open'],ReceptionHelp:['open'],ProgressCheck:['open'],MoveManager:['open']};
export function validateCommand(state:GameState,command:Command):string|null{
 if(!allowed[command.type].includes(state.phase))return `phase ${state.phase} では実行不可`;
 if(command.type==='IssueInstruction'&&state.morningInstruction)return '朝礼指示はすでに登録済み';
 if((command.type==='TalkToStaff'||command.type==='ReissueInstruction')&&!state.config.staff.some(s=>s.id===command.staffId))return '存在しないスタッフ';
 if(command.type==='ReceptionHelp'&&(!Number.isInteger(command.blocks)||command.blocks<1||command.blocks>4))return '受付応援は1〜4ブロック';
 if(command.type==='MoveManager'&&!state.map.cells.get(`${command.to.x},${command.to.y}`)?.walkable)return '移動不可';
 return null;
}
export function applyCommand(state:GameState,q:QueuedCommand):GameState{
 const reason=validateCommand(state,q.command),gameTime=formatTick(state.clock.tick,state.config.clock);
 const entry=reason?{kind:'CommandRejected' as const,seq:q.seq,tick:state.clock.tick,gameTime,commandType:q.command.type,payload:q.command,reason}:{kind:'CommandApplied' as const,seq:q.seq,tick:state.clock.tick,gameTime,commandType:q.command.type,payload:q.command};
 let next={...state,logs:{...state.logs,decisions:[...state.logs.decisions,entry]}};
 if(reason)return next;
 if(q.command.type==='IssueInstruction')next={...next,morningInstruction:q.command.instruction};
 if(q.command.type==='OpenStore')next={...next,phase:'open',clock:{tick:0},logs:{...next.logs,system:[...next.logs.system,{kind:'StoreOpened' as const,tick:0,gameTime:formatTick(0,state.config.clock)}]}};
 return next;
}
