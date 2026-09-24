function writeReminderGuard(value) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("haraka-reminder-guard", 1);
    request.onupgradeneeded = () => request.result.createObjectStore("settings");
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction("settings", "readwrite");
      tx.objectStore("settings").put(value, "current");
      tx.oncomplete = () => {
        db.close();
        resolve();
      };
      tx.onerror = () => {
        db.close();
        reject(tx.error);
      };
      tx.onabort = () => {
        db.close();
        reject(tx.error);
      };
    };
  });
}
export {
  writeReminderGuard
};
