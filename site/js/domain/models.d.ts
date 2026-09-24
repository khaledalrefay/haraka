/** Documentation contracts; runtime validation remains in engine and backup modules. */
export type Program = 'move'|'foundation'|'strength'|'hybrid'|'circuit';
export type DateKey = string; // YYYY-MM-DD in Asia/Damascus
export type SessionLetter = 'A'|'B'|'C';
export interface PlanRevision { effectiveFrom: DateKey; program: Program; level: 1|2|3; schedule: {day: number; session: SessionLetter}[] }
export interface Settings { schemaVersion: 1; palette: string; sound: string; theme: 'light'|'dark'; revisions: PlanRevision[]; levels: Record<Program, 1|2|3> }
export interface StepContext { id: string; block: string; set?: number; sets?: number; round?: number; rounds?: number; station?: number; stations?: number; side?: 'right'|'left' }
export interface WorkStep extends StepContext { type: 'work'; exerciseId: string; target: number; unit: 'seconds'|'reps'|'cycles'; sides: 1|2; sideMode: string; pauseSeconds: number; pace: string|null; prescriptionId: string|null }
export interface RestStep extends StepContext { type: 'rest'; seconds: number; reason: string }
export interface Timer { totalMs?: number; remainingMs: number; running: boolean; startedAt: number|null }
export interface Snapshot { contentVersion: string; workout: {id: string; program: Program; session: SessionLetter; level: number; blocks: unknown[]; plannedMinutes: number[]}; exercises: Record<string, unknown>; steps: (WorkStep|RestStep)[] }
export interface Session { id: string; schemaVersion: 1; revision: number; dateKey: DateKey; scheduledDate: DateKey; completedDate?: DateKey; status: 'active'|'completed'|'stopped'; startedAt: number; finishedAt?: number; endReason?: 'expired'; snapshot: Snapshot; cursor: number; results: {stepId:string; outcome:'done'|'skipped'; at:number}[]; timer:Timer|null; hidden?:boolean }
export interface RepositoryData {settings:Settings; active:Session|null; history:Session[]}
export interface Backup {format:'haraka-v2'; version:1; contentVersion:string; exportedAt:string; data:RepositoryData}
export interface WorkoutRepository {getActive():Promise<Session|undefined>; getSettings():Promise<Settings|undefined>; saveSettings(settings:Settings):Promise<unknown>; savePlan(settings:Settings,options?:{resetDay?:string|null}):Promise<void>; start(session:Session):Promise<Session>; save(session:Session,expectedRevision:number):Promise<Session>; listHistory():Promise<Session[]>; deleteRecord(id:string):Promise<unknown>; exportData():Promise<RepositoryData>; restoreData(data:RepositoryData):Promise<void>; close():void}
