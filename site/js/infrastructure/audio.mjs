import { sounds } from "../data/sounds.mjs";
let ctx;
async function prepareSound() {
  try {
    ctx ??= new (window.AudioContext || window.webkitAudioContext)();
    await ctx.resume();
  } catch {
  }
}
function ring(sound) {
  if (!ctx || ctx.state !== "running") return;
  const notes = { chime: [[0, 523, 0.28], [0.22, 659, 0.28], [0.44, 784, 0.32], [0.72, 1047, 0.8]], bell: [[0, 880, 1], [0.45, 1320, 0.8]], pulse: [[0, 660, 0.18], [0.32, 660, 0.18]], soft: [[0, 392, 0.8], [0.5, 523, 0.8]], rise: [[0, 440, 0.2], [0.16, 554, 0.2], [0.32, 659, 0.2], [0.48, 880, 0.6]], silent: [] }[sound] || [];
  for (const [offset, hz, duration] of notes) {
    const o = ctx.createOscillator(), g = ctx.createGain(), t = ctx.currentTime + offset;
    o.frequency.value = hz;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.16, t + 0.02);
    g.gain.exponentialRampToValueAtTime(1e-3, t + duration);
    o.connect(g);
    g.connect(ctx.destination);
    o.onended = () => {
      o.disconnect();
      g.disconnect();
    };
    o.start(t);
    o.stop(t + duration + 0.02);
  }
}
export {
  prepareSound,
  ring,
  sounds
};
