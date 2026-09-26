import test from 'node:test';
import assert from 'node:assert/strict';
import {calculate, SIGNS} from '../src/astro.js';
import {HOUSES, signSector, chartPlacements, elementBalance, readingContext, validateReadingContext} from '../src/interpretation.js';
import {handleReading} from '../src/reading-api.js';

const profile = {name:'Private name',date:'1997-09-17',time:'08:30',city:'Private place',lat:19.076,lon:72.8777,zone:'Asia/Kolkata',unknown:false};
const chart = calculate(profile);
const request = (body, method='POST') => new Request('https://example.test/api/reading', {method,...(method==='POST' ? {body:typeof body==='string' ? body : JSON.stringify(body)} : {})});
const payload = () => ({context:readingContext(chart),question:'What can I reflect on in relationships?'});

test('houses rotate with the ascendant; work, home and relationships map to 10, 4 and 7', () => {
  for (const rising of SIGNS) {
    const c = {...chart,asc:{...chart.asc,sign:rising}};
    assert.equal(signSector(c,rising).house,1);
    assert.deepEqual(SIGNS.map(sign=>signSector(c,sign).house).sort((a,b)=>a-b),Array.from({length:12},(_,i)=>i+1));
    for (const [house,topic] of [[4,'Home & family'],[7,'Partnerships & relationships'],[10,'Career & public life']]) {
      const sign = SIGNS[(SIGNS.indexOf(rising)+house-1)%12];
      assert.equal(signSector(c,sign).meaning.title,topic);
    }
  }
  assert.equal(HOUSES.length,12);
});

test('D9 uses D9 ascendant and planetary placements rather than D1 houses', () => {
  const c = {...chart,asc:{...chart.asc,sign:'Aries',d9:'Cancer'},planets:chart.planets.map(p=>({...p,sign:'Aries',d9:'Libra'}))};
  assert.equal(signSector(c,'Aries').house,1);
  assert.equal(signSector(c,'Cancer',true).house,1);
  assert.equal(signSector(c,'Libra',true).house,4);
  assert.equal(signSector(c,'Libra',true).planets.length,9);
  assert.equal(signSector(c,'Aries',true).planets.length,0);
  assert.ok(chartPlacements(c,true).planets.every(p=>p.house===4));
});

test('unknown birth time withholds every house and AI context cannot invent it', () => {
  const unknown = calculate({...profile,unknown:true,time:''});
  for (const sign of SIGNS) {assert.equal(signSector(unknown,sign).house,null);assert.equal(signSector(unknown,sign).meaning,null);}
  const context = readingContext(unknown);
  assert.equal(context.ascendant,null);
  assert.ok(context.planets.every(p=>p.house===null));
  assert.deepEqual(validateReadingContext(context),context);
  assert.throws(()=>validateReadingContext({...context,ascendant:'Aries'}));
  assert.throws(()=>validateReadingContext({...context,chartType:'D9'}));
});

test('element shares use seven planets, count zero elements, handle ties, and total 100%', () => {
  const c = {...chart,planets:chart.planets.map((p,i)=>({...p,sign:SIGNS[[0,1,2,3,0,1,2,3,3][i]],d9:'Cancer'}))};
  const mix = elementBalance(c);
  assert.deepEqual(mix.map(e=>e.count),[2,2,2,1]);
  assert.deepEqual(mix.map(e=>e.percent),[29,29,28,14]);
  assert.equal(mix.reduce((n,e)=>n+e.percent,0),100);
  assert.ok(mix.every(e=>!e.planets.includes('Rahu')&&!e.planets.includes('Ketu')));
  assert.deepEqual(elementBalance(c,true).map(e=>e.percent),[0,0,0,100]);
});

test('context validation strips personal fields and rejects malformed or inconsistent placements', () => {
  const context = readingContext(chart);
  for (const field of ['name','date','time','city','lat','lon','id']) assert.ok(!Object.hasOwn(context,field));
  assert.deepEqual(validateReadingContext({...context,name:'secret',planets:context.planets.map(p=>({...p,date:'secret'}))}),context);
  assert.throws(()=>validateReadingContext({...context,planets:context.planets.slice(1)}));
  assert.throws(()=>validateReadingContext({...context,planets:context.planets.map(()=>context.planets[0])}));
  assert.throws(()=>validateReadingContext({...context,planets:context.planets.map(p=>({...p,house:99}))}));
  assert.throws(()=>validateReadingContext(null));
});

test('unconfigured API reports status without calling a provider or returning a fake reading', async () => {
  let calls=0;const fetcher=async()=>{calls++;throw Error('Should not run');};
  const status=await handleReading(request(null,'GET'),{},fetcher);
  assert.deepEqual(await status.json(),{available:false,provider:'DeepSeek'});
  const response=await handleReading(request(payload()),{},fetcher);
  assert.equal(response.status,503);assert.equal((await response.json()).code,'NOT_CONFIGURED');assert.equal(calls,0);
});

test('API validates input, bounds requests and rejects unsupported methods before any provider call', async () => {
  const fetcher=async()=>{throw Error('Must not call provider');};
  for (const body of ['{',null,{}, {...payload(),question:''}, {...payload(),question:'x'.repeat(601)}]) {
    assert.equal((await handleReading(request(body),{DEEPSEEK_API_KEY:'test'},fetcher)).status,400);
  }
  assert.equal((await handleReading(request('x'.repeat(12001)),{},fetcher)).status,413);
  assert.equal((await handleReading(request(null,'DELETE'),{},fetcher)).status,405);
});

test('provider receives sanitized chart data and configured model; actual response is returned', async () => {
  let sent;
  const raw=payload();raw.context.name='Do not transmit';raw.context.date='Private date';
  const response=await handleReading(request(raw),{DEEPSEEK_API_KEY:'test-server-secret',DEEPSEEK_MODEL:'test-model'},async(url,options)=>{
    assert.equal(url,'https://api.deepseek.com/chat/completions');
    assert.equal(options.headers.Authorization,'Bearer test-server-secret');
    sent=JSON.parse(options.body);
    return Response.json({choices:[{message:{content:'A provider reading.'},finish_reason:'stop'}]});
  });
  assert.equal(sent.model,'test-model');assert.equal(sent.stream,false);
  assert.ok(!JSON.stringify(sent).includes('Do not transmit'));assert.ok(!JSON.stringify(sent).includes('Private date'));
  assert.deepEqual(JSON.parse(sent.messages[1].content).chart,readingContext(chart));
  assert.deepEqual(await response.json(),{text:'A provider reading.',provider:'DeepSeek',truncated:false});
});

test('provider errors, malformed responses and timeouts are recoverable without leaking details', async () => {
  for (const [fetcher,status] of [
    [async()=>new Response('private upstream details',{status:401}),502],
    [async()=>new Response('',{status:429}),429],
    [async()=>Response.json({choices:[]}),502],
    [async()=>new Response('invalid json'),502],
    [async()=>{throw new DOMException('private connection details','TimeoutError');},504],
  ]) {
    const response=await handleReading(request(payload()),{DEEPSEEK_API_KEY:'test-server-secret'},fetcher);
    assert.equal(response.status,status);
    const data=await response.json();assert.ok(data.error);assert.ok(!JSON.stringify(data).includes('private'));assert.ok(!JSON.stringify(data).includes('test-server-secret'));
  }
});

test('truncated provider output is marked so the UI can explain it', async () => {
  const response=await handleReading(request(payload()),{DEEPSEEK_API_KEY:'test'},async()=>Response.json({choices:[{message:{content:'Partial answer'},finish_reason:'length'}]}));
  assert.equal((await response.json()).truncated,true);
});
