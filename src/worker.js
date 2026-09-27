import html from './index.html';
import {handleReading} from './reading-api.js';
import css from './style.css';
import script from '../.build/app.js';
import moon from '../public/moon.jpg';
const json=(x,status=200)=>Response.json(x,{status,headers:{'Cache-Control':'no-store'}});
export default {async fetch(req,env){const u=new URL(req.url);if(u.pathname.startsWith('/api/')){if(req.method!=='GET'&&req.headers.get('Origin')&&req.headers.get('Origin')!==u.origin)return json({error:'Request origin is not allowed.'},403);if(u.pathname==='/api/reading')return handleReading(req,env);return json({error:'Not found.'},404);}
const routes={'/':[html,'text/html; charset=utf-8'],'/index.html':[html,'text/html; charset=utf-8'],'/style.css':[css,'text/css; charset=utf-8'],'/app.js':[script,'text/javascript; charset=utf-8'],'/moon.jpg':[moon,'image/jpeg']};const asset=routes[u.pathname];if(!asset)return new Response('Not found',{status:404});return new Response(asset[0],{headers:{'Content-Type':asset[1],'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin'}});}};
