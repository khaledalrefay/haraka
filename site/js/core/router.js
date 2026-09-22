import { summary } from '../features/completion.js';
import {
runtime
}
from './store.js';
import {
main, $
}
from '../shared/ui.js';
import {
renderPlayer
}
from '../features/workout.js';
import {
library
}
from '../features/exercises.js';
import {
history
}
from '../features/history.js';
import {
today
}
from '../features/today.js';
export function navigate(to){
runtime.view=to;
location.hash=to;
render();
window.scrollTo({
top:0,behavior:'instant'
}
);
main.focus({
preventScroll:true
}
);
}
export const tabs = [['today','home','اليوم'],['library','book','التمارين'],['history','history','سجلّي']];
export function render(){
$('.bottom-nav').hidden=runtime.view==='session';
document.querySelectorAll('[data-nav]').forEach(b=>{
b.classList.toggle('active',b.dataset.nav===runtime.view);
b.setAttribute('aria-current',b.dataset.nav===runtime.view?'page':'false');
}
);
if(runtime.view==='session')renderPlayer();
else if(runtime.view==='library')library();
else if(runtime.view==='history')history();
else if(runtime.view==='summary') {
  const record = runtime.state.history.at(-1);
  if (record) summary(record);
  else { runtime.view='today'; today(); }
}
else{
runtime.view='today';
today();
}
}
