function downloadBackup(value) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(value)], { type: "application/json" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = "Haraka-Backup-" + (/* @__PURE__ */ new Date()).toISOString().slice(0, 10) + ".json";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1e3);
}
export {
  downloadBackup
};
