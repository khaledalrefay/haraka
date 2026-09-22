import { exercises as originalExercises, E as originalIndex } from './exercises.js';
import { newExercises } from './new-exercises.js';

export const PLAN_VERSION = 3;
export const SUPPORTED_VERSIONS = [3];
const item = (id, dose, seconds = 0, estimate = 40, extra = {}) => ({ id, dose, seconds, estimate, ...extra });
const ten = id => item(id, 'حتى 10 عدّات');
const eachFive = id => item(id, '10 بالمجموع · 5 لكل جهة', 0, 50);

// estimate is only for planning duration. It never runs a repetitions timer.
const warm = [
  item('march', 'دقيقتان ونصف بإيقاع مريح', 150),
  item('side-step', 'دقيقة ونصف بخطوات خفيفة', 90),
  item('shoulders', 'حتى 10 لفات مريحة'),
  item('chair-squat', '5 عدّات سهلة للتجهيز', 0, 20)
];
const cool = [
  item('march', 'دقيقة ونصف ببطء', 90),
  item('chest', '20 ثانية × مرتين', 40),
  item('breathe', 'دقيقة بتنفس طبيعي', 60)
];
const sessions = {
  A: { id: 'A', title: 'قوة أساسية', subtitle: 'قوة الرجلين والدفع · ثبات الجذع', day: 0,
    items: [ten('chair-squat'), ten('incline-push'), ten('bridge'), eachFive('bird-dog'), ten('wall-slide')] },
  B: { id: 'B', title: 'توازن وتحكّم', subtitle: 'توازن الرجلين · تحكم بالكتفين والجذع', day: 2,
    items: [
      item('split-squat', '5 عدّات · القدم اليمنى أمامًا', 0, 25, { side: 'يمين' }),
      item('split-squat', '5 عدّات · القدم اليسرى أمامًا', 0, 25, { side: 'يسار' }),
      ten('wall-push'), ten('calf'),
      item('side-plank', '10 ثوانٍ', 10, 10, { side: 'يمين' }),
      item('side-plank', '10 ثوانٍ', 10, 10, { side: 'يسار' }),
      ten('wall-slide')
    ] },
  C: { id: 'C', title: 'قوة وتحمّل حركي', subtitle: 'حركة للجسم كاملًا · دون قفز', day: 4,
    items: [ten('chair-squat'), ten('incline-push'), ten('bridge'), eachFive('heel-slide'), item('active-march', 'حتى دقيقة · يمكنك التوقف قبلها', 60)] },
  mobility: {id:'mobility',title:'حركة لطيفة في يوم الراحة',subtitle:'اختيارية · ضمن المدى المريح',items:[item('shoulders','5 لفات'),item('neck','مرتان لكل جهة'),item('chest','20 ثانية',20),item('breathe','دقيقة',60)]},
  break: {id:'break',title:'استراحة اللابتوب',subtitle:'دقيقتان لتغيير الوضعية',items:[item('march','دقيقة',60),item('shoulders','5 لفات'),item('neck','مرتان لكل جهة'),item('chest','20 ثانية',20)]}
};
const allExercises = [...originalExercises, ...newExercises];
const E = { ...originalIndex, ...Object.fromEntries(newExercises.map(e => [e.id, e])) };
const currentIds = new Set([...warm, ...cool, ...Object.values(sessions).flatMap(s => s.items)].map(i => i.id));
const exercises = allExercises.filter(e => currentIds.has(e.id));

export function sessionFor(id, version = PLAN_VERSION) {
  if (!SUPPORTED_VERSIONS.includes(version)) return null;
  return sessions[id] || null;
}
export function sequence(id, rounds = 1, version = PLAN_VERSION) {
  if (![1, 2].includes(rounds) || !SUPPORTED_VERSIONS.includes(version)) return [];
  const s = sessions[id];
  if (!s) return [];
  if (id === 'break' || id === 'mobility') return s.items.map(i => ({ ...i, phase: id === 'break' ? 'استراحة اللابتوب' : 'حركة اختيارية', round: 1 }));
  return [
    ...warm.map(i => ({ ...i, phase: 'التسخين', round: 0 })),
    ...Array.from({ length: rounds }, (_, r) => s.items.map(i => ({ ...i, phase: 'التمارين', round: r + 1 }))).flat(),
    ...cool.map(i => ({ ...i, phase: 'التهدئة', round: 0 }))
  ];
}
// Paired sides use a manual transition; round breaks remain one minute.
export function restBetween(previous, next, version = PLAN_VERSION, rest = 45) {
  if (!previous || !next || previous.phase !== 'التمارين' || next.phase !== 'التمارين') return 0;
  if (previous.round !== next.round) return 60;
  if (previous.id === next.id && previous.side && next.side) return 0;
  return rest;
}
export function estimatedMinutes(id, rounds = 1, version = PLAN_VERSION, rest = 45) {
  const seq = sequence(id, rounds, version);
  const seconds = seq.reduce((total, step, index) => total + (step.seconds || step.estimate || 40) + 10 + restBetween(step, seq[index + 1], version, rest), 0);
  // The range accounts for pace and transitions; extra pauses may extend it.
  return { min: Math.max(1, Math.floor(seconds / 60)), max: Math.ceil(seconds / 60) + 3 };
}
export function durationLabel(id, rounds = 1, version = PLAN_VERSION, rest = 45) {
  const { min, max } = estimatedMinutes(id, rounds, version, rest);
  return `${min}–${max} دقيقة تقريبًا`;
}
export const roundsLabel = rounds => rounds === 2 ? 'جولتان' : 'جولة واحدة';
export const D = { exercises, E, sessions, warm, cool, sequence, version: PLAN_VERSION };
