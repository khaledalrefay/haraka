import {
dateKey
}
from '../shared/dates.js';
export const KEY = 'haraka-release-v1';
export const uid = ()=>globalThis.crypto?.randomUUID?.()||`${Date.now()}-${Math.random().toString(36).slice(2)}`;
export const DEFAULT_SETTINGS = Object.freeze({
rounds:1,rest:45,palette:"classic",sound:"chime"
}
);
export const defaults = ()=>({
schema:2,settings:{ ...DEFAULT_SETTINGS }
,history:[],active:null,scheduleRevisions:[]
}
);
export const finite = n=>typeof n==='number'&&Number.isFinite(n);
export const runtime = {
state: defaults(),
storageBroken: false,
rawBroken: null,
selected: dateKey(),
view: 'today',
lastFocus: null,
toastTimeout: undefined,
audioContext: null,
backupUrl: null,
pendingImport: null,
pendingStart: null,
scheduleDraft: null,
observedDay: dateKey()
}
;
