import {SIGNS, MOON_TEXT} from './astro.js';
import {SIGN_QUALITIES, PLANET_THEMES, chartPlacements, signSector, elementBalance, readingContext} from './interpretation.js';

const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const cells = [[0,0],[1,0],[2,0],[3,0],[3,1],[3,2],[3,3],[2,3],[1,3],[0,3],[0,2],[0,1]];
const signOrder = [11,0,1,2,3,4,5,6,7,8,9,10];
const savedStates = new WeakMap();
const questions = ['What does my chart suggest about work?', 'How do I connect with family?', 'What can I reflect on in relationships?'];

function diagram(chart, divisional) {
  const {rising} = chartPlacements(chart, divisional);
  return `<svg viewBox="0 0 320 320" class="chart-svg interactive-chart" role="group" aria-label="Interactive ${divisional ? 'D9 Navamsa' : 'D1 birth'} chart. Explore each sign for its house and life themes.">
    ${cells.map(([x,y],i) => {
      const sign = SIGNS[signOrder[i]], sector = signSector(chart, sign, divisional);
      const label = `${sign}. ${sector.house ? `House ${sector.house}: ${sector.meaning.title}. ${sector.meaning.text}` : 'House unknown without birth time.'} ${sector.planets.length ? sector.planets.map(p => p.name).join(', ') : 'No planets in this sign.'}`;
      return `<g class="chart-sector" role="button" tabindex="0" aria-pressed="false" aria-label="${esc(label)}" data-sign="${sign}">
        <rect class="sector-bg" x="${x*80+1}" y="${y*80+1}" width="78" height="78" rx="3"/>
        <text class="signlabel" x="${x*80+7}" y="${y*80+16}">${sign.slice(0,3)}${rising === sign ? ' · Asc' : ''}</text>
        <text class="house-number" x="${x*80+72}" y="${y*80+16}" text-anchor="end">${sector.house ? String(sector.house).padStart(2,'0') : '—'}</text>
        ${sector.planets.map((p,j) => `<text class="planet-label ${p.name === 'Moon' ? 'moon-label' : ''}" x="${x*80+7+(j%3)*23}" y="${y*80+33+Math.floor(j/3)*12}">${p.name.slice(0,2)}</text>`).join('')}
        <text class="house-topic" x="${x*80+7}" y="${y*80+72}">${sector.meaning?.short || 'Time unknown'}</text>
      </g>`;
    }).join('')}
    <text x="160" y="136" text-anchor="middle" class="chart-moon">☾</text>
    <text x="160" y="164" text-anchor="middle" class="chart-name">${divisional ? 'D9' : 'D1'}</text>
    <text x="160" y="184" text-anchor="middle" class="signlabel">${divisional ? 'NAVAMSA' : 'RASHI CHART'}</text>
    <text x="160" y="202" text-anchor="middle" class="signlabel">EXPLORE YOUR SKY</text>
  </svg>`;
}

function elementCard(chart, divisional) {
  const elements = elementBalance(chart, divisional);
  let stop = 0;
  const gradient = elements.map(e => {const start = stop; stop += e.percent; return `${e.color} ${start}% ${stop}%`;}).join(',');
  const max = Math.max(...elements.map(e => e.count));
  const dominant = elements.filter(e => e.count === max).map(e => e.name);
  const title = dominant.length > 2 ? 'A shared elemental balance' : `${dominant.join(' & ')} ${dominant.length === 1 ? 'leads' : 'share the lead'}`;
  return `<article class="element-card"><div class="reading-card-heading"><div><p class="eyebrow">YOUR ELEMENT MIX</p><h3>${title}</h3></div><span class="tiny-orbit" aria-hidden="true">◌</span></div>
    <div class="element-content"><div class="element-ring" style="--element-gradient:conic-gradient(${gradient})" role="img" aria-label="${elements.map(e => `${e.name} ${e.percent}%`).join(', ')}"><span aria-hidden="true">✧<small>${divisional ? 'D9' : 'D1'}</small></span></div>
    <ul class="element-legend">${elements.map(e => `<li><span class="element-dot" style="--element-color:${e.color}"></span><div><strong>${e.name}</strong><small>${e.quality}</small></div><b>${e.percent}%</b></li>`).join('')}</ul></div>
    <p class="reading-footnote">Seven classical planets, equally weighted. Nodes and rising sign excluded. Percentages rounded to total 100%; not a personality score.</p></article>`;
}

