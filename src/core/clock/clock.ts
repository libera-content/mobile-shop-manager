import type { GameMinute,GameTime,Tick } from '../types';
export interface ClockConfig{readonly secondsPerTick:number;readonly openMinute:GameMinute;readonly closeMinute:GameMinute;}
const TIME_PATTERN=/^([01]\d|2[0-3]):([0-5]\d)$/;
export function parseClockTime(text:string):GameMinute{const m=TIME_PATTERN.exec(text);if(!m)throw new Error(`時刻は "HH:MM"（00:00〜23:59）で指定してください: "${text}"`);return Number(m[1])*60+Number(m[2]);}
export function isValidClockTime(text:string):boolean{return TIME_PATTERN.test(text);}
export function createClockConfig(input:{secondsPerTick:number;openTime:string;closeTime:string}):ClockConfig{
 const openMinute=parseClockTime(input.openTime),closeMinute=parseClockTime(input.closeTime);
 if(closeMinute<=openMinute)throw new Error(`閉店時刻は開店時刻より後にしてください: ${input.openTime}〜${input.closeTime}`);
 if(!(input.secondsPerTick>0)||(60%input.secondsPerTick!==0&&input.secondsPerTick%60!==0))throw new Error(`secondsPerTick は 60 の約数または倍数にしてください: ${input.secondsPerTick}`);
 return{secondsPerTick:input.secondsPerTick,openMinute,closeMinute};
}
export function closeTick(cfg:ClockConfig):Tick{return((cfg.closeMinute-cfg.openMinute)*60)/cfg.secondsPerTick;}
export const businessTicks=closeTick;
function tickToSecondOfDay(tick:Tick,cfg:ClockConfig):number{return cfg.openMinute*60+tick*cfg.secondsPerTick;}
export function tickToTime(tick:Tick,cfg:ClockConfig):GameTime{const total=tickToSecondOfDay(tick,cfg),wrapped=((total%86400)+86400)%86400;return{hour:Math.floor(wrapped/3600),minute:Math.floor((wrapped%3600)/60),second:wrapped%60};}
export function tickToGameMinute(tick:Tick,cfg:ClockConfig):GameMinute{return Math.floor(tickToSecondOfDay(tick,cfg)/60);}
export function timeToTick(time:GameTime|string,cfg:ClockConfig):Tick{const t:GameTime=typeof time==='string'?(()=>{const m=parseClockTime(time);return{hour:Math.floor(m/60),minute:m%60,second:0};})():time;return Math.floor((t.hour*3600+t.minute*60+t.second-cfg.openMinute*60)/cfg.secondsPerTick);}
const pad2=(n:number)=>String(n).padStart(2,'0');
export function formatGameTime(time:GameTime,options:{withSeconds?:boolean}={}):string{const base=`${pad2(time.hour)}:${pad2(time.minute)}`;return options.withSeconds?`${base}:${pad2(time.second)}`:base;}
export const formatTick=(tick:Tick,cfg:ClockConfig)=>formatGameTime(tickToTime(tick,cfg));
export const isBeforeOpen=(tick:Tick)=>tick<0;
export const isOpen=(tick:Tick,cfg:ClockConfig)=>tick>=0&&tick<closeTick(cfg);
export const isAfterClose=(tick:Tick,cfg:ClockConfig)=>tick>=closeTick(cfg);
export function ticksPerRealSecond(cfg:ClockConfig,gameSecondsPerRealSecond:number):number{return gameSecondsPerRealSecond/cfg.secondsPerTick;}
