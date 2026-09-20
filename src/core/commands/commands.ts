import type { InstructionInput } from '../config/schema';
import type { GridPoint } from '../types';
export type Command=
 |{readonly type:'OpenStore'}
 |{readonly type:'IssueInstruction';readonly instruction:InstructionInput}
 |{readonly type:'TalkToStaff';readonly staffId:string}
 |{readonly type:'ReissueInstruction';readonly staffId:string}
 |{readonly type:'ReceptionHelp';readonly blocks:number}
 |{readonly type:'ProgressCheck';readonly mode:'scheduled'|'manual'}
 |{readonly type:'MoveManager';readonly to:GridPoint};
export type CommandType=Command['type'];
export interface QueuedCommand{readonly seq:number;readonly command:Command;}
