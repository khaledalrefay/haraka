import { D, sessionFor } from '../data/plans.js';

export const recordVersion = record => record.planVersion;
export const recordSequence = record => D.sequence(record.session, record.rounds, recordVersion(record));
export const recordTitle = record => sessionFor(record.session, recordVersion(record))?.title || 'جلسة';
