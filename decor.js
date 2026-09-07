(() => {
  const menu = document.querySelector('#menu');
  const elephant = document.querySelector('#side-elephant');
  if (!menu) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scenes = document.querySelectorAll('.side-scene');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => scenes.forEach(scene => scene.classList.toggle('active', entry.isIntersecting)));
  }, {threshold:0.08});
  observer.observe(menu);
  if (!elephant || reduced) return;
  let lastY = window.scrollY;
  let ticking = false;
  const update = () => {
    const y = window.scrollY;
    if (y > lastY + 2) elephant.src = 'assets/elephant-side-raised.svg';
    else if (y < lastY - 2) elephant.src = 'assets/elephant-side.svg';
    lastY = y;
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, {passive:true});
})();
