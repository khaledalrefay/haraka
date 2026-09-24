import { todayKey, activeExpired } from "../domain/schedule.mjs";
import { compileWorkout, createSession, reduceSession } from "../domain/engine.mjs";
class WorkoutService {
  constructor(repository, content) {
    this.repository = repository;
    this.content = content;
    this.queue = Promise.resolve();
  }
  start(workoutId, options) {
    return this.repository.start(createSession(compileWorkout(this.content, workoutId), options));
  }
  dispatch(command, now = Date.now()) {
    const op = this.queue.then(async () => {
      const old = await this.repository.getActive();
      if (!old) throw Error("No active session");
      const next = reduceSession(old, command, now);
      if (next.revision === old.revision) return old;
      if (next.status !== "active") next.completedDate = todayKey(new Date(now));
      return this.repository.save(next, old.revision);
    });
    this.queue = op.catch(() => {
    });
    return op;
  }
  async reconcile(settings, now = Date.now()) {
    const session = await this.resume();
    if (!session || !activeExpired(settings, session, todayKey(new Date(now)))) return session;
    const next = reduceSession(session, { type: "stop" }, now);
    next.endReason = "expired";
    await this.repository.save(next, session.revision);
    return null;
  }
  resume() {
    return this.repository.getActive();
  }
}
export {
  WorkoutService
};
