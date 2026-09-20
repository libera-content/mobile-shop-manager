export type RngState = readonly [number,number,number,number];
export interface WeightedItem<T>{ readonly value:T; readonly weight:number; }
export interface Rng{
 readonly seed:number; next():number; int(min:number,max:number):number; chance(probability:number):boolean;
 pick<T>(items:readonly T[]):T; weighted<T>(items:readonly WeightedItem<T>[]):T; fork(name:string):Rng; getState():RngState;
}
const UINT32=0x1_0000_0000;
export function hashString(text:string):number{
 let h1=0xdeadbeef,h2=0x41c6ce57;
 for(let i=0;i<text.length;i++){const ch=text.charCodeAt(i);h1=Math.imul(h1^ch,2654435761);h2=Math.imul(h2^ch,1597334677);}
 h1=Math.imul(h1^(h1>>>16),2246822507)^Math.imul(h2^(h2>>>13),3266489909);
 h2=Math.imul(h2^(h2>>>16),2246822507)^Math.imul(h1^(h1>>>13),3266489909);
 return (h1^h2)>>>0;
}
export function normalizeSeed(seed:number|string):number{
 if(typeof seed==='number'&&Number.isInteger(seed)&&seed>=0&&seed<UINT32)return seed>>>0;
 if(typeof seed==='number'&&!Number.isFinite(seed))throw new Error(`seed が不正です: ${seed}`);
 return hashString(String(seed));
}
function sfc32Step(state:RngState):{value:number;state:RngState}{
 let[a,b,c,d]=state;const t=(((a+b)>>>0)+d)>>>0;d=(d+1)>>>0;a=b^(b>>>9);b=(c+(c<<3))>>>0;c=((c<<21)|(c>>>11))>>>0;c=(c+t)>>>0;
 return {value:t,state:[a>>>0,b>>>0,c,d]};
}
function initialState(seed:number):RngState{
 let s=seed>>>0;const nextWord=()=>{s=(s+0x9e3779b9)>>>0;let z=s;z=Math.imul(z^(z>>>16),0x85ebca6b);z=Math.imul(z^(z>>>13),0xc2b2ae35);return(z^(z>>>16))>>>0;};
 let st:RngState=[nextWord(),nextWord(),nextWord(),nextWord()];for(let i=0;i<12;i++)st=sfc32Step(st).state;return st;
}
export function deriveSeed(parentSeed:number,name:string):number{return hashString(`${parentSeed>>>0}/${name}`);}
export function createRng(seed:number|string):Rng{const s=normalizeSeed(seed);return restoreRng(s,initialState(s));}
export function restoreRng(seed:number,saved:RngState):Rng{
 let state:RngState=[saved[0]>>>0,saved[1]>>>0,saved[2]>>>0,saved[3]>>>0];
 const next=()=>{const r=sfc32Step(state);state=r.state;return r.value/UINT32;};
 const rng:Rng={seed,next,
 int(min,max){if(!Number.isInteger(min)||!Number.isInteger(max)||min>max)throw new Error(`int(min, max) の範囲が不正です: ${min}, ${max}`);return min+Math.floor(next()*(max-min+1));},
 chance(p){if(!(p>=0&&p<=1))throw new Error(`chance の確率は 0〜1 で指定してください: ${p}`);return next()<p;},
 pick(items){if(items.length===0)throw new Error('pick：空の配列からは選べません');return items[Math.floor(next()*items.length)] as (typeof items)[number];},
 weighted(items){let total=0;for(const it of items){if(!(it.weight>=0)||!Number.isFinite(it.weight))throw new Error(`weighted：重みは 0 以上の有限数で指定してください: ${it.weight}`);total+=it.weight;}if(items.length===0||total<=0)throw new Error('weighted：重みの合計が 0 です');let r=next()*total;for(const it of items){if(it.weight===0)continue;r-=it.weight;if(r<0)return it.value;}for(let i=items.length-1;i>=0;i--){const it=items[i];if(it&&it.weight>0)return it.value;}throw new Error('weighted：選択に失敗しました');},
 fork(name){return createRng(deriveSeed(seed,name));},getState(){return[state[0],state[1],state[2],state[3]];}
 };return rng;
}
