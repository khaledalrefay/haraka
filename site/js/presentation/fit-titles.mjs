/** Fits long names inside a two-line slot. Never truncate; expand only at the readable floor. */
export function observeTitles(root = document.body) {
  let frame;
  const fit = el => {
    if (!el.clientWidth) return;
    el.classList.remove('title-expanded'); el.style.removeProperty('font-size');
    const initial = parseFloat(getComputedStyle(el).fontSize), floor = initial * .82;
    let size = initial;
    while ((el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1) && size > floor) {
      size = Math.max(floor, size - .5); el.style.fontSize = `${size}px`;
    }
    if (el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1) el.classList.add('title-expanded');
  };
  const scan = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(() => root.querySelectorAll('[data-fit-title]').forEach(fit)); };
  new MutationObserver(scan).observe(root, {childList:true,subtree:true});
  new ResizeObserver(scan).observe(root);
  root.addEventListener('toggle', scan, true);
  window.addEventListener('resize', scan);
  document.fonts.ready.then(scan); scan();
}
