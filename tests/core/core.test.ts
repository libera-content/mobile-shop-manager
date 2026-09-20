import { describe,expect,it } from 'vitest';
import { loadDefaultConfig } from '@core/config';
import { buildStoreMap,findPath } from '@core/map';
import { createSimulation,runDay } from '@core/simulation';
describe('p1 core',()=>{
 it('loads config and map',()=>{const c=loadDefaultConfig();const m=buildStoreMap(c.storeLayout);expect(m.width).toBe(20);expect(m.height).toBe(32);expect(findPath(m,c.storeLayout.facilities.entrance,c.storeLayout.facilities.managerHome)).not.toBeNull();});
 it('runs deterministic empty day',()=>{const c=loadDefaultConfig();const a=runDay(createSimulation(c,123));const b=runDay(createSimulation(c,123));expect(a.clock.tick).toBe(16200);expect(a.phase).toBe('closed');expect(a.logs).toEqual(b.logs);});
});
