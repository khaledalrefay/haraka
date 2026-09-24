const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
function button(text, action, cls = "secondary", extra = "") {
  return `<button type="button" class="${cls}" data-action="${action}" ${extra}>${text}</button>`;
}
function movementName(s, map) {
  return s.exerciseId === "march" ? { gentle: "مشي هادئ بالمكان", progressive: "مشي متدرج بالمكان", active: "مشي نشيط بالمكان", slow: "مشي بطيء بالمكان", decelerating: "مشي يتباطأ تدريجيًا" }[s.pace] || "مشي بالمكان" : map[s.exerciseId].name_ar;
}
function goal(s) {
  if (s.type === "rest") return `${s.seconds} ثانية`;
  return `${s.target} ${s.unit === "seconds" ? "ثانية" : s.unit === "cycles" ? "دورات" : "عدّات"}${s.sides === 2 ? " لكل جهة" : ""}`;
}
export {
  button,
  esc,
  goal,
  movementName
};
