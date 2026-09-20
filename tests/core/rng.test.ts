import { describe,expect,it } from 'vitest';
import { createRng,createRngStreams,drawFrom } from '@core/rng';
describe('rng',()=>{
 it('same seed reproduces',()=>{const a=createRng(42),b=createRng(42);expect(Array.from({length:20},()=>a.next())).toEqual(Array.from({length:20},()=>b.next()));});
 it('streams independent',()=>{let s=createRngStreams(7);const first=drawFrom(s,'sales',r=>r.next());for(let i=0;i<50;i++)s=drawFrom(s,'spawn',r=>r.next()).streams;const second=drawFrom(s,'sales',r=>r.next());const ref=drawFrom(first.streams,'sales',r=>r.next());expect(second.value).toBe(ref.value);});
});
