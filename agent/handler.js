import {createHash} from 'node:crypto';
import {mkdir,readFile,writeFile,rename} from 'node:fs/promises';
import {dirname} from 'node:path';
import {validateContext,companionReply} from '../src/astro.js';
export class ContextStore{
 constructor(file){this.file=file;this.data={contexts:{},seen:{}};this.queue=Promise.resolve();}
 async load(){try{this.data=JSON.parse(await readFile(this.file,'utf8'));}catch(e){if(e.code!=='ENOENT')throw e;}return this;}
 key(platform,space,sender){return createHash('sha256').update(JSON.stringify([platform,space,sender])).digest('hex')}
 async persist(){this.queue=this.queue.then(async()=>{await mkdir(dirname(this.file),{recursive:true,mode:0o700});await writeFile(this.file+'.tmp',JSON.stringify(this.data),{mode:0o600});await rename(this.file+'.tmp',this.file)});return this.queue;}
}
export async function handleMessage(space,message,store){
 if(message.direction!=='inbound'||message.content?.type!=='text'||!message.sender?.id)return false;
 const text=message.content.text.trim();if(!/^\/chandra(?:\s|$)/i.test(text))return false;
 const key=store.key(message.platform,space.id,message.sender.id),event=store.key(message.platform,space.id,message.id);
 if(store.data.seen[event])return false;
 // Claim before responding: do not automatically repeat a send whose outcome is unknown.
 store.data.seen[event]=Date.now();const expiry=Date.now()-7*864e5;for(const [k,t] of Object.entries(store.data.seen))if(t<expiry)delete store.data.seen[k];
 for(const [k,v] of Object.entries(store.data.contexts))if(v.updated<Date.now()-30*864e5)delete store.data.contexts[k];
 await store.persist();const command=text.replace(/^\/chandra\s*/i,'');let answer;
 if(/^import\s+/i.test(command)){
  try{const encoded=command.replace(/^import\s+/i,'');if(encoded.length>12000||!/^[A-Za-z0-9+/=]+$/.test(encoded))throw Error('Invalid context payload.');const context=validateContext(JSON.parse(Buffer.from(encoded,'base64').toString('utf8')));store.data.contexts[key]={context,updated:Date.now()};await store.persist();answer=`I have the chart context for ${context.people.map(p=>p.name).join(' and ')} in this conversation. This is an exploratory astrology companion, not a prediction.\n\nTry /chandra moon, /chandra communication, or /chandra reflection. Use /chandra forget to delete this context. Context expires after 30 days. In a group, my replies are visible to everyone here.`;}catch{answer='I could not import that chart context. Copy a fresh context from the Chandra website and paste the complete /chandra import command.';}
 }else if(/^forget$/i.test(command)){delete store.data.contexts[key];await store.persist();answer='Your stored chart context for this conversation has been deleted. Existing messages remain in the chat.';}
 else{const entry=store.data.contexts[key];const reply=companionReply(command||'help',entry?.context);if(reply.clear){delete store.data.contexts[key];await store.persist()}else if(entry){entry.updated=Date.now();await store.persist()}answer=reply.text;}
 try{await space.responding(async()=>{await message.reply(answer)});}catch{console.error('Reply delivery failed or is uncertain. No automatic resend; ask the user to retry.');}return true;
}
