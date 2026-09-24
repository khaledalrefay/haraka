const DATABASE_NAME = "haraka-vnext";
const DATABASE_VERSION = 1;
function openStorage({ name = DATABASE_NAME, factory = globalThis.indexedDB } = {}) {
  return new Promise((resolve, reject) => {
    if (!factory) return reject(Error("IndexedDB unavailable"));
    const r = factory.open(name, DATABASE_VERSION);
    r.onupgradeneeded = () => {
      const db = r.result;
      for (const n of ["settings", "active", "history"]) if (!db.objectStoreNames.contains(n)) db.createObjectStore(n);
    };
    r.onerror = () => reject(r.error);
    r.onblocked = () => reject(Error("Database upgrade blocked: close other tabs"));
    r.onsuccess = () => {
      const db = r.result;
      db.onversionchange = () => db.close();
      resolve(new Repository(db));
    };
  });
}
function request(r) {
  return new Promise((resolve, reject) => {
    r.onsuccess = () => resolve(r.result);
    r.onerror = () => reject(r.error);
  });
}
class Repository {
  constructor(db) {
    this.db = db;
  }
  close() {
    this.db.close();
  }
  async transaction(names, mode, run) {
    const tx = this.db.transaction(names, mode);
    const done = new Promise((resolve, reject) => {
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error || Error("Transaction aborted"));
    });
    try {
      const result = await run((n) => tx.objectStore(n));
      await done;
      return result;
    } catch (e) {
      try {
        tx.abort();
      } catch {
      }
      await done.catch(() => {
      });
      throw e;
    }
  }
  getActive() {
    return this.transaction(["active"], "readonly", (s) => request(s("active").get("current")));
  }
  getSettings() {
    return this.transaction(["settings"], "readonly", (s) => request(s("settings").get("preferences")));
  }
  saveSettings(settings) {
    return this.transaction(["settings"], "readwrite", (s) => request(s("settings").put(structuredClone(settings), "preferences")));
  }
  exportData() {
    return this.transaction(["settings", "active", "history"], "readonly", async (s) => ({ settings: await request(s("settings").get("preferences")), active: await request(s("active").get("current")) || null, history: await request(s("history").getAll()) }));
  }
  restoreData(data) {
    return this.transaction(["settings", "active", "history"], "readwrite", async (s) => {
      for (const n of ["settings", "active", "history"]) await request(s(n).clear());
      await request(s("settings").put(structuredClone(data.settings), "preferences"));
      if (data.active) await request(s("active").put(structuredClone(data.active), "current"));
      for (const h of data.history) await request(s("history").put(structuredClone(h), h.id));
    });
  }
  deleteRecord(id) {
    return this.transaction(["history"], "readwrite", (s) => request(s("history").delete(id)));
  }
  listHistory() {
    return this.transaction(["history"], "readonly", (s) => request(s("history").getAll()));
  }
  start(session) {
    if (session.status !== "active" || session.cursor !== 0 || session.revision !== 0 || !session.snapshot?.steps?.length) throw Error("Invalid new session");
    return this.transaction(["active", "history"], "readwrite", async (s) => {
      if (await request(s("active").get("current"))) throw Error("Active session already exists");
      const history = await request(s("history").getAll());
      if (history.some((x) => x.id === session.id)) throw Error("Session id already used");
      if (history.some((x) => x.dateKey === session.dateKey || x.completedDate === session.dateKey)) throw Error("Date already completed");
      if (history.some((x) => (x.scheduledDate || x.dateKey) === (session.scheduledDate || session.dateKey))) throw Error("Scheduled slot already recorded");
      await request(s("active").put(structuredClone(session), "current"));
      return session;
    });
  }
  save(session, expectedRevision) {
    return this.transaction(["active", "history"], "readwrite", async (s) => {
      const old = await request(s("active").get("current"));
      if (!old || old.id !== session.id || old.revision !== expectedRevision) throw Error("Session write conflict");
      if (session.revision !== expectedRevision + 1 || session.dateKey !== old.dateKey || session.cursor < old.cursor || session.cursor > old.snapshot.steps.length) throw Error("Invalid session update");
      const value = { ...structuredClone(session), snapshot: old.snapshot, startedAt: old.startedAt, scheduledDate: old.scheduledDate };
      if (["completed", "stopped"].includes(value.status)) {
        if (value.status === "completed" && value.cursor !== old.snapshot.steps.length) throw Error("Incomplete session");
        await request(s("history").put(value, value.id));
        await request(s("active").delete("current"));
      } else if (value.status === "active") await request(s("active").put(value, "current"));
      else throw Error("Invalid status");
      return value;
    });
  }
}
export {
  DATABASE_NAME,
  DATABASE_VERSION,
  Repository,
  openStorage
};
