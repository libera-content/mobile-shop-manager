import { fileURLToPath,URL } from 'node:url';
import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
const src=(p:string)=>fileURLToPath(new URL(`./src/${p}`,import.meta.url));
export default defineConfig({
 base:process.env.VITE_BASE??'/',plugins:[preact()],
 resolve:{alias:{'@core':src('core'),'@runtime':src('runtime'),'@game':src('game'),'@ui':src('ui'),'@data':src('data'),'@app':src('app')}},
 server:{host:true},build:{target:'es2022',chunkSizeWarningLimit:1600}
});
