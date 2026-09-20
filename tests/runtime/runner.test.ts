import { describe,expect,it } from 'vitest';
import { loadDefaultConfig } from '@core/config';
import { createSimulation } from '@core/simulation';
import { createSimulationRunner } from '@runtime/SimulationRunner';
describe('runner',()=>{
 it('opens and advances',()=>{const c=loadDefaultConfig();const r=createSimulationRunner(createSimulation(c,1),{ticksPerSecondAt1x:27,maxTicksPerFrame:8});r.enqueue({type:'OpenStore'});r.advance(1);expect(r.getState().phase).toBe('open');r.advance(1000);expect(r.getState().clock.tick).toBeGreaterThan(0);});
});
