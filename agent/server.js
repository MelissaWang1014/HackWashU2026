import {Spectrum} from 'spectrum-ts';
import {imessage} from 'spectrum-ts/providers/imessage';
import {ContextStore,handleMessage} from './handler.js';
if(!process.env.SPECTRUM_PROJECT_ID||!process.env.SPECTRUM_PROJECT_SECRET){console.error('Configure SPECTRUM_PROJECT_ID and SPECTRUM_PROJECT_SECRET in the server environment.');process.exit(1)}
const store=await new ContextStore(process.env.CHANDRA_STATE_FILE||'agent/data/state.json').load();
const app=await Spectrum({projectId:process.env.SPECTRUM_PROJECT_ID,projectSecret:process.env.SPECTRUM_PROJECT_SECRET,providers:[imessage.config()],options:{logLevel:'warn'}});
console.log('Chandra is listening for /chandra commands through Photon Spectrum.');
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,async()=>{await app.stop();await store.persist();process.exit(0)});
for await(const [space,message] of app.messages){try{await handleMessage(space,message,store)}catch{console.error('Message processing failed; chart context was not logged.')}}
