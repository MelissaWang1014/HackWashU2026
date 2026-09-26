import {build} from 'esbuild';
import {mkdir,unlink} from 'node:fs/promises';
await mkdir('.build',{recursive:true});await mkdir('dist/server',{recursive:true});
await build({entryPoints:['src/app.js'],outfile:'.build/app.js',bundle:true,minify:true,format:'esm',platform:'browser',target:'es2022'});
await build({entryPoints:['src/worker.js'],outfile:'dist/server/index.js',bundle:true,minify:true,format:'esm',platform:'browser',target:'es2022',loader:{'.html':'text','.css':'text','.jpg':'binary'},plugins:[{name:'client-text',setup(b){b.onLoad({filter:/\.build\/app\.js$/},async a=>({contents:await(await import('node:fs/promises')).readFile(a.path,'utf8'),loader:'text'}))}}]});

// Remove obsolete output from the previous static version.
for(const name of ['index.html','app.js','style.css','moon.jpg']) await unlink('dist/'+name).catch(e=>{if(e.code!=='ENOENT')throw e});
