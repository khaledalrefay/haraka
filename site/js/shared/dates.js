export const dateKey = (date=new Date())=>`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
export const parseDay = s=>new Date(s+'T12:00:00');
export const arDate = s=>parseDay(s).toLocaleDateString('ar-SY-u-nu-latn',{
weekday:'long',day:'numeric',month:'long'
}
);
export const dayNames = ['أحد','اثنين','ثلاثاء','أربعاء','خميس','جمعة','سبت'];
export const validDate = s=>typeof s==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(s)&&!isNaN(parseDay(s))&&dateKey(parseDay(s))===s;
