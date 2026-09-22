import { applyPalette } from './features/preferences.js';
import { bindExerciseImages } from './shared/exercise-image.js';
import { initReminders } from './features/reminders.js';
import { reconcileActive } from './core/reconcile.js';
import {
loadStorage
}
from './core/storage.js';
import {
bindEvents
}
from './core/events.js';
loadStorage();
applyPalette();
reconcileActive();
bindEvents();

initReminders();

bindExerciseImages();
