import { z } from 'zod';
import { GAME_PHASES, TRAITS, VISIT_PURPOSES, ZONE_IDS } from '../types';

const point=z.object({x:z.number().int(),y:z.number().int()});
const zoneId=z.enum(ZONE_IDS);
export const balanceSchema=z.object({
  version:z.number().int().positive(),
  time:z.object({
    secondsPerTick:z.number().positive(),
    preOpenTime:z.string(),
    morningMeetingTime:z.string(),
    openTime:z.string(),
    closeTime:z.string(),
    gameSecondsPerRealSecondAt1x:z.number().positive(),
    maxTicksPerFrame:z.number().int().positive()
  }),
  movement:z.object({walkCellsPerGameSecond:z.number().positive()}),
  communication:z.object({baseTransmission:z.number().min(0).max(1)})
});
export const staffSchema=z.object({staff:z.array(z.object({
  id:z.string().min(1),name:z.string().min(1),trait:z.enum(TRAITS),
  abilities:z.object({sales:z.number().min(0).max(100),proposal:z.number().min(0).max(100),processingSpeed:z.number().min(0).max(100),communication:z.number().min(0).max(100)}),
  condition:z.object({motivation:z.number().min(0).max(100),fatigue:z.number().min(0).max(100),trustInManager:z.number().min(0).max(100)}),
  homeZone:zoneId
}))});
export const customersSchema=z.object({
  arrivals:z.object({dailyWalkIns:z.number().int().nonnegative()}),
  purposeRatios:z.record(z.enum(VISIT_PURPOSES),z.number().min(0).max(1)),
  waitToleranceMinutes:z.object({min:z.number().nonnegative(),max:z.number().nonnegative()})
});
export const productsSchema=z.object({
  company:z.string(),
  contractTypes:z.array(z.object({id:z.string(),label:z.string(),category:z.string(),countsAsContract:z.boolean(),enabled:z.boolean()})),
  salesOpportunityPurposes:z.array(z.string()),
  hqTargets:z.array(z.object({contractTypeId:z.string(),count:z.number().int().nonnegative(),period:z.enum(['day','month'])}))
});
export const instructionOptionsSchema=z.object({
  target:z.object({contractTypeId:z.string(),min:z.number().int(),max:z.number().int(),default:z.number().int()}),
  checkpoints:z.array(z.string())
});
export const storeLayoutSchema=z.object({
  width:z.number().int().positive(),height:z.number().int().positive(),
  zones:z.array(z.object({id:zoneId,x:z.number().int(),y:z.number().int(),w:z.number().int().positive(),h:z.number().int().positive()})),
  facilities:z.object({
    receptionDesk:point,waitingSeats:z.array(point),counters:z.array(point),callDesks:z.array(point),managerHome:point,entrance:point
  }),
  walls:z.array(point)
});
export const phaseSchema=z.enum(GAME_PHASES);
export type BalanceConfig=z.infer<typeof balanceSchema>;
export type StaffConfig=z.infer<typeof staffSchema>;
export type CustomersConfig=z.infer<typeof customersSchema>;
export type ProductsConfig=z.infer<typeof productsSchema>;
export type InstructionOptionsConfig=z.infer<typeof instructionOptionsSchema>;
export type StoreLayoutConfig=z.infer<typeof storeLayoutSchema>;

export const instructionInputSchema=z.object({
  target:z.number().int().nullable(),
  scope:z.enum(['unspecified','upgradePurpose','eligible','all']),
  actions:z.array(z.enum(['propose','call','receptionPriority'])),
  callCount:z.number().int().nullable(),
  assignees:z.array(z.string()),
  checkpoint:z.string().nullable(),
  tone:z.enum(['supportive','neutral','firm','emotional']),
  comprehensionCheck:z.enum(['none','askQuestions','restate'])
});
export type InstructionInput=z.infer<typeof instructionInputSchema>;