function basicReading(chart, divisional) {
  const {rising, planets} = chartPlacements(chart, divisional);
  const moon = planets.find(p => p.name === 'Moon'), sun = planets.find(p => p.name === 'Sun');
  return `<p class="reading-intro">A few starting points for understanding your sky.</p>
    ${divisional ? '<p class="reading-note">D9 is a secondary lens. Read it alongside D1; small birth-time changes can shift these placements.</p>' : ''}
    ${chart.profile.unknown ? '<p class="reading-note">Birth time is unknown. These are provisional noon placements; houses and rising sign are unavailable.</p>' : ''}
    <div class="big-three"><article><small>☾ &nbsp; ${divisional ? 'D9 ' : ''}MOON</small><strong>${moon.sign}</strong><span>Emotional rhythm</span></article><article><small>☉ &nbsp; ${divisional ? 'D9 ' : ''}SUN</small><strong>${sun.sign}</strong><span>Self-expression</span></article><article><small>↗ &nbsp; ${divisional ? 'D9 ' : ''}RISING</small><strong>${rising || 'Unknown'}</strong><span>${rising ? 'How you begin' : 'Birth time needed'}</span></article></div>
    ${elementCard(chart, divisional)}
    <div class="placement-readings"><details open><summary>${divisional ? 'D9 Moon' : 'Your Moon'} in ${moon.sign}</summary><p>${divisional ? `In this secondary chart, the Moon in ${moon.sign} offers themes of ${SIGN_QUALITIES[SIGNS.indexOf(moon.sign)]} for reflection.` : MOON_TEXT[SIGNS.indexOf(moon.sign)]}</p></details>
    <details><summary>${divisional ? 'D9 Sun' : 'Your Sun'} in ${sun.sign}</summary><p>The Sun offers a lens on identity and purpose. In ${sun.sign}, explore ${SIGN_QUALITIES[SIGNS.indexOf(sun.sign)]}. Where do these themes feel useful in how you express yourself?</p></details>
    ${rising ? `<details><summary>${divisional ? 'D9 rising' : 'Your rising sign'} in ${rising}</summary><p>Your ascendant marks the first house in this chart. ${rising} brings themes of ${SIGN_QUALITIES[SIGNS.indexOf(rising)]} to the way you approach new situations.</p></details>` : ''}</div>
    <p class="reading-footnote">Symbolic reflections for exploring yourself. Your choices and lived experience matter more than a chart.</p>`;
}

