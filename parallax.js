(() => {
  let ticking = false;
  const update = () => {
    document.documentElement.style.setProperty('--scroll-y', `${window.scrollY}px`);
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  }, {passive:true});
  update();
})();
