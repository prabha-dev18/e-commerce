/** Animates a small gold dot from an element to the header cart button. */
export function flyToCart(fromEl) {
  if (typeof document === 'undefined' || !fromEl) return;
  const target = document.querySelector('[aria-label="Open cart"]');
  if (!target || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const a = fromEl.getBoundingClientRect();
  const b = target.getBoundingClientRect();
  const dot = document.createElement('div');
  Object.assign(dot.style, { position: 'fixed', zIndex: 9999, width: '16px', height: '16px', borderRadius: '50%', background: '#B99A6B', left: `${a.left + a.width / 2 - 8}px`, top: `${a.top + a.height / 2 - 8}px`, pointerEvents: 'none' });
  document.body.appendChild(dot);
  const dx = b.left + b.width / 2 - (a.left + a.width / 2);
  const dy = b.top + b.height / 2 - (a.top + a.height / 2);
  const anim = dot.animate(
    [{ transform: 'translate(0,0) scale(1)', opacity: 1 }, { transform: `translate(${dx * 0.5}px, ${dy * 0.5 - 60}px) scale(1.2)`, opacity: 1, offset: 0.5 }, { transform: `translate(${dx}px, ${dy}px) scale(0.3)`, opacity: 0.4 }],
    { duration: 700, easing: 'cubic-bezier(.5,0,.8,.4)' }
  );
  anim.onfinish = () => dot.remove();
}
