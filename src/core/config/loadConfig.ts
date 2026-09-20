import { createClockConfig,type ClockConfig } from '../clock';
import type { StaffId } from '../types';
import { asStaffId } from '../types';
import { ConfigError,type ConfigIssue } from './errors';
import { balanceSchema,customersSchema,instructionOptionsSchema,productsSchema,staffSchema,storeLayoutSchema,type BalanceConfig,type CustomersConfig,type InstructionOptionsConfig,type ProductsConfig,type StaffConfig,type StoreLayoutConfig } from './schema';

export interface RawConfig{readonly balance:unknown;readonly staff:unknown;readonly customers:unknown;readonly products:unknown;readonly instructionOptions:unknown;readonly storeLayout:unknown;}
export interface GameConfig{
 readonly balance:BalanceConfig;readonly staff:StaffConfig['staff'];readonly staffIds:readonly StaffId[];
 readonly customers:CustomersConfig;readonly products:ProductsConfig;readonly instructionOptions:InstructionOptionsConfig;
 readonly storeLayout:StoreLayoutConfig;readonly clock:ClockConfig;
}
function parse<T>(file:string,schema:{safeParse:(v:unknown)=>any},value:unknown,issues:ConfigIssue[]):T|undefined{
 const r=schema.safeParse(value);if(r.success)return r.data as T;
 for(const i of r.error.issues)issues.push({file,path:i.path.join('.'),message:i.message});
}
export function loadConfig(raw:RawConfig):GameConfig{
 const issues:ConfigIssue[]=[];
 const balance=parse<BalanceConfig>('balance.json',balanceSchema,raw.balance,issues);
 const staff=parse<StaffConfig>('staff.json',staffSchema,raw.staff,issues);
 const customers=parse<CustomersConfig>('customers.json',customersSchema,raw.customers,issues);
 const products=parse<ProductsConfig>('products.json',productsSchema,raw.products,issues);
 const instructionOptions=parse<InstructionOptionsConfig>('instruction-options.json',instructionOptionsSchema,raw.instructionOptions,issues);
 const storeLayout=parse<StoreLayoutConfig>('store-layout.json',storeLayoutSchema,raw.storeLayout,issues);
 if(!balance||!staff||!customers||!products||!instructionOptions||!storeLayout)throw new ConfigError(issues);
 const ratio=Object.values(customers.purposeRatios).reduce((a,b)=>a+b,0);if(Math.abs(ratio-1)>1e-6)issues.push({file:'customers.json',path:'purposeRatios',message:'合計は1にしてください'});
 const ids=new Set(products.contractTypes.map(c=>c.id));
 for(const t of products.hqTargets)if(!ids.has(t.contractTypeId))issues.push({file:'products.json',path:'hqTargets',message:'未知のcontractTypeId'});
 const zones=new Set(storeLayout.zones.map(z=>z.id));
 for(const s of staff.staff)if(!zones.has(s.homeZone))issues.push({file:'staff.json',path:s.id,message:'未知のhomeZone'});
 if(issues.length)throw new ConfigError(issues);
 return {balance,staff:staff.staff,staffIds:staff.staff.map(s=>asStaffId(s.id)),customers,products,instructionOptions,storeLayout,clock:createClockConfig(balance.time)};
}
