import test from 'node:test';
import assert from 'node:assert/strict';
import {moonSnapshot,sunlit,apodLink} from '../src/birth-moon.js';
test('birth Moon distinguishes the April 2024 new and full moons',()=>{
 const eclipse=moonSnapshot('2024-04-08T18:21:00Z'),full=moonSnapshot('2024-04-23T23:49:00Z');
 assert.equal(eclipse.name,'New Moon');assert.ok(eclipse.fraction<.001);
 assert.equal(full.name,'Full Moon');assert.ok(full.fraction>.999);
 assert.ok(eclipse.distance>350000&&eclipse.distance<410000);
 assert.equal(full.planets.length,7);assert.ok(full.planets.every(p=>p.longitude>=0&&p.longitude<360));
});
test('phase shading illuminates the correct side and excludes the new Moon face',()=>{
 assert.equal(sunlit(.5,0,90),true);assert.equal(sunlit(-.5,0,90),false);
 assert.equal(sunlit(-.5,0,270),true);assert.equal(sunlit(.5,0,270),false);
 assert.equal(sunlit(0,0,0),false);assert.equal(sunlit(0,0,180),true);
});
test('NASA date links respect archive start and future dates',()=>{
 assert.equal(apodLink('1995-06-15'),null);assert.equal(apodLink('2100-01-01'),null);
 assert.equal(apodLink('1997-09-17'),'https://apod.nasa.gov/apod/ap970917.html');
});
