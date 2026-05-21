(function () {
  const finePointer = window.matchMedia('(pointer: fine) and (hover: hover)').matches;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!finePointer || reducedMotion) return;

  const ring = document.createElement('div');
  const dot = document.createElement('div');
  ring.className = 'custom-cursor';
  dot.className = 'custom-cursor__dot';
  document.body.append(ring, dot);
  document.documentElement.classList.add('cursor-ready');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;
  let rafId = null;

  function render() {
    const dx = mouseX - ringX;
    const dy = mouseY - ringY;
    ringX += dx * 0.18;
    ringY += dy * 0.18;
    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
      rafId = requestAnimationFrame(render);
    } else {
      rafId = null;
    }
  }

  function isInteractive(target) {
    return Boolean(target.closest('a, button, input, textarea, select, summary, label, [role="button"], [tabindex]:not([tabindex="-1"])'));
  }

  window.addEventListener('mousemove', event => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    document.documentElement.classList.add('cursor-visible');
    document.documentElement.classList.toggle('cursor-hover', isInteractive(event.target));
    if (!rafId) rafId = requestAnimationFrame(render);
  }, { passive: true });

  window.addEventListener('mouseout', event => {
    if (!event.relatedTarget) {
      document.documentElement.classList.remove('cursor-visible', 'cursor-hover');
    }
  });

  window.addEventListener('blur', () => {
    document.documentElement.classList.remove('cursor-visible', 'cursor-hover');
  });
})();
