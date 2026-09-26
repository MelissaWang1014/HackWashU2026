import {SIGNS} from './astro.js';

// Houses are counted from the ascendant, never from the visual cell order.
export const HOUSES = [
  {title:'Self & identity', short:'Self', keywords:'Presence · outlook · initiative', text:'How you meet the world, express yourself, and begin something new.', prompt:'Where do you feel most comfortable being yourself?'},
  {title:'Resources & values', short:'Resources', keywords:'Income · possessions · values', text:'Your personal resources, sense of enough, family values, and the way you use your voice.', prompt:'Which resources help you feel secure, beyond what you own?'},
  {title:'Communication & siblings', short:'Communication', keywords:'Siblings · skills · everyday exchanges', text:'How you share ideas, learn by doing, and connect with siblings and your immediate surroundings.', prompt:'What would you like to say more clearly?'},
  {title:'Home & family', short:'Home', keywords:'Roots · family · belonging', text:'Your home life, family roots, private world, and the places and people that help you feel grounded.', prompt:'What makes a place feel like home to you?'},
  {title:'Creativity & joy', short:'Creativity', keywords:'Romance · children · self-expression', text:'Play, creative expression, romance, and the things you nurture for the joy of it.', prompt:'What would you make time for without needing to be good at it?'},
  {title:'Daily work & routines', short:'Daily work', keywords:'Habits · service · everyday effort', text:'Everyday work, responsibilities, service, and the routines that support your well-being.', prompt:'Which small routine makes your day more manageable?'},
  {title:'Partnerships & relationships', short:'Partnerships', keywords:'Commitment · cooperation · one-to-one bonds', text:'Close partnerships, committed relationships, agreements, and how you make room for another person.', prompt:'What does a fair balance of giving and receiving look like to you?'},
  {title:'Trust & shared resources', short:'Trust', keywords:'Intimacy · change · shared commitments', text:'Trust, vulnerability, shared resources, and how you navigate transitions with others.', prompt:'What helps you feel safe enough to ask for support?'},
  {title:'Learning & perspective', short:'Learning', keywords:'Study · beliefs · exploration', text:'The beliefs, teachers, studies, and journeys that broaden your view of the world.', prompt:'Which assumption would you like to explore with fresh curiosity?'},
  {title:'Career & public life', short:'Career', keywords:'Work · direction · contribution', text:'Your professional direction, public responsibilities, reputation, and the contribution you want to make.', prompt:'What kind of contribution would feel meaningful to you?'},
  {title:'Friends & community', short:'Community', keywords:'Friendship · networks · shared hopes', text:'Friendships, communities, collective projects, and the hopes you pursue with other people.', prompt:'Which connections give you room to grow?'},
  {title:'Rest & inner life', short:'Rest', keywords:'Solitude · reflection · release', text:'Rest, privacy, contemplation, and making space to step back from everyday demands.', prompt:'What are you ready to put down for a while?'},
];

export const ELEMENTS = [
  {name:'Fire', color:'#e9a184', quality:'Energy & initiative'},
  {name:'Earth', color:'#d9bd8b', quality:'Stability & practice'},
  {name:'Air', color:'#9fcbbb', quality:'Ideas & connection'},
  {name:'Water', color:'#94b8df', quality:'Feeling & imagination'},
];
export const SIGN_QUALITIES = [
  'initiative and direct expression', 'steadiness and tangible comfort',
  'curiosity and exchanging ideas', 'care and a sense of belonging',
  'warmth and creative expression', 'discernment and thoughtful service',
  'balance and cooperation', 'depth and emotional honesty',
  'exploration and a search for meaning', 'patience and responsibility',
  'independence and collective possibilities', 'imagination and compassion',
];
export const PLANET_THEMES = {
  Sun:'identity and purpose', Moon:'feelings and comfort', Mercury:'learning and communication',
  Venus:'affection and appreciation', Mars:'initiative and effort', Jupiter:'growth and perspective',
  Saturn:'structure and responsibility', Rahu:'curiosity and unfamiliar territory', Ketu:'detachment and reflection',
};

export function chartPlacements(chart, divisional = false) {
  const rising = chart.asc ? (divisional ? chart.asc.d9 : chart.asc.sign) : null;
  return {
    rising,
    planets:chart.planets.map(p => {
      const sign = divisional ? p.d9 : p.sign;
      return {...p, sign, house:rising ? (SIGNS.indexOf(sign) - SIGNS.indexOf(rising) + 12) % 12 + 1 : null};
    }),
  };
}

export function signSector(chart, sign, divisional = false) {
  const {rising, planets} = chartPlacements(chart, divisional);
  const house = rising ? (SIGNS.indexOf(sign) - SIGNS.indexOf(rising) + 12) % 12 + 1 : null;
  return {sign, house, meaning:house ? HOUSES[house - 1] : null, planets:planets.filter(p => p.sign === sign)};
}

export function elementBalance(chart, divisional = false) {
  // Seven classical planets, equally weighted. Lunar nodes and ascendant are excluded.
  const planets = chartPlacements(chart, divisional).planets.filter(p => !['Rahu','Ketu'].includes(p.name));
  const rows = ELEMENTS.map((element, i) => {
    const members = planets.filter(p => SIGNS.indexOf(p.sign) % 4 === i);
    const exact = members.length / planets.length * 100;
    return {...element, count:members.length, planets:members.map(p => p.name), percent:Math.floor(exact), remainder:exact % 1};
  });
  const order = [...rows].sort((a,b) => b.remainder - a.remainder);
  for (let i = 0, left = 100 - rows.reduce((n,r) => n + r.percent, 0); i < left; i++) order[i].percent++;
  return rows;
}

export function readingContext(chart, divisional = false) {
  const {rising, planets} = chartPlacements(chart, divisional);
  // Deliberately omit name, date, time, location, coordinates and profile identifiers.
  return {
    chartType:divisional ? 'D9' : 'D1', birthTimeKnown:!chart.profile.unknown,
    ascendant:rising,
    planets:planets.map(({name,sign,house}) => ({name,sign,house})),
  };
}

export function validateReadingContext(raw) {
  if (!raw || !['D1','D9'].includes(raw.chartType) || typeof raw.birthTimeKnown !== 'boolean' ||
      (raw.chartType === 'D9' && !raw.birthTimeKnown) ||
      (raw.birthTimeKnown ? !SIGNS.includes(raw.ascendant) : raw.ascendant !== null) ||
      !Array.isArray(raw.planets) || raw.planets.length !== 9) throw Error('Invalid chart context. Calculate your chart again.');
  const names = Object.keys(PLANET_THEMES);
  if (new Set(raw.planets.map(p => p?.name)).size !== 9) throw Error('Invalid planet list.');
  const planets = raw.planets.map(p => {
    if (!p || !names.includes(p.name) || !SIGNS.includes(p.sign)) throw Error('Invalid planet placement.');
    const house = raw.birthTimeKnown ? (SIGNS.indexOf(p.sign) - SIGNS.indexOf(raw.ascendant) + 12) % 12 + 1 : null;
    if (p.house !== house) throw Error('House placements do not match the ascendant.');
    return {name:p.name, sign:p.sign, house};
  });
  return {chartType:raw.chartType, birthTimeKnown:raw.birthTimeKnown, ascendant:raw.ascendant, planets};
}
