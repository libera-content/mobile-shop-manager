import { describe,expect,it } from 'vitest';
import { closeTick,createClockConfig,formatTick,timeToTick } from '@core/clock';
describe('clock',()=>{const c=createClockConfig({secondsPerTick:2,openTime:'10:00',closeTime:'19:00'});
 it('close tick',()=>expect(closeTick(c)).toBe(16200));
 it('formats',()=>{expect(formatTick(0,c)).toBe('10:00');expect(timeToTick('19:00',c)).toBe(16200);});
});
