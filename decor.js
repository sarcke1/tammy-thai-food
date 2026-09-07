(() => {
  const menu = document.querySelector('#menu');
  if (!menu) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scenes = document.querySelectorAll('.side-scene');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => scenes.forEach(scene => scene.classList.toggle('active', entry.isIntersecting)));
  }, {threshold:0.08});
  observer.observe(menu);
  if (reduced) return;
})();
