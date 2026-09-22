import {
runtime
}
from '../core/store.js';
import {
save
}
from '../core/storage.js';
import {
renderPlayer
}
from './workout.js';
export async function prepareSound(){
try{
const Audio=window.AudioContext||window.webkitAudioContext;
if(!Audio)return false;
if(!runtime.audioContext||runtime.audioContext.state==='closed')runtime.audioContext=new Audio();
if(runtime.audioContext.state!=='running')await runtime.audioContext.resume();
return runtime.audioContext.state==='running';
}
catch{
return false;
}
}
export function ringTimer(){
if(runtime.state.settings.sound==='silent')return true;
if(!runtime.audioContext||runtime.audioContext.state!=='running')return false;
try{
const now=runtime.audioContext.currentTime;
({chime:[[0,523.25,.28],[.22,659.25,.28],[.44,783.99,.32],[.72,1046.5,.8]],bell:[[0,880,1],[.45,1320,.8]],pulse:[[0,660,.18],[.32,660,.18]],soft:[[0,392,.8],[.5,523.25,.8]],rise:[[0,440,.2],[.16,554,.2],[.32,659,.2],[.48,880,.6]]}[runtime.state.settings.sound] || []).forEach(([offset,frequency,duration])=>{
const tone=runtime.audioContext.createOscillator(),volume=runtime.audioContext.createGain();
tone.type='sine';
tone.frequency.value=frequency;
volume.gain.setValueAtTime(0,now+offset);
volume.gain.linearRampToValueAtTime(0.16,now+offset+0.02);
volume.gain.exponentialRampToValueAtTime(0.001,now+offset+duration);
tone.connect(volume);
volume.connect(runtime.audioContext.destination);
tone.onended=()=>{
tone.disconnect();
volume.disconnect();
}
;
tone.start(now+offset);
tone.stop(now+offset+duration+0.02);
}
);
return true;
}
catch{
return false;
}
}
export function remaining(){
const t=runtime.state.active?.timer;
return t?(t.running?Math.max(0,t.deadline-Date.now()):t.remaining):0;
}
export function pauseTimer(){
const t=runtime.state.active?.timer;
if(t?.running){
t.remaining=remaining();
t.running=false;
t.deadline=0;
save();
}
}
export function toggleTimer(){
const t=runtime.state.active?.timer;
if(!t)return;
if(t.running)pauseTimer();
else if(t.remaining>0){
t.running=true;
t.deadline=Date.now()+t.remaining;
save();
}
renderPlayer();
}
export const timeText = ms=>{
const n=Math.ceil(ms/1000);
return `${String(Math.floor(n/60)).padStart(2,'0')}:${String(n%60).padStart(2,'0')}`;
}
;