export function mountChartReading(container, chart, divisional = false) {
  let states = savedStates.get(chart);
  if (!states) {states = {}; savedStates.set(chart, states);}
  const key = divisional ? 'd9' : 'd1';
  const state = states[key] ||= {tab:'basic', sign:divisional ? chart.moon.d9 : chart.moon.sign, question:'What should I understand first about my chart?', messages:[], error:'', available:null, initialRequested:false};
  let alive = true, hovered = null, request = null, busy = false, checking = false;
  container.innerHTML = `<div class="chart-explorer"><div class="chart-column"><div class="chart-caption"><span>${divisional ? 'NAVAMSA / D9' : 'YOUR BIRTH CHART / D1'}</span><span>SIDEREAL</span></div>
    <div class="chart-stage">${diagram(chart, divisional)}<div class="house-tooltip" role="tooltip" id="houseTooltip" hidden></div></div>
    <p class="chart-instruction"><span aria-hidden="true">⌖</span> Hover to explore. Click or tap to keep a house in view.</p>
    <div class="house-shortcuts" aria-label="Explore life areas">${[[10,'Work'],[4,'Family'],[7,'Relationships']].map(([house,label]) => `<button data-house-shortcut="${house}" ${chart.asc ? '' : 'disabled'}>${label} <span>↗</span></button>`).join('')}</div>
    <section class="house-detail" aria-label="Selected chart area" aria-live="polite"></section>
    <p class="reading-footnote">${chart.asc ? 'Whole-sign houses begin at the ascendant. An empty house still represents a part of life.' : 'A birth time is needed to connect these signs to houses and life areas.'}</p>
    </div><aside class="interpretation-panel" aria-label="Chart interpretations"><div class="reading-tabs" role="tablist" aria-label="Interpretation type"><button id="basicReadingTab" role="tab" data-reading-tab="basic" aria-controls="readingContent">Basic reading</button><button id="aiReadingTab" role="tab" data-reading-tab="ai" aria-controls="readingContent"><span class="ai-spark" aria-hidden="true">✧</span> DeepSeek reading</button></div><div id="readingContent" role="tabpanel"></div></aside></div>`;
  const find = selector => container.querySelector(selector);
  const all = selector => [...container.querySelectorAll(selector)];
  const stage = find('.chart-stage'), tooltip = find('.house-tooltip'), detail = find('.house-detail'), content = find('#readingContent');

  function updateSector() {
    const sector = signSector(chart, hovered || state.sign, divisional);
    all('[data-sign]').forEach(el => {
      el.classList.toggle('is-selected', el.dataset.sign === state.sign);
      el.classList.toggle('is-exploring', el.dataset.sign === hovered);
      el.setAttribute('aria-pressed', String(el.dataset.sign === state.sign));
    });
    detail.innerHTML = `<div class="house-detail-top"><span class="house-index">${sector.house ? String(sector.house).padStart(2,'0') : '—'}</span><div><p class="eyebrow">${sector.house ? `HOUSE ${sector.house}` : 'SIGN EXPLORER'} <span> / ${sector.sign}</span></p><h3>${sector.meaning?.title || sector.sign}</h3></div></div>
      <p class="house-keywords">${sector.meaning?.keywords || 'Birth time unknown'}</p><p>${sector.meaning?.text || 'Explore the planets in this sign. A reliable birth time is needed to identify its house and life themes.'}</p>
      <div class="house-planets">${sector.planets.length ? sector.planets.map(p => `<span>${p.name}</span>`).join('') : '<span class="empty-house-label">No planets here</span>'}</div>
      ${sector.planets.length ? `<p class="planet-meaning">${sector.planets.map(p => `${p.name} brings a symbolic focus on ${PLANET_THEMES[p.name]}.`).join(' ')}</p>` : `<p class="planet-meaning">${sector.house ? 'An empty house does not mean this area of life is missing.' : 'No planets occupy this sign in the provisional noon chart.'}</p>`}
      ${sector.meaning ? `<p class="house-reflection">${sector.meaning.prompt}</p>` : ''}`;
  }
  function hideTooltip() {hovered = null; tooltip.hidden = true; all('[aria-describedby="houseTooltip"]').forEach(el => el.removeAttribute('aria-describedby')); updateSector();}
  function explore(el) {
    hovered = el.dataset.sign;
    const sector = signSector(chart, hovered, divisional);
    tooltip.innerHTML = `<strong>${sector.house ? `House ${sector.house} · ${sector.meaning.title}` : `${sector.sign} · House unknown`}</strong><span>${sector.meaning?.text || 'Enter a birth time to see the life area for this sign.'}</span>`;
    tooltip.hidden = false;
    all('[aria-describedby="houseTooltip"]').forEach(item => item.removeAttribute('aria-describedby'));
    el.setAttribute('aria-describedby','houseTooltip');
    const cell = el.getBoundingClientRect(), box = stage.getBoundingClientRect();
    const left = Math.max(0, Math.min(cell.left - box.left + cell.width / 2 - tooltip.offsetWidth / 2, box.width - tooltip.offsetWidth));
    const below = cell.bottom - box.top + 8;
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${below + tooltip.offsetHeight < box.height ? below : Math.max(0, cell.top - box.top - tooltip.offsetHeight - 8)}px`;
    updateSector();
  }
  all('[data-sign]').forEach((el,i,items) => {
    el.addEventListener('pointerenter', event => {if (event.pointerType !== 'touch') explore(el);});
    el.addEventListener('pointerleave', hideTooltip);
    el.addEventListener('focus', () => explore(el));
    el.addEventListener('blur', hideTooltip);
    el.addEventListener('click', () => {state.sign = el.dataset.sign; hideTooltip();});
    el.addEventListener('keydown', event => {
      if (['Enter',' '].includes(event.key)) {event.preventDefault(); state.sign = el.dataset.sign; hideTooltip();}
      if (event.key === 'Escape') {event.preventDefault(); hideTooltip();}
      if (['ArrowRight','ArrowDown','ArrowLeft','ArrowUp','Home','End'].includes(event.key)) {
        event.preventDefault();
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? 11 : (i + (['ArrowLeft','ArrowUp'].includes(event.key) ? -1 : 1) + 12) % 12;
        items[next].focus();
      }
    });
  });
  all('[data-house-shortcut]').forEach(button => button.onclick = () => {
    const {rising} = chartPlacements(chart, divisional);
    state.sign = SIGNS[(SIGNS.indexOf(rising) + Number(button.dataset.houseShortcut) - 1) % 12];
    hideTooltip();
  });

  function renderAi() {
    if (!alive || state.tab !== 'ai') return;
    const thread = state.messages.map(message => `<div class="ai-message ${message.role}"><span class="ai-message-label">${message.role === 'user' ? 'YOU' : 'DEEPSEEK'}</span><div class="ai-message-body" data-message-id="${message.id}"></div></div>`).join('');
    content.innerHTML = `<div class="ai-intro"><span class="ai-orbit" aria-hidden="true">✧</span><p class="eyebrow">A LITTLE DEEPER</p><h3>Your sky, in words.</h3><p>DeepSeek starts with a chart overview. Ask a follow-up whenever you want to go deeper.</p></div>
      <p class="ai-connection ${state.available === false ? 'not-connected' : ''}" role="status"><span></span>${checking ? 'Checking DeepSeek connection…' : state.available === true ? 'DeepSeek is connected' : state.available === false ? 'DeepSeek is not connected yet' : 'Connection could not be checked'}</p>
      ${state.available === false ? '<p class="reading-note">AI readings will be available once the site owner connects DeepSeek. You can explore your full basic reading now.</p>' : ''}
      <div class="ai-thread" aria-live="polite" aria-busy="${busy}">${thread || '<p class="ai-thread-empty">Your DeepSeek reading will appear here.</p>'}</div>
      <div class="ai-question-chips" aria-label="Suggested questions">${questions.map((q,i) => `<button data-ai-question="${i}" ${busy ? 'disabled' : ''}>${esc(q)} <span>↗</span></button>`).join('')}</div>
      <form id="aiReadingForm" class="ai-composer"><label for="readingQuestion">Ask a follow-up question</label><textarea id="readingQuestion" maxlength="600" rows="2" required ${busy ? 'disabled' : ''} placeholder="For example: what can I reflect on in relationships?">${esc(state.question)}</textarea><p class="reading-footnote">Your chart placements and question are sent to DeepSeek. Raw birth details are not included.</p><button type="submit" class="primary full" ${busy || checking || state.available !== true ? 'disabled' : ''}>${busy ? '<span class="reading-spinner" aria-hidden="true"></span> Thinking…' : 'Ask DeepSeek <span aria-hidden="true">↗</span>'}</button></form>
      ${state.available !== true && !checking ? '<button class="textbutton full" id="retryConnection">Check connection again</button>' : ''}<p class="error ai-error" role="alert">${esc(state.error)}</p><p class="reading-footnote">AI interpretations may be inaccurate. Treat them as reflections, not predictions.</p>`;
    state.messages.forEach(message => {const node=find(`[data-message-id="${message.id}"]`); if (node) node.textContent=message.text;});
    find('#readingQuestion').oninput = event => {state.question = event.target.value;};
    all('[data-ai-question]').forEach(button => button.onclick = () => {state.question = questions[Number(button.dataset.aiQuestion)]; find('#readingQuestion').value = state.question; find('#readingQuestion').focus();});
    if (find('#retryConnection')) find('#retryConnection').onclick = checkConnection;
    find('#aiReadingForm').onsubmit = generate;
  }
  async function checkConnection() {
    if (checking) return;
    checking = true; renderAi();
    try {const response = await fetch('/api/reading', {signal:AbortSignal.timeout(10000)});const data = await response.json();if (!response.ok) throw Error('Could not check connection.');if (alive) state.available = data.available === true;}
    catch {if (alive) state.available = null;}
    finally {checking = false; renderAi(); if (alive && state.available === true && !state.initialRequested && !state.messages.length) {state.initialRequested = true; generate(null, 'Give me a clear basic overview of my chart and the themes I may want to reflect on.');}}
  }
  async function generate(event, automaticQuestion) {
    event?.preventDefault();
    if (busy || state.available !== true) return;
    const question = (automaticQuestion || state.question).trim();
    if (!question) return;
    state.question = ''; state.error = ''; const id = `${Date.now()}-${Math.random()}`; state.messages.push({id,role:'user',text:question}); busy = true; request = new AbortController(); renderAi();
    try {const response = await fetch('/api/reading', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({context:readingContext(chart, divisional), question}),signal:AbortSignal.any([request.signal, AbortSignal.timeout(55000)])});const data = await response.json();if (!response.ok) {if (data.code === 'NOT_CONFIGURED') state.available = false;throw Error(data.error || 'This reading could not be completed.');}if (alive) state.messages.push({id:`${id}-answer`,role:'assistant',text:data.text,truncated:data.truncated});}
    catch (error) {if (alive) {state.error = error.name === 'TimeoutError' ? 'This reading took too long. Please try again.' : error.name === 'TypeError' || error instanceof SyntaxError ? 'Could not reach the reading service. Please try again.' : error.message;state.messages = state.messages.filter(message => message.id !== id);}}
    finally {busy = false; request = null; renderAi();}
  }
  function renderReading() {
    all('[data-reading-tab]').forEach(button => {
      const selected = button.dataset.readingTab === state.tab;
      button.setAttribute('aria-selected', String(selected)); button.tabIndex = selected ? 0 : -1;
    });
    content.setAttribute('aria-labelledby', state.tab === 'basic' ? 'basicReadingTab' : 'aiReadingTab');
    if (state.tab === 'basic') content.innerHTML = basicReading(chart, divisional);
    else {renderAi(); if (state.available === null) checkConnection();}
  }
  all('[data-reading-tab]').forEach((button,i,buttons) => {
    button.onclick = () => {state.tab = button.dataset.readingTab; renderReading();};
    button.onkeydown = event => {if (['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) {event.preventDefault(); const next = event.key === 'Home' ? 0 : event.key === 'End' ? 1 : 1-i; buttons[next].click(); buttons[next].focus();}};
  });
  updateSector(); renderReading();
  return () => {alive = false; request?.abort();};
}
