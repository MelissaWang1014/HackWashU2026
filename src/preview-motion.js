// Local visual exploration: all astronomical positions stay unchanged.
export function initPreviewMotion() {
  const media = matchMedia('(prefers-reduced-motion: reduce)');
  const toggle = document.querySelector('#motionToggle');
  let paused = media.matches;
  const setMotion = () => {
    document.documentElement.classList.toggle('motion-paused', paused);
    toggle.setAttribute('aria-pressed', String(!paused));
    toggle.textContent = paused ? '◌  Motion off' : '◌  Motion on';
  };
  toggle.onclick = () => {paused = !paused; setMotion();};
  media.addEventListener('change', () => {paused = media.matches; setMotion();});
  setMotion();

}
