import {Spectrum} from 'spectrum-ts';
import {terminal} from 'spectrum-ts/providers/terminal';
import {ContextStore,handleMessage} from './handler.js';
const store=await new ContextStore('agent/data/terminal-state.json').load();
const app=await Spectrum({providers:[terminal.config()],options:{logLevel:'warn'}});
console.log('Chandra Spectrum terminal. Try /chandra help. Press Ctrl+C to exit.');
process.on('SIGINT',async()=>{await app.stop();process.exit(0)});
for await(const [space,message] of app.messages){await handleMessage(space,message,store)}
